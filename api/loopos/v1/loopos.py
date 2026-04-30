"""LoopOS API — durable state, methods, MCP tool surface.

OpsTicket is the application type (one durable instance per ticket).
User is the entry point (creates tickets, lists, queries Brain).

State defaults follow proto3 zero-value rules (Gotcha #3). Initial
non-zero values (e.g. status="NEW", default escalation seconds) are
set in factory `create` Writers in the servicer.
"""
from typing import Optional

from reboot.api import (
    API,
    UI,
    Field,
    Methods,
    Model,
    Reader,
    Tool,
    Transaction,
    Type,
    Workflow,
    Writer,
)


# ─────────────────────────── Helper Models ────────────────────────────


class HistoryEvent(Model):
    ts: str = Field(tag=1, default="")
    type: str = Field(tag=2, default="")
    payload_json: str = Field(tag=3, default="")


class Dispatch(Model):
    id: str = Field(tag=1, default="")
    vendor_id: str = Field(tag=2, default="")
    cost_estimate_usd: float = Field(tag=3, default=0.0)
    authorized: bool = Field(tag=4, default=False)
    eta_iso: str = Field(tag=5, default="")
    auto_escalate_after_seconds: int = Field(tag=6, default=0)
    acknowledged: bool = Field(tag=7, default=False)
    escalated: bool = Field(tag=8, default=False)


class SkillSources(Model):
    derived_from_ticket: str = Field(tag=1, default="")
    brain_layers_used: list[str] = Field(tag=2, default_factory=list)
    generated_by: str = Field(tag=3, default="")
    generated_at: str = Field(tag=4, default="")


class SkillArtifact(Model):
    skill_id: str = Field(tag=1, default="")
    name: str = Field(tag=2, default="")
    description: str = Field(tag=3, default="")
    trigger_conditions: list[str] = Field(tag=4, default_factory=list)
    inputs_required: list[str] = Field(tag=5, default_factory=list)
    workflow_steps: list[str] = Field(tag=6, default_factory=list)
    preferred_vendors: list[str] = Field(tag=7, default_factory=list)
    auth_cap_usd: float = Field(tag=8, default=0.0)
    guest_voice_style: str = Field(tag=9, default="")
    approval_rules: list[str] = Field(tag=10, default_factory=list)
    sources: Optional[SkillSources] = Field(tag=11, default=None)


class TicketSummary(Model):
    ticket_id: str = Field(tag=1, default="")
    property_id: str = Field(tag=2, default="")
    status: str = Field(tag=3, default="")
    severity: int = Field(tag=4, default=0)
    category: str = Field(tag=5, default="")
    last_action: str = Field(tag=6, default="")
    cost_authorized_usd: float = Field(tag=7, default=0.0)
    snippet: str = Field(tag=8, default="")


class BrainVoiceMemo(Model):
    id: str = Field(tag=1, default="")
    text: str = Field(tag=2, default="")
    context: str = Field(tag=3, default="")
    date: str = Field(tag=4, default="")
    relevance: float = Field(tag=5, default=0.0)


class BrainSOP(Model):
    id: str = Field(tag=1, default="")
    title: str = Field(tag=2, default="")
    snippet: str = Field(tag=3, default="")


class BrainHistorical(Model):
    ticket_id: str = Field(tag=1, default="")
    title: str = Field(tag=2, default="")
    snippet: str = Field(tag=3, default="")
    relevance: float = Field(tag=4, default=0.0)


# ──────────────────────── Request/Response Models ─────────────────────


class IngestTextRequest(Model):
    property_id: str = Field(tag=1)
    text: str = Field(tag=2)
    sender_user_id: str = Field(tag=3, default="")


class IngestVoiceRequest(Model):
    property_id: str = Field(tag=1)
    audio_url: str = Field(tag=2)
    sender_user_id: str = Field(tag=3, default="")


class IngestResponse(Model):
    ticket_id: str = Field(tag=1)


class CreateTicketRequest(Model):
    property_id: str = Field(tag=1, default="")
    source: str = Field(tag=2, default="")
    raw_input: str = Field(tag=3, default="")
    transcript_native: str = Field(tag=4, default="")
    transcript_en: str = Field(tag=5, default="")
    detected_language: str = Field(tag=6, default="")
    sender_user_id: str = Field(tag=7, default="")
    created_at: str = Field(tag=8, default="")


class ListTicketsResponse(Model):
    tickets: list[TicketSummary] = Field(tag=1, default_factory=list)


class QueryBrainRequest(Model):
    query: str = Field(tag=1)
    property_id: str = Field(tag=2, default="")


