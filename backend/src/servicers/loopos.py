"""LoopOS servicers — User and OpsTicket.

Wires ingest → triage → (auto-authorize OR await human) end-to-end.
T8 will add the dispatch_with_escalation workflow body; T9 fills
propose_new_rule. T6 fills live_state and show_brain_sources readers.
"""
import json
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

from loopos.v1.loopos import (
    ActivityEvent,
    BrainHistorical,
    BrainSOP,
    BrainVoiceMemo,
    Dispatch,
    HistoryEvent,
    PropertyCost,
    SkillArtifact,
    SkillSources,
    TicketSummary,
)
from loopos.v1.loopos_rbt import OpsTicket, User
from reboot.aio.contexts import (
    ReaderContext,
    TransactionContext,
    WorkflowContext,
    WriterContext,
)

from servicers.helpers import llm, retrieval, whisper

_PROJECT_ROOT = Path(__file__).resolve().parents[3]
_DATA_DIR = _PROJECT_ROOT / "data"


# ────────────────────────── Utilities ──────────────────────────


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _load_properties() -> dict[str, dict[str, Any]]:
    rows = json.loads((_DATA_DIR / "properties.json").read_text())
    return {p["id"]: p for p in rows}


def _load_team_for_property(property_id: str) -> Optional[dict[str, Any]]:
    team = json.loads((_DATA_DIR / "team.json").read_text())
    for member in team:
        if property_id in member.get("properties", []):
            return member
    return None


def _add_event(state: Any, type_: str, payload: dict[str, Any]) -> None:
    state.history.append(
        HistoryEvent(
            ts=_utc_now_iso(),
            type=type_,
            payload_json=json.dumps(payload, ensure_ascii=False),
        )
    )


_DEFAULT_SPONSORS = {
    "ingested": "Reboot",
    "transcribed": "Runpod",
    "translated": "TokenRouter",
    "classified": "TokenRouter",
    "brain_retrieved": "Reboot",
    "dispatched": "TokenRouter",
    "triage_decision": "Reboot",
    "dispatch_acknowledged": "Reboot",
    # rule_proposed: Reboot generates the prompt; Lightsprint only runs if
    # the operator pastes the prompt into Lightsprint's sandbox. Honest
    # attribution: the action in our system is Reboot's.
    "rule_proposed": "Reboot",
    "triaged": "Reboot",
    "triaged_and_authorized": "Reboot",
}


def _default_sponsor_for_event_type(type_: str) -> str:
    return _DEFAULT_SPONSORS.get(type_, "Reboot")


def _default_summary_for_event(type_: str, payload: dict[str, Any]) -> str:
    if type_ == "ingested":
        return f"ticket created from {payload.get('source','')} input"
    if type_ == "dispatch_acknowledged":
        return f"dispatch {payload.get('dispatch_id','')[:14]} acknowledged"
    if type_ == "rule_proposed":
        return f"rule proposed: {payload.get('title','')}"
    return type_.replace("_", " ")


def _maybe_translate(text: str, language: str, ticket_id: str, property_id: str) -> tuple[str, Optional[dict[str, Any]]]:
    """Translate non-English transcript to English via reason_strong.

    Falls back to the input text if no LLM credentials are configured (dev
    fixture path). The actual demo always has env vars set.

    Returns (text, usage_row_or_None).
    """
    if not text or language.lower().startswith("en"):
        return text, None
    if not os.environ.get("TOKENROUTER_API_KEY"):
        return text, None
    try:
        prompt = (
            "Translate the following ops message to English. "
            "Return ONLY the English translation, no preamble.\n\n"
            f"Source language: {language}\nMessage: {text}"
        )
        result, row = llm.reason_strong(prompt, property_id=property_id, ticket_id=ticket_id)
        return result.strip(), row
    except Exception as exc:
        print(f"[triage] translate fallback (returning native): {exc}")
        return text, None


