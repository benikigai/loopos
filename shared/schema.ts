// LoopOS shared types — frontend (loop-skin) imports from here.
// Backend mirror lives at backend/schema.py (Pydantic). Keep them in sync.
//
// Source of truth shape: fixtures/shirley_ac_leak.json

export type Tier = "fast" | "strong";

export type Channel =
  | "whatsapp_voice"
  | "whatsapp_text"
  | "telegram_voice"
  | "telegram_text"
  | "line_voice"
  | "line_text"
  | "email"
  | "manual";

export interface Person {
  name: string;
  lang: string; // BCP-47 (e.g. "zh-TW", "ja", "id", "en", "es")
  region: string;
  role: string;
}

export interface Property {
  id: string; // e.g. "warm_taipei_2br"
  display_name: string; // e.g. "Warm Taipei 2BR"
  city: string;
  country: string; // ISO 3166-1 alpha-2
}

export interface Audio {
  url: string;
  duration_s: number;
}

export interface Classification {
  category: string;
  severity: 1 | 2 | 3 | 4 | 5;
  language: string;
  urgency_window_minutes: number;
  model_used: string;
  tier: Tier;
}

export interface DispatchDraft {
  vendor: string;
  vendor_phone: string;
  eta_minutes: number;
  cost_estimate_usd: number;
  cost_cap_usd: number;
  notes_for_vendor_zh?: string;
  notes_for_vendor_en?: string;
  notes_for_guest_zh?: string;
  notes_for_guest_en?: string;
  model_used: string;
  tier: Tier;
}

export type TicketStatus =
  | "ingested"
  | "classified"
  | "draft_dispatch"
  | "dispatched"
  | "resolved";

export interface OpsTicket {
  id: string;
  created_at: string;
  channel: Channel;
  sender: Person;
  property: Property;
  audio?: Audio;
  transcript_native?: string;
  transcript_en?: string;
  classification?: Classification;
  dispatch_draft?: DispatchDraft;
  status: TicketStatus;
  resolved_at: string | null;
}

export type BrainLayer =
  | "founder_voice_memo"
  | "structured_knowledge"
  | "sop"
  | "prior_resolution";

export interface BrainSource {
  layer: BrainLayer;
  title: string;
  snippet: string;
  audio_url?: string;
  ticket_id_ref?: string;
  relevance: number; // 0..1
  match_reason: string;
}

export interface SkillStep {
  id: string;
  tier: Tier;
  action: string;
  constraints?: Record<string, unknown>;
  preference_rule?: string;
  default?: Record<string, unknown>;
  key?: string;
}

export interface SkillArtifact {
  name: string;
  version: string;
  description: string;
  trigger: Record<string, unknown>;
  inputs: Record<string, string>;
  steps: SkillStep[];
  outputs: Record<string, string>;
  observability: {
    tag_metadata: string[];
    log_to: string;
  };
  provenance: {
    derived_from_ticket: string;
    brain_layers_used: BrainLayer[];
    generated_by: string;
    generated_at: string;
  };
}

export interface ProposedRule {
  id: string;
  title: string;
  description: string;
  trigger: Record<string, unknown>;
  action: Record<string, unknown>;
  rationale: string;
  lightsprint_prompt: string; // ready-to-paste prompt for the closing cameo
}

export interface CostEvent {
  ts: string;
  property_id: string;
  ticket_id: string;
  model: string;
  tier: Tier;
  input_tokens: number;
  output_tokens: number;
  usd: number;
}

export interface PropertyCostSummary {
  today_usd: number;
  fast_calls: number;
  fast_usd: number;
  strong_calls: number;
  strong_usd: number;
  budget_remaining_usd: number;
}

export type CostsByProperty = Record<string, PropertyCostSummary>;