class QueryBrainResponse(Model):
    voice_memos: list[BrainVoiceMemo] = Field(tag=1, default_factory=list)
    sop: Optional[BrainSOP] = Field(tag=2, default=None)
    historical: list[BrainHistorical] = Field(tag=3, default_factory=list)


class LiveStateResponse(Model):
    tickets: list[TicketSummary] = Field(tag=1, default_factory=list)
    recent_event_jsons: list[str] = Field(tag=2, default_factory=list)


class PropertyCost(Model):
    property_id: str = Field(tag=1, default="")
    display_name: str = Field(tag=2, default="")
    today_usd: float = Field(tag=3, default=0.0)
    fast_calls: int = Field(tag=4, default=0)
    fast_usd: float = Field(tag=5, default=0.0)
    strong_calls: int = Field(tag=6, default=0)
    strong_usd: float = Field(tag=7, default=0.0)
    budget_remaining_usd: float = Field(tag=8, default=0.0)
    daily_budget_usd: float = Field(tag=9, default=0.0)


class CostSummaryResponse(Model):
    properties: list[PropertyCost] = Field(tag=1, default_factory=list)
    total_today_usd: float = Field(tag=2, default=0.0)
    total_calls: int = Field(tag=3, default=0)


class ActivityEvent(Model):
    ts: str = Field(tag=1, default="")
    type: str = Field(tag=2, default="")
    sponsor: str = Field(tag=3, default="")
    tier: str = Field(tag=4, default="")
    model: str = Field(tag=5, default="")
    summary: str = Field(tag=6, default="")
    detail: str = Field(tag=7, default="")
    input_tokens: int = Field(tag=8, default=0)
    output_tokens: int = Field(tag=9, default=0)
    usd: float = Field(tag=10, default=0.0)


class ActivityFeedResponse(Model):
    events: list[ActivityEvent] = Field(tag=1, default_factory=list)


class ShowBrainSourcesResponse(Model):
    voice_memo: Optional[BrainVoiceMemo] = Field(tag=1, default=None)
    sop: Optional[BrainSOP] = Field(tag=2, default=None)
    historical: Optional[BrainHistorical] = Field(tag=3, default=None)
    skill_artifact: Optional[SkillArtifact] = Field(tag=4, default=None)
    property_id: str = Field(tag=5, default="")
    severity: int = Field(tag=6, default=0)
    category: str = Field(tag=7, default="")
    status: str = Field(tag=8, default="")
    transcript_native: str = Field(tag=9, default="")
    transcript_en: str = Field(tag=10, default="")


class DispatchRequest(Model):
    vendor_id: str = Field(tag=1)
    cost_estimate_usd: float = Field(tag=2)


class DispatchResponse(Model):
    dispatch_id: str = Field(tag=1)
    status: str = Field(tag=2)


class AcknowledgeDispatchRequest(Model):
    dispatch_id: str = Field(tag=1)


class ProposeNewRuleResponse(Model):
    rule_id: str = Field(tag=1)
    title: str = Field(tag=2)
    description: str = Field(tag=3)
    rule_json: str = Field(tag=4)
    lightsprint_prompt: str = Field(tag=5)


# ────────────────────────────── User ──────────────────────────────────


class UserState(Model):
    ticket_ids: list[str] = Field(tag=1, default_factory=list)


# ──────────────────────────── OpsTicket ───────────────────────────────


class OpsTicketState(Model):
    property_id: str = Field(tag=1, default="")
    source: str = Field(tag=2, default="")
    raw_input: str = Field(tag=3, default="")
    transcript_native: str = Field(tag=4, default="")
    transcript_en: str = Field(tag=5, default="")
    detected_language: str = Field(tag=6, default="")
    category: str = Field(tag=7, default="")
    severity: int = Field(tag=8, default=0)
    status: str = Field(tag=9, default="")
    assigned_to: str = Field(tag=10, default="")
    cost_authorized_usd: float = Field(tag=11, default=0.0)
    matched_sop_id: str = Field(tag=12, default="")
    matched_voice_memo_ids: list[str] = Field(tag=13, default_factory=list)
    matched_historical_ids: list[str] = Field(tag=14, default_factory=list)
    skill_artifact: Optional[SkillArtifact] = Field(tag=15, default=None)
    created_at: str = Field(tag=16, default="")
    sender_user_id: str = Field(tag=17, default="")
    history: list[HistoryEvent] = Field(tag=18, default_factory=list)
    dispatches: list[Dispatch] = Field(tag=19, default_factory=list)


# ─────────────────────────────── API ──────────────────────────────────