def _classify_with_fallback(
    text: str, property_id: str, ticket_id: str
) -> tuple[dict[str, Any], Optional[dict[str, Any]]]:
    """classify_fast with deterministic fallback. Returns (classification, usage_row_or_None)."""
    if os.environ.get("TOKENROUTER_API_KEY"):
        try:
            classification, row = llm.classify_fast(text, property_id=property_id, ticket_id=ticket_id)
            return classification, row
        except Exception as exc:
            print(f"[triage] classify fallback: {exc}")

    # Deterministic fallback heuristics so the demo never blocks.
    lower = text.lower()
    if any(t in lower for t in ["ac", "leak", "hvac", "冷氣", "漏水"]):
        c = {
            "category": "hvac_leak",
            "severity": 4 if any(t in lower for t in ["outlet", "插座", "electrical", "angry"]) else 3,
            "language": "zh-TW" if any(c in text for c in "冷氣漏水插座") else "en",
            "urgency_window_minutes": 180,
            "risk_tags": ["electrical_risk"] if any(t in lower for t in ["outlet", "插座", "electrical"]) else [],
        }
    elif any(t in lower for t in ["lockout", "locked out", "鍵を開けられない", "kunci"]):
        c = {
            "category": "lockout",
            "severity": 3,
            "language": "ja" if "鍵" in text else ("id" if "kunci" in lower else "en"),
            "urgency_window_minutes": 30,
            "risk_tags": [],
        }
    elif any(t in lower for t in ["plumb", "pipe", "water", "pipa", "蛇口", "水漏れ"]):
        c = {
            "category": "plumbing_leak",
            "severity": 3,
            "language": "ja" if any(j in text for j in "蛇口水漏れ") else ("id" if "pipa" in lower else "en"),
            "urgency_window_minutes": 120,
            "risk_tags": [],
        }
    else:
        c = {
            "category": "general_inquiry",
            "severity": 2,
            "language": "en",
            "urgency_window_minutes": 240,
            "risk_tags": [],
        }
    return c, None


def _draft_dispatch_with_fallback(
    text: str,
    brain: dict[str, Any],
    property_record: dict[str, Any],
    category: str,
    ticket_id: str,
) -> tuple[dict[str, Any], Optional[dict[str, Any]]]:
    """Drafts vendor + cost. Returns (draft, usage_row_or_None)."""
    skill = brain.get("synthesized_skill") or {}
    preferred_vendors: list[str] = (
        skill.get("preferred_vendors")
        or property_record.get("preferred_vendors_by_issue", {}).get(category, [])
    )
    historical = brain.get("historical_resolutions") or []
    historical_cost = (
        historical[0].get("actual_cost_usd") if historical else None
    )

    cost_estimate = float(historical_cost or skill.get("auth_cap_usd", 150) or 150)
    cost_cap = float(skill.get("auth_cap_usd", 200))
    vendor_id = preferred_vendors[0] if preferred_vendors else "manual_dispatch"

    if os.environ.get("TOKENROUTER_API_KEY"):
        try:
            prompt = (
                "Draft an ops dispatch decision as JSON. Return only the JSON, "
                "no preamble.\n\n"
                f"Ticket text: {text}\n"
                f"Property: {property_record.get('name')} ({property_record.get('city')})\n"
                f"Preferred vendors (in order): {preferred_vendors}\n"
                f"Historical avg cost: {historical_cost}\n"
                f"Auth cap: {cost_cap}\n"
                f"Category: {category}\n\n"
                "Required keys: vendor_id (string from preferred), "
                "cost_estimate_usd (number), eta_minutes (int), "
                "notes_for_vendor (string), notes_for_guest (string)."
            )
            raw, row = llm.reason_strong(prompt, property_id=property_record["id"], ticket_id=ticket_id)
            parsed = json.loads(raw)
            return {
                "vendor_id": parsed.get("vendor_id", vendor_id),
                "cost_estimate_usd": float(parsed.get("cost_estimate_usd", cost_estimate)),
                "eta_minutes": int(parsed.get("eta_minutes", 90)),
                "notes_for_vendor": parsed.get("notes_for_vendor", ""),
                "notes_for_guest": parsed.get("notes_for_guest", ""),
            }, row
        except Exception as exc:
            print(f"[triage] dispatch draft fallback: {exc}")

    return {
        "vendor_id": vendor_id,
        "cost_estimate_usd": cost_estimate,
        "eta_minutes": 90,
        "notes_for_vendor": "",
        "notes_for_guest": "",
    }, None


