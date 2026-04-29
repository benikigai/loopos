"""LoopOS servicers — User and OpsTicket.

This file is the T1 boot skeleton. Real triage / brain / dispatch / rule
logic is filled in by T5 / T6 / T8 / T9 per docs/specs/loopos-hackathon.md.
The skeleton's job is: app boots, tickets can be created, methods exist
and don't crash when called via MCP inspector or the React UI.
"""
from datetime import datetime, timezone

from loopos.v1.loopos import (
    BrainHistorical,
    BrainSOP,
    BrainVoiceMemo,
    HistoryEvent,
    TicketSummary,
)
from loopos.v1.loopos_rbt import OpsTicket, User
from reboot.aio.contexts import (
    ReaderContext,
    TransactionContext,
    WorkflowContext,
    WriterContext,
)


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ────────────────────────── UserServicer ──────────────────────────


class UserServicer(User.Servicer):

    async def ingest_text_message(
        self,
        context: TransactionContext,
        request: User.IngestTextMessageRequest,
    ) -> User.IngestTextMessageResponse:
        """Demo critical path — text message → OpsTicket → triage."""
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
        return User.IngestTextMessageResponse(ticket_id=ticket.state_id)

    async def ingest_voice_note(
        self,
        context: TransactionContext,
        request: User.IngestVoiceNoteRequest,
    ) -> User.IngestVoiceNoteResponse:
        """Voice path — audio_url → Whisper → OpsTicket → triage. T2/T5 wire."""
        ticket, _ = await OpsTicket.create(
            context,
            property_id=request.property_id,
            source="voice",
            raw_input=request.audio_url,
            transcript_native="",
            transcript_en="",
            detected_language="",
            sender_user_id=request.sender_user_id,
            created_at=_utc_now_iso(),
        )
        self.state.ticket_ids.append(ticket.state_id)
        return User.IngestVoiceNoteResponse(ticket_id=ticket.state_id)

    async def list_tickets(
        self,
        context: ReaderContext,
    ) -> User.ListTicketsResponse:
        """Skeleton — returns empty summaries. T6 fills with real per-ticket reads."""
        return User.ListTicketsResponse(tickets=[])

    async def query_brain(
        self,
        context: ReaderContext,
        request: User.QueryBrainRequest,
    ) -> User.QueryBrainResponse:
        """Skeleton — T4 + T6 wire real four-layer brain retrieval."""
        return User.QueryBrainResponse(
            voice_memos=[],
            sop=None,
            historical=[],
        )

    async def live_state(
        self,
        context: ReaderContext,
    ) -> User.LiveStateResponse:
        """Skeleton — T6 fills with real cross-ticket aggregation."""
        return User.LiveStateResponse(
            tickets=[],
            recent_event_jsons=[],
        )


# ────────────────────────── OpsTicketServicer ──────────────────────────


class OpsTicketServicer(OpsTicket.Servicer):

    async def create(
        self,
        context: WriterContext,
        request: OpsTicket.CreateRequest,
    ) -> None:
        """Factory create — set initial state. Status starts NEW per gotcha #3."""
        self.state.property_id = request.property_id
        self.state.source = request.source
        self.state.raw_input = request.raw_input
        self.state.transcript_native = request.transcript_native
        self.state.transcript_en = request.transcript_en
        self.state.detected_language = request.detected_language
        self.state.sender_user_id = request.sender_user_id
        self.state.created_at = request.created_at or _utc_now_iso()
        self.state.status = "NEW"
        self.state.history.append(
            HistoryEvent(
                ts=self.state.created_at,
                type="ingested",
                payload_json="{}",
            )
        )

    async def triage(
        self,
        context: WriterContext,
    ) -> None:
        """Skeleton — T5 wires classify_fast + retrieve_brain + reason_strong."""
        self.state.status = "TRIAGED"
        self.state.history.append(
            HistoryEvent(
                ts=_utc_now_iso(),
                type="triaged_stub",
                payload_json="{}",
            )
        )

    async def acknowledge_dispatch(
        self,
        context: WriterContext,
        request: OpsTicket.AcknowledgeDispatchRequest,
    ) -> None:
        """Mark a dispatch acknowledged. T8 hooks into the workflow's wait."""
        for d in self.state.dispatches:
            if d.id == request.dispatch_id:
                d.acknowledged = True
                self.state.history.append(
                    HistoryEvent(
                        ts=_utc_now_iso(),
                        type="dispatch_acknowledged",
                        payload_json=f'{{"dispatch_id": "{request.dispatch_id}"}}',
                    )
                )
                break

    @classmethod
    async def dispatch_with_escalation(
        cls,
        context: WorkflowContext,
        request: OpsTicket.DispatchWithEscalationRequest,
    ) -> OpsTicket.DispatchWithEscalationResponse:
        """Skeleton — T8 wires the durable wait + 30s escalation."""
        return OpsTicket.DispatchWithEscalationResponse(
            dispatch_id="stub",
            status="stubbed",
        )

    async def propose_new_rule(
        self,
        context: WriterContext,
    ) -> OpsTicket.ProposeNewRuleResponse:
        """Skeleton — T9 generates real ProposedRule + Lightsprint prompt."""
        return OpsTicket.ProposeNewRuleResponse(
            rule_id="rule_stub",
            title="(stub) Auto-escalate Mr. Wang unavailable",
            description="(stub — T9 wires real proposal)",
            rule_json="{}",
            lightsprint_prompt="(stub — T9 fills with master §3.4 closing-cameo prompt)",
        )

    async def show_brain_sources(
        self,
        context: ReaderContext,
    ) -> OpsTicket.ShowBrainSourcesResponse:
        """Skeleton — T6 reads matched_*_ids and returns real brain sources."""
        return OpsTicket.ShowBrainSourcesResponse(
            voice_memo=None,
            sop=None,
            historical=None,
        )
