"""LoopOS backend schemas (Pydantic mirror of shared/schema.ts).

Keep in sync with shared/schema.ts. Source of truth shape: fixtures/shirley_ac_leak.json.
"""
from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

Tier = Literal["fast", "strong"]
Channel = Literal[
    "whatsapp_voice",
    "whatsapp_text",
    "telegram_voice",
    "telegram_text",
    "line_voice",
    "line_text",
    "email",
    "manual",
]
TicketStatus = Literal[
    "ingested", "classified", "draft_dispatch", "dispatched", "resolved"
]
BrainLayer = Literal[
    "founder_voice_memo", "structured_knowledge", "sop", "prior_resolution"
]


class Person(BaseModel):
    name: str
    lang: str
    region: str
    role: str


class Property(BaseModel):
    id: str
    display_name: str
    city: str
    country: str


class Audio(BaseModel):
    url: str
    duration_s: float


class Classification(BaseModel):
    category: str
    severity: int = Field(ge=1, le=5)
    language: str
    urgency_window_minutes: int
    model_used: str
    tier: Tier


class DispatchDraft(BaseModel):
    vendor: str
    vendor_phone: str
    eta_minutes: int
    cost_estimate_usd: float
    cost_cap_usd: float
    notes_for_vendor_zh: str | None = None
    notes_for_vendor_en: str | None = None
    notes_for_guest_zh: str | None = None
    notes_for_guest_en: str | None = None
    model_used: str
    tier: Tier


class OpsTicket(BaseModel):
    id: str
    created_at: str
    channel: Channel
    sender: Person
    property: Property
    audio: Audio | None = None
    transcript_native: str | None = None
    transcript_en: str | None = None
    classification: Classification | None = None
    dispatch_draft: DispatchDraft | None = None
    status: TicketStatus
    resolved_at: str | None = None


class BrainSource(BaseModel):
    layer: BrainLayer
    title: str
    snippet: str
    audio_url: str | None = None
    ticket_id_ref: str | None = None
    relevance: float
    match_reason: str


class SkillStep(BaseModel):
    id: str
    tier: Tier
    action: str
    constraints: dict[str, Any] | None = None
    preference_rule: str | None = None
    default: dict[str, Any] | None = None
    key: str | None = None


class SkillProvenance(BaseModel):
    derived_from_ticket: str
    brain_layers_used: list[BrainLayer]
    generated_by: str
    generated_at: str


class SkillObservability(BaseModel):
    tag_metadata: list[str]
    log_to: str


class SkillArtifact(BaseModel):
    name: str
    version: str
    description: str
    trigger: dict[str, Any]
    inputs: dict[str, str]
    steps: list[SkillStep]
    outputs: dict[str, str]
    observability: SkillObservability
    provenance: SkillProvenance


class ProposedRule(BaseModel):
    id: str
    title: str
    description: str
    trigger: dict[str, Any]
    action: dict[str, Any]
    rationale: str
    lightsprint_prompt: str


class CostEvent(BaseModel):
    ts: str
    property_id: str
    ticket_id: str
    model: str
    tier: Tier
    input_tokens: int
    output_tokens: int
    usd: float


class PropertyCostSummary(BaseModel):
    today_usd: float
    fast_calls: int
    fast_usd: float
    strong_calls: int
    strong_usd: float
    budget_remaining_usd: float