def _ticket_summary_from_state(ticket_id: str, state: Any) -> TicketSummary:
    snippet = state.transcript_en or state.transcript_native or state.raw_input
    snippet = (snippet or "")[:140]
    last_action = state.history[-1].type if state.history else state.status
    return TicketSummary(
        ticket_id=ticket_id,
        property_id=state.property_id,
        status=state.status,
        severity=state.severity,
        category=state.category,
        last_action=last_action,
        cost_authorized_usd=state.cost_authorized_usd,
        snippet=snippet,
    )


# ────────────────────────── UserServicer ──────────────────────────


class UserServicer(User.Servicer):

    async def ingest_text_message(
        self,
        context: TransactionContext,
        request: User.IngestTextMessageRequest,
    ) -> User.IngestTextMessageResponse:
        """Demo critical path — text → OpsTicket → triage."""
        ticket, _ = await OpsTicket.create(
            context,
            property_id=request.property_id,
            source="text",
            raw_input=request.text,
            transcript_native=request.text,
            transcript_en="",
            detected_language="",
            sender_user_id=request.sender_user_id,
            created_at=_utc_now_iso(),
        )
        self.state.ticket_ids.append(ticket.state_id)
        await OpsTicket.ref(ticket.state_id).triage(context)
        return User.IngestTextMessageResponse(ticket_id=ticket.state_id)

    async def ingest_voice_note(
        self,
        context: TransactionContext,
        request: User.IngestVoiceNoteRequest,
    ) -> User.IngestVoiceNoteResponse:
        """Voice path — Whisper transcribe (or fallback dict) → OpsTicket → triage."""
        transcript = whisper.transcribe_and_translate(request.audio_url)
        ticket, _ = await OpsTicket.create(
            context,
            property_id=request.property_id,
            source="voice",
            raw_input=request.audio_url,
            transcript_native=transcript.get("text_native", ""),
            transcript_en=transcript.get("text_en", ""),
            detected_language=transcript.get("language", ""),
            sender_user_id=request.sender_user_id,
            created_at=_utc_now_iso(),
        )
        self.state.ticket_ids.append(ticket.state_id)
        await OpsTicket.ref(ticket.state_id).triage(context)
        return User.IngestVoiceNoteResponse(ticket_id=ticket.state_id)

    async def list_tickets(
        self,
        context: ReaderContext,
    ) -> User.ListTicketsResponse:
        """Returns minimal summaries for tickets visible to this user.

        Detail (transcripts, classification, dispatch, history) is fetched
        per-ticket via OpsTicket.show_brain_sources or React useOpsTicket()
        hooks. This avoids cross-state reads from a User Reader context.
        """
        return User.ListTicketsResponse(
            tickets=[
                TicketSummary(
                    ticket_id=tid,
                    property_id="",
                    status="",
                    severity=0,
                    category="",
                    last_action="",
                    cost_authorized_usd=0.0,
                    snippet="",
                )
                for tid in self.state.ticket_ids
            ]
        )

    async def query_brain(
        self,
        context: ReaderContext,
        request: User.QueryBrainRequest,
    ) -> User.QueryBrainResponse:
        """Direct brain query bypassing a ticket. T6 wires response shape."""
        brain = retrieval.retrieve_brain_context(
            transcript=request.query,
            property_id=request.property_id,
            category="",
        )
        voice_memos = [
            BrainVoiceMemo(
                id=m["id"],
                text=m.get("text", ""),
                context=m.get("context", ""),
                date=m.get("date", ""),
                relevance=m.get("relevance", 0.0),
            )
            for m in brain["voice_memos"]
        ]
        sop = None
        if brain["matched_sop"]:
            sop_d = brain["matched_sop"]
            sop = BrainSOP(
                id=sop_d["id"],
                title=sop_d.get("title", ""),
                snippet=" / ".join(sop_d.get("steps", [])[:3]),
            )
        historical = [
            BrainHistorical(
                ticket_id=h["id"],
                title=h.get("snippet", "")[:80],
                snippet=h.get("snippet", ""),
                relevance=h.get("relevance", 0.0),
            )
            for h in brain["historical_resolutions"]
        ]
        return User.QueryBrainResponse(
            voice_memos=voice_memos,
            sop=sop,
            historical=historical,
        )

    async def live_state(
        self,
        context: ReaderContext,
    ) -> User.LiveStateResponse:
        """Cross-ticket dashboard payload — ticket_id list + recent events.

        Detail-per-ticket flows through React hooks (subscribed to each
        OpsTicket instance's state) or through OpsTicket.show_brain_sources.
        """
        return User.LiveStateResponse(
            tickets=[
                TicketSummary(
                    ticket_id=tid,
                    property_id="",
                    status="",
                    severity=0,
                    category="",
                    last_action="",
                    cost_authorized_usd=0.0,
                    snippet="",
                )
                for tid in self.state.ticket_ids
            ],
            recent_event_jsons=[],
        )

    async def cost_summary(
        self,
        context: ReaderContext,
    ) -> User.CostSummaryResponse:
        """Per-property LLM cost rollup from usage.jsonl.

        Reads the local usage log written by helpers/llm.py, groups today's
        rows by property_id, and computes per-tier $/calls plus a daily
        budget remaining. The dashboard CostTicker subscribes to this.
        """
        usage_log = _PROJECT_ROOT / "usage.jsonl"
        properties = _load_properties()
        per_property: dict[str, dict[str, Any]] = {}

        today = datetime.now(timezone.utc).date().isoformat()

        if usage_log.exists():
            for line in usage_log.read_text().splitlines():
                line = line.strip()
                if not line:
                    continue
                try:
                    row = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if not row.get("ts", "").startswith(today):
                    continue
                pid = row.get("property_id", "")
                if not pid:
                    continue
                bucket = per_property.setdefault(
                    pid,
                    {"fast_calls": 0, "fast_usd": 0.0, "strong_calls": 0, "strong_usd": 0.0},
                )
                tier = row.get("tier", "fast")
                key_calls = f"{tier}_calls"
                key_usd = f"{tier}_usd"
                if key_calls in bucket:
                    bucket[key_calls] += 1
                    bucket[key_usd] += float(row.get("usd", 0.0))

        rows: list[PropertyCost] = []
        total_today = 0.0
        total_calls = 0
        for pid, bucket in per_property.items():
            today_usd = bucket["fast_usd"] + bucket["strong_usd"]
            calls = bucket["fast_calls"] + bucket["strong_calls"]
            total_today += today_usd
            total_calls += calls
            prop = properties.get(pid, {})
            monthly_budget = float(prop.get("monthly_budget_usd", 0))
            daily_budget = monthly_budget / 30.0
            rows.append(
                PropertyCost(
                    property_id=pid,
                    display_name=prop.get("name", pid),
                    today_usd=round(today_usd, 4),
                    fast_calls=bucket["fast_calls"],
                    fast_usd=round(bucket["fast_usd"], 4),
                    strong_calls=bucket["strong_calls"],
                    strong_usd=round(bucket["strong_usd"], 4),
                    budget_remaining_usd=round(max(0.0, daily_budget - today_usd), 2),
                    daily_budget_usd=round(daily_budget, 2),
                )
            )
        rows.sort(key=lambda r: r.today_usd, reverse=True)

        return User.CostSummaryResponse(
            properties=rows,
            total_today_usd=round(total_today, 4),
            total_calls=total_calls,
        )