api = API(
    User=Type(
        state=UserState,
        methods=Methods(
            show_loopos_dashboard=UI(
                request=None,
                path="web/ui/loopos-ui",
                title="LoopOS",
                description=(
                    "Open the LoopOS three-pane dashboard inside this chat: "
                    "ticket list (left), chat/triage detail (center), per-property "
                    "cost ticker (right). Use this once at the start of a session."
                ),
            ),
            ingest_text_message=Transaction(
                request=IngestTextRequest,
                response=IngestResponse,
                description=(
                    "Create a new OpsTicket from a text message (the demo path). "
                    "Pass the property_id, the raw text in the operator's native "
                    "language, and the sender_user_id. Triage runs synchronously "
                    "and the ticket is returned ready to display."
                ),
                mcp=Tool(),
            ),
            ingest_voice_note=Transaction(
                request=IngestVoiceRequest,
                response=IngestResponse,
                description=(
                    "Create a new OpsTicket from a voice note URL. Whisper "
                    "transcribes via Runpod (or hardcoded fallback dict for stage), "
                    "then triage runs."
                ),
                mcp=Tool(),
            ),
            list_tickets=Reader(
                request=None,
                response=ListTicketsResponse,
                description=(
                    "List all tickets visible to this user, with one-line summaries. "
                    "Use this to show what's open, what's resolved, and where cost has gone."
                ),
                mcp=Tool(),
            ),
            query_brain=Reader(
                request=QueryBrainRequest,
                response=QueryBrainResponse,
                description=(
                    "Query the four-layer Company Brain (founder voice memos + SOPs + "
                    "historical resolutions) for context relevant to a question. "
                    "Optional property_id narrows the scope."
                ),
                mcp=Tool(),
            ),
            live_state=Reader(
                request=None,
                response=LiveStateResponse,
                description=(
                    "Return the current dashboard state — active ticket summaries "
                    "and the last 20 events. Used by the UI and by AI clients to "
                    "introspect the system."
                ),
                mcp=Tool(),
            ),
            cost_summary=Reader(
                request=None,
                response=CostSummaryResponse,
                description=(
                    "Per-property LLM cost rollup for today, sourced from "
                    "usage.jsonl. Returns one PropertyCost row per property that "
                    "had activity today, plus a fleet-wide total. Used by the "
                    "dashboard's cost ticker."
                ),
                mcp=Tool(),
            ),
        ),
    ),
    OpsTicket=Type(
        state=OpsTicketState,
        methods=Methods(
            create=Writer(
                request=CreateTicketRequest,
                response=None,
                factory=True,
                mcp=None,
            ),
            triage=Writer(
                request=None,
                response=None,
                description=(
                    "Run triage on this ticket: classify (fast tier), retrieve "
                    "Brain context, attach SkillArtifact, draft dispatch (strong tier). "
                    "Severity >= 4 → AWAITING_HUMAN; otherwise auto-authorize."
                ),
                mcp=Tool(),
            ),
            acknowledge_dispatch=Writer(
                request=AcknowledgeDispatchRequest,
                response=None,
                description=(
                    "Operator acknowledgement for a pending dispatch. Marks the "
                    "dispatch acknowledged; the dispatch_with_escalation workflow "
                    "polls for this and resolves rather than escalating."
                ),
                mcp=Tool(),
            ),
            dispatch_with_escalation=Workflow(
                request=DispatchRequest,
                response=DispatchResponse,
                description=(
                    "Durable dispatch flow: mock-WhatsApp the assignee, wait for "
                    "acknowledge_dispatch, auto-escalate to AWAITING_HUMAN after "
                    "the configured timeout."
                ),
                mcp=Tool(),
            ),
            propose_new_rule=Writer(
                request=None,
                response=ProposeNewRuleResponse,
                description=(
                    "Propose a new automation rule based on patterns in this "
                    "ticket's resolution. Returns a Lightsprint-ready prompt. "
                    "Does NOT modify automations/rules.py — that's Lightsprint's job."
                ),
                mcp=Tool(),
            ),
            show_brain_sources=Reader(
                request=None,
                response=ShowBrainSourcesResponse,
                description=(
                    "Return the Brain sources that triage matched to this ticket: "
                    "founder voice memo, SOP, historical resolution."
                ),
                mcp=Tool(),
            ),
            activity_feed=Reader(
                request=None,
                response=ActivityFeedResponse,
                description=(
                    "Return the architectural activity trace for this ticket — "
                    "every step (Whisper / TokenRouter classify / Reboot brain / "
                    "TokenRouter dispatch / Reboot decision / Lightsprint rule) "
                    "with sponsor, tier, model, tokens, and cost."
                ),
                mcp=Tool(),
            ),
        ),
    ),
)