# ────────────────────────── OpsTicketServicer ──────────────────────────


class OpsTicketServicer(OpsTicket.Servicer):

    async def create(
        self,
        context: WriterContext,
        request: OpsTicket.CreateRequest,
    ) -> None:
        """Factory create — initial state + 'ingested' history event."""
        self.state.property_id = request.property_id
        self.state.source = request.source
        self.state.raw_input = request.raw_input
        self.state.transcript_native = request.transcript_native
        self.state.transcript_en = request.transcript_en
        self.state.detected_language = request.detected_language
        self.state.sender_user_id = request.sender_user_id
        self.state.created_at = request.created_at or _utc_now_iso()
        self.state.status = "NEW"
        _add_event(
            self.state,
            "ingested",
            {
                "property_id": request.property_id,
                "source": request.source,
            },
        )

    async def triage(
        self,
        context: WriterContext,
    ) -> None:
        """classify → retrieve_brain → reason_strong → severity gate.

        Emits granular history events at each architectural step so the
        dashboard's activity feed shows Whisper / TokenRouter classify /
        Reboot brain / TokenRouter dispatch / Reboot decision in real time.
        """
        ticket_id = context.state_id
        property_id = self.state.property_id
        properties = _load_properties()
        property_record = properties.get(property_id, {})

        # Pick the text we triage on. Translate native→en if needed.
        text_native = self.state.transcript_native or self.state.raw_input
        text_en = self.state.transcript_en
        if not text_en and text_native:
            text_en, translate_row = _maybe_translate(
                text_native,
                self.state.detected_language or "auto",
                ticket_id=ticket_id,
                property_id=property_id,
            )
            self.state.transcript_en = text_en
            if translate_row:
                _add_event(self.state, "translated", {
                    "sponsor": "TokenRouter",
                    "tier": "strong",
                    "model": translate_row["model"],
                    "summary": "translated transcript to English",
                    "input_tokens": translate_row["input_tokens"],
                    "output_tokens": translate_row["output_tokens"],
                    "usd": translate_row["usd"],
                })

        triage_text = text_en or text_native

        # Classify.
        classification, classify_row = _classify_with_fallback(triage_text, property_id, ticket_id)
        self.state.category = classification.get("category", "")
        self.state.severity = int(classification.get("severity", 0))
        self.state.detected_language = (
            self.state.detected_language or classification.get("language", "")
        )
        risk_tags = classification.get("risk_tags") or []
        _add_event(self.state, "classified", {
            "sponsor": "TokenRouter",
            "tier": "fast",
            "model": (classify_row or {}).get("model", "fallback-heuristic"),
            "summary": (
                f"category={classification.get('category','')} · severity={classification.get('severity',0)}"
                + (f" · risk_tags=[{','.join(risk_tags)}]" if risk_tags else "")
            ),
            "input_tokens": (classify_row or {}).get("input_tokens", 0),
            "output_tokens": (classify_row or {}).get("output_tokens", 0),
            "usd": (classify_row or {}).get("usd", 0.0),
        })

        # Retrieve brain context.
        brain = retrieval.retrieve_brain_context(
            transcript=triage_text,
            property_id=property_id,
            category=self.state.category,
        )
        self.state.matched_voice_memo_ids = [m["id"] for m in brain["voice_memos"]]
        self.state.matched_sop_id = (brain["matched_sop"] or {}).get("id", "")
        self.state.matched_historical_ids = [
            h["id"] for h in brain["historical_resolutions"]
        ]
        sources_label_parts = []
        if brain["voice_memos"]:
            sources_label_parts.append(f"founder voice ({len(brain['voice_memos'])})")
        if brain["matched_sop"]:
            sources_label_parts.append(f"SOP ({brain['matched_sop']['id']})")
        if brain["historical_resolutions"]:
            sources_label_parts.append(f"historical ({len(brain['historical_resolutions'])})")
        if brain.get("synthesized_skill"):
            sources_label_parts.append(f"skill ({brain['synthesized_skill']['skill_id']})")
        _add_event(self.state, "brain_retrieved", {
            "sponsor": "Reboot",
            "summary": "matched " + " + ".join(sources_label_parts) if sources_label_parts else "no brain match",
            "voice_memo_top": (brain["voice_memos"][0]["id"] if brain["voice_memos"] else ""),
            "sop_id": (brain["matched_sop"] or {}).get("id", ""),
            "historical_top": (brain["historical_resolutions"][0]["id"] if brain["historical_resolutions"] else ""),
        })

        # Attach skill artifact.
        skill_d = brain.get("synthesized_skill")
        if skill_d:
            sources_d = skill_d.get("sources") or {}
            self.state.skill_artifact = SkillArtifact(
                skill_id=skill_d.get("skill_id", ""),
                name=skill_d.get("name", ""),
                description=skill_d.get("description", ""),
                trigger_conditions=list(skill_d.get("trigger_conditions", [])),
                inputs_required=list(skill_d.get("inputs_required", [])),
                workflow_steps=list(skill_d.get("workflow_steps", [])),
                preferred_vendors=list(skill_d.get("preferred_vendors", [])),
                auth_cap_usd=float(skill_d.get("auth_cap_usd", 0.0)),
                guest_voice_style=skill_d.get("guest_voice_style", ""),
                approval_rules=list(skill_d.get("approval_rules", [])),
                sources=SkillSources(
                    derived_from_ticket=sources_d.get("derived_from_ticket", ""),
                    brain_layers_used=list(sources_d.get("brain_layers_used", [])),
                    generated_by=sources_d.get("generated_by", ""),
                    generated_at=sources_d.get("generated_at", ""),
                ),
            )

        # Assignee.
        member = _load_team_for_property(property_id)
        if member:
            self.state.assigned_to = member["id"]

        # Draft dispatch.
        draft, dispatch_row = _draft_dispatch_with_fallback(
            triage_text, brain, property_record, self.state.category, ticket_id
        )
        dispatch = Dispatch(
            id=f"disp_{uuid.uuid4().hex[:10]}",
            vendor_id=draft["vendor_id"],
            cost_estimate_usd=float(draft["cost_estimate_usd"]),
            authorized=False,
            eta_iso="",
            auto_escalate_after_seconds=30,
            acknowledged=False,
            escalated=False,
        )
        _add_event(self.state, "dispatched", {
            "sponsor": "TokenRouter",
            "tier": "strong",
            "model": (dispatch_row or {}).get("model", "fallback-heuristic"),
            "summary": (
                f"draft: {draft['vendor_id']} · ${draft['cost_estimate_usd']:.0f} est · "
                f"ETA {draft['eta_minutes']}min"
            ),
            "vendor_id": draft["vendor_id"],
            "cost_estimate_usd": draft["cost_estimate_usd"],
            "input_tokens": (dispatch_row or {}).get("input_tokens", 0),
            "output_tokens": (dispatch_row or {}).get("output_tokens", 0),
            "usd": (dispatch_row or {}).get("usd", 0.0),
        })

        # Severity gate.
        cap = float(skill_d.get("auth_cap_usd", 200.0) if skill_d else 200.0)
        daily_cap = float(property_record.get("monthly_budget_usd", 0)) / 30.0
        within_cap = (
            dispatch.cost_estimate_usd <= cap
            and dispatch.cost_estimate_usd <= max(daily_cap, cap)
        )

        if self.state.severity >= 4:
            self.state.status = "AWAITING_HUMAN"
            reason = (
                f"severity {self.state.severity} ≥ 4"
                + (f" + {','.join(risk_tags)}" if risk_tags else "")
                + " → manual review"
            )
            _add_event(self.state, "triage_decision", {
                "sponsor": "Reboot",
                "summary": f"AWAITING_HUMAN — {reason}",
                "outcome": "AWAITING_HUMAN",
                "reason": reason,
            })
        elif within_cap:
            dispatch.authorized = True
            self.state.cost_authorized_usd = dispatch.cost_estimate_usd
            self.state.status = "TRIAGED"
            _add_event(self.state, "triage_decision", {
                "sponsor": "Reboot",
                "summary": f"TRIAGED auto-authorized · ${dispatch.cost_estimate_usd:.0f} ≤ ${cap:.0f} cap",
                "outcome": "TRIAGED",
                "auto_authorized": True,
                "cost_estimate_usd": dispatch.cost_estimate_usd,
            })
        else:
            self.state.status = "AWAITING_HUMAN"
            _add_event(self.state, "triage_decision", {
                "sponsor": "Reboot",
                "summary": (
                    f"AWAITING_HUMAN — ${dispatch.cost_estimate_usd:.0f} > ${cap:.0f} cap"
                ),
                "outcome": "AWAITING_HUMAN",
                "reason": "cost_above_cap",
                "cost_estimate_usd": dispatch.cost_estimate_usd,
                "cap_usd": cap,
            })

        self.state.dispatches.append(dispatch)

    async def acknowledge_dispatch(
        self,
        context: WriterContext,
        request: OpsTicket.AcknowledgeDispatchRequest,
    ) -> None:
        for d in self.state.dispatches:
            if d.id == request.dispatch_id:
                d.acknowledged = True
                _add_event(
                    self.state,
                    "dispatch_acknowledged",
                    {"dispatch_id": request.dispatch_id},
                )
                break

    @classmethod
    async def dispatch_with_escalation(
        cls,
        context: WorkflowContext,
        request: OpsTicket.DispatchWithEscalationRequest,
    ) -> OpsTicket.DispatchWithEscalationResponse:
        """T8 wires the durable wait + 30s escalation."""
        return OpsTicket.DispatchWithEscalationResponse(
            dispatch_id="stub",
            status="stubbed",
        )

    async def propose_new_rule(
        self,
        context: WriterContext,
    ) -> OpsTicket.ProposeNewRuleResponse:
        """Generate a rule proposal for the Beat 6 closing cameo.

        Uses the ticket's resolution pattern + brain context to draft a
        rule. The lightsprint_prompt is shaped per master §3.4 — paste
        into Lightsprint to ship a PR live on stage.
        """
        property_id = self.state.property_id
        category = self.state.category or "general"
        skill = self.state.skill_artifact
        preferred_vendor = (
            skill.preferred_vendors[0]
            if skill and skill.preferred_vendors
            else ""
        )
        cap_usd = float(skill.auth_cap_usd) if skill else 200.0

        rule_id = f"rule_proposed_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}"
        title = (
            f"Auto-escalate {property_id} {category} when "
            f"{preferred_vendor or 'preferred vendor'} unavailable"
        )
        description = (
            f"Pattern: {category} tickets at {property_id} consistently "
            f"resolve via {preferred_vendor or 'preferred vendor'} "
            f"within historical SLA. When unavailable, escalate to "
            f"manager rather than fall back to a cheaper vendor."
        )

        rule_obj: dict[str, Any] = {
            "id": rule_id,
            "title": title,
            "description": description,
            "trigger": {
                "property_id": property_id,
                "category": category,
                "preferred_vendor_unavailable": preferred_vendor,
            },
            "action": {
                "escalate_to": "manager",
                "skip_fallback_vendor": True,
                "notify": ["slack:#ops-ben"],
            },
            "rationale": (
                "Preferred vendor's category-specific judgment is the moat. "
                "Falling back to a cheaper vendor without it has caused "
                "near-misses. Escalation cost is lower than the exposure."
            ),
        }
        rule_json = json.dumps(rule_obj, ensure_ascii=False, indent=2)

        lightsprint_prompt = (
            f"Add a comp_rule.py automation to automations/rules.py: "
            f"when a {category} ticket at {property_id} matches the "
            f"preferred-vendor-unavailable condition (vendor "
            f"`{preferred_vendor}` is offline or has not acknowledged "
            f"within SLA), escalate to a human manager rather than "
            f"selecting a fallback vendor. Post a Slack notification to "
            f"#ops-ben. Tag the LLM call with metadata.property_id, "
            f"metadata.ticket_id, and metadata.tier='strong' so it "
            f"shows up in the TokenRouter cost ticker correctly. "
            f"Cost cap remains ${cap_usd:.0f}. Follow the existing "
            f"pattern in automations/rules.py."
        )

        _add_event(
            self.state,
            "rule_proposed",
            {
                "sponsor": "Reboot",
                "summary": f"rule proposal generated · ready for Lightsprint paste",
                "rule_id": rule_id,
                "title": title,
                "destination": "Lightsprint",
            },
        )

        return OpsTicket.ProposeNewRuleResponse(
            rule_id=rule_id,
            title=title,
            description=description,
            rule_json=rule_json,
            lightsprint_prompt=lightsprint_prompt,
        )

    async def activity_feed(
        self,
        context: ReaderContext,
    ) -> OpsTicket.ActivityFeedResponse:
        """Architecture trace — every step (Whisper / TokenRouter / Reboot /
        Lightsprint) for this ticket with sponsor + tier + model + tokens + cost.
        """
        events: list[ActivityEvent] = []
        for ev in self.state.history:
            try:
                payload = json.loads(ev.payload_json or "{}")
            except json.JSONDecodeError:
                payload = {}
            sponsor = payload.get("sponsor") or _default_sponsor_for_event_type(ev.type)
            events.append(
                ActivityEvent(
                    ts=ev.ts,
                    type=ev.type,
                    sponsor=sponsor,
                    tier=payload.get("tier", ""),
                    model=payload.get("model", ""),
                    summary=payload.get("summary", _default_summary_for_event(ev.type, payload)),
                    detail=json.dumps({k: v for k, v in payload.items()
                                       if k not in {"sponsor", "tier", "model", "summary",
                                                    "input_tokens", "output_tokens", "usd"}},
                                      ensure_ascii=False),
                    input_tokens=int(payload.get("input_tokens", 0) or 0),
                    output_tokens=int(payload.get("output_tokens", 0) or 0),
                    usd=float(payload.get("usd", 0.0) or 0.0),
                )
            )
        return OpsTicket.ActivityFeedResponse(events=events)

    async def show_brain_sources(
        self,
        context: ReaderContext,
    ) -> OpsTicket.ShowBrainSourcesResponse:
        """The on-stage Beat 3 — three cards from the four-layer Brain.

        Reads matched_*_ids from this ticket's state, loads the corpus,
        and returns the top voice memo / SOP / historical resolution.
        """
        voice_memo = None
        if self.state.matched_voice_memo_ids:
            top_id = self.state.matched_voice_memo_ids[0]
            corpus = json.loads((_DATA_DIR / "voice_corpus.json").read_text())
            for memo in corpus:
                if memo["id"] == top_id:
                    voice_memo = BrainVoiceMemo(
                        id=memo["id"],
                        text=memo.get("text", ""),
                        context=memo.get("context", ""),
                        date=memo.get("date", ""),
                        relevance=0.95,
                    )
                    break

        sop = None
        if self.state.matched_sop_id:
            corpus = json.loads((_DATA_DIR / "sops.json").read_text())
            for s in corpus:
                if s["id"] == self.state.matched_sop_id:
                    sop = BrainSOP(
                        id=s["id"],
                        title=s.get("title", ""),
                        snippet=" / ".join(s.get("steps", [])[:3]),
                    )
                    break

        historical = None
        if self.state.matched_historical_ids:
            top_id = self.state.matched_historical_ids[0]
            corpus = json.loads((_DATA_DIR / "historical_resolutions.json").read_text())
            for row in corpus:
                if row["id"] == top_id:
                    historical = BrainHistorical(
                        ticket_id=row["id"],
                        title=(row.get("snippet", "") or "")[:80],
                        snippet=row.get("snippet", ""),
                        relevance=0.90,
                    )
                    break

        return OpsTicket.ShowBrainSourcesResponse(
            voice_memo=voice_memo,
            sop=sop,
            historical=historical,
            skill_artifact=self.state.skill_artifact,
            property_id=self.state.property_id,
            severity=self.state.severity,
            category=self.state.category,
            status=self.state.status,
            transcript_native=self.state.transcript_native,
            transcript_en=self.state.transcript_en,
        )
