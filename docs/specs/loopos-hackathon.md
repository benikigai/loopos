# Spec: LoopOS Hackathon Slice
**Date:** 2026-04-29
**Status:** Approved
**Approved option:** A (strict master-spec §5.0–5.7 phasing) + critic mitigations layered in as inserts (T7, T10)
**Complexity:** High overall (14 tasks — 7 Simple / 5 Moderate / 2 Complex)
**Time budget:** 205min vs ~210min available before demo. T8/T10 are first cuts if slipping.

## Context

Build LoopOS — a multiplayer MCP-native AI Chat App for deskless service-company ops — for AWS Builder Loft "Build YC's Next Unicorn — Agent Hack Day" (Apr 29 2026). Demo is 3 minutes, ~3.5h from spec approval.

Source of truth for architecture: master Google Doc `1ohwoaS4nVKKbSakQrGTq0GnEaOSH9vOkqGorxh0jzqg` (LOOPOS — Master Spec). Source of truth for user-visible behavior on stage: `What LoopOS is.docx` in gdrive (the pitch script — already reconciled into `fixtures/shirley_ac_leak.json` via commit `435f19b`).

This spec discards the current FastAPI/Next.js loop-core/loop-skin contract scaffold and pivots to the master-spec architecture: Reboot auto-scaffolded full stack with React UI shipped *inside* Claude Desktop via Reboot's `ui` method, MCP server connecting Claude Desktop and ChatGPT to shared durable state, four-layer Brain over JSON corpus files, TokenRouter for tagged LLM routing, Runpod for multilingual Whisper, Lightsprint for the closing PR ship cameo.

## Decisions

1. **Repo pivot, not parallel build.** Current local scaffold (`backend/`, `shared/`, `fixtures/`, `web/`, `CONTRACT.md`) is ~/30 lines of meaningful Python + types and zero frontend. Throwing it out is cheaper than porting. We pivot on a feature branch `reboot-pivot` so `main` is recoverable until merge.
2. **`docs/` survives the pivot.** This spec lives at `docs/specs/loopos-hackathon.md` — Reboot scaffold and `git rm` target only the legacy code dirs above. Loop-skin reads this spec to know what corpus to populate.
3. **Strict master-spec phase ordering** (§5.0–5.7), not a vertical slice. Two critic-driven inserts: **T7** (multiplayer smoke at minute ~95) and **T10** (Lightsprint smoke right after `propose_new_rule` ships).
4. **Loop-skin tmux session repurposed** to data corpus population (T3) running in parallel with T1/T2/T4 in this session. Frontend is no longer a separate app.
5. **Voice corpus synthesized initially** (5–8 entries based on stated business knowledge — Mr. Wang Taipei, Ito vendor cadence, Miguel Yosemite, etc.). Ben swaps real Slack/WhatsApp artifacts in if T13 dry run leaves time. Entries tagged `representative: true` to be honest about provenance.
6. **Hardcoded transcript fallback for all 3 voice notes** (Shirley/Haru/Celine). Shirley audio recorded in parallel during T1–T4 by Ben. Haru/Celine appear in `historical_resolutions.json` and team data for breadth without audio assets.
7. **ChatGPT MCP connector is best-effort.** T7 is the GO/NO-GO. If unavailable to Ben's account, Beat 5 degrades to verbal claim — same MCP, two clients — and the demo continues.
8. **Master spec architecture is not negotiated.** Where master and current local code disagree, master wins (OpsTicket flat shape, `NEW/TRIAGED/AWAITING_HUMAN/DISPATCHED/RESOLVED` statuses, expanded `Property` model, separate `Dispatch` model, SkillArtifact gains `name/description/inputs_required/workflow_steps`).

## Tasks

### T1: Reboot scaffold pre-flight + repo pivot
**Objective:** Confirm `/reboot-chat-app` skill scaffolds master §2.3 expected layout in an out-of-tree sandbox, then pivot `~/code/loopos` to the Reboot scaffold on a feature branch.
**Complexity:** Moderate
**Dependencies:** None
**Files to change:** `/tmp/loopos-scaffold-test/**` (pre-flight, throwaway); branch `reboot-pivot` in `~/code/loopos` — removes `backend/`, `shared/`, `fixtures/`, `web/`, `CONTRACT.md`; adds Reboot scaffold output (`api/loopos/v1/app.py`, `backend/src/{main.py, servicers/}`, `web/ui/loopos-ui/{App.tsx,components/}`, `.rbtrc`, `pyproject.toml`).
**Acceptance criteria:**
  - Pre-flight scaffold output dir tree matches master §2.3 expected paths (api/, backend/src/servicers/, web/ui/loopos-ui/, etc.)
  - On `reboot-pivot` branch: legacy dirs removed; Reboot scaffold dropped in; `uv run rbt dev run` boots without errors
  - `main` branch untouched; rollback is `git checkout main && git branch -D reboot-pivot`
**Test plan:**
  - Smoke: `tree /tmp/loopos-scaffold-test -L 3` compared to master §2.3 layout; `uv run rbt dev run` exits cleanly
  - Integration: MCP inspector connects to local Reboot dev server
**Rollback plan:** `git checkout main && git branch -D reboot-pivot`. Pre-flight sandbox is throwaway: `rm -rf /tmp/loopos-scaffold-test`.
**Blast radius:** Feature branch only — `main` is safe until merge in T12.
**Research needed:** Yes — live discovery of `/reboot-chat-app` skill's actual scaffold output (master spec is a prediction).

### T2: TokenRouter + Runpod helper wrappers
**Objective:** Port the existing TokenRouter wrapper to the new servicer path and add a Runpod Whisper wrapper with hardcoded transcript fallback.
**Complexity:** Simple
**Dependencies:** T1
**Files to change:** `backend/src/servicers/helpers/llm.py`, `backend/src/servicers/helpers/whisper.py`
**Acceptance criteria:**
  - `classify_fast(text, property_id, ticket_id)` returns parsed JSON; tags request with `extra_body.metadata={property_id, ticket_id, tier: "fast"}`; appends row to `usage.jsonl`
  - `reason_strong(prompt, property_id, ticket_id)` returns text; tagged `tier: "strong"`; usage logged
  - `transcribe_and_translate(audio_path)` calls Runpod with 10s timeout; on non-200 / timeout / exception, falls back to `HARDCODED_TRANSCRIPTS` dict keyed by filename for `shirley_ac_zh.m4a`, `haru_lockout_ja.m4a`, `celine_plumbing_id.m4a`
**Test plan:**
  - Unit: Python REPL round-trip both `llm.py` functions with `TOKENROUTER_API_KEY` set; verify `usage.jsonl` row written with correct shape
  - Smoke: `transcribe_and_translate("demo_assets/shirley_ac_zh.m4a")` with `RUNPOD_WHISPER_URL=http://invalid` → returns hardcoded fallback dict
**Rollback plan:** `git checkout backend/src/servicers/helpers/`
**Blast radius:** Helpers only — no servicer or UI code touched.
**Research needed:** No.

### T3: Seed data corpus (PARALLEL via loop-skin tmux)
**Objective:** Populate the four-layer Brain seed data per master §4 with cross-references that retrieval can match.
**Complexity:** Moderate
**Dependencies:** T1
**Files to change:** `data/properties.json` (4 entries), `data/team.json` (4), `data/vendors.json` (4–8), `data/sops.json` (2: `hvac_leak`, `lockout`), `data/voice_corpus.json` (5–8, incl. Mr. Wang Taipei verbatim from gdrive doc), `data/historical_resolutions.json` (5), `data/skills/handle_hvac_leak.json` (1, pre-generated SkillArtifact)
**Acceptance criteria:**
  - All files parse as JSON; each entry validates against the corresponding Pydantic model in `api/loopos/v1/app.py`
  - `voice_corpus.json` includes id `vm_2024_03_taipei_ac` verbatim from gdrive doc (Mr. Wang HVAC, Mandarin OK, $80 emergency, $200 cap)
  - Cross-references consistent: every `property_id` in team/vendors/historical_resolutions exists in `properties.json`
  - `data/skills/handle_hvac_leak.json` has fields: `skill_id`, `name`, `description`, `trigger_conditions`, `inputs_required`, `workflow_steps`, `preferred_vendors`, `auth_cap_usd: 200`, `guest_voice_style: "founder_voice"`, `approval_rules`, `sources`
  - Synthesized voice memos tagged `representative: true`
**Test plan:**
  - Unit: `python -c "import json,glob; [json.load(open(f)) for f in glob.glob('data/**/*.json',recursive=True)]"`
  - Integration: Pydantic validation of each entry against `api/loopos/v1/app.py` models
**Rollback plan:** `rm -rf data/`
**Blast radius:** Data only — only consumed by retrieval helper (T4).
**Research needed:** No (synthesizing per Q3=A).

### T4: Retrieval helper (four-layer Brain)
**Objective:** Implement `retrieve_brain_context(ticket)` returning top-3 voice memos (cosine similarity), matched SOP (keyword), filtered historical resolutions, and synthesized skill.
**Complexity:** Moderate
**Dependencies:** T2, T3
**Files to change:** `backend/src/servicers/helpers/retrieval.py`
**Acceptance criteria:**
  - `retrieve_brain_context(ticket: OpsTicket) -> dict` returns `{voice_memos, matched_sop, historical_resolutions, synthesized_skill}`
  - Voice memos ranked by cosine similarity over OpenAI `text-embedding-3-small` embeddings (via TokenRouter); cached in local pickle file `embeddings_cache.pkl`
  - Keyword fallback if embedding API fails (logs warning, uses tag/category matching)
  - SOP match by `trigger_phrases` substring
  - Historical resolutions filtered by `property_id` + `category`, sorted by recency
  - For Shirley fixture: returns `vm_2024_03_taipei_ac` as top voice memo, `hvac_leak` SOP, ≥1 historical resolution, `handle_hvac_leak` skill
**Test plan:**
  - Unit: load Shirley fixture ticket, invoke `retrieve_brain_context`, assert Mr. Wang voice memo + hvac SOP + April 2024 historical surface
  - Smoke: with embedding API key blanked, retrieve still returns reasonable matches via keyword fallback
**Rollback plan:** `git checkout backend/src/servicers/helpers/retrieval.py`
**Blast radius:** Helpers only.
**Research needed:** No.

### T5: `ingest_voice_note` + `triage` writers (the demo critical path)
**Objective:** End-to-end Shirley path through ingest → triage with brain context attached, SkillArtifact populated, and severity gate auto-vs-human.
**Complexity:** Complex
**Dependencies:** T2, T3, T4
**Files to change:** `backend/src/servicers/ops_ticket.py`, `api/loopos/v1/app.py` (Pydantic models if not produced by scaffold)
**Acceptance criteria:**
  - `ingest_voice_note(property_id, audio_url)` writer creates `OpsTicket(status=NEW)`, calls `whisper.transcribe_and_translate`, populates `transcript_native/transcript_en/detected_language`, fires `triage` writer
  - `triage(ticket_id)` writer calls `classify_fast` to set `category/severity/language`, calls `retrieve_brain_context` to populate `matched_sop_id/matched_voice_memo_ids/matched_historical_ids`, attaches `skill_artifact` (loads `data/skills/handle_hvac_leak.json` for category=hvac_leak), calls `reason_strong` to draft dispatch with vendor + cost, gates on severity ≥ 4 → `AWAITING_HUMAN`, else auto-authorize up to property `monthly_budget_usd / 30` daily cap
  - Both methods exposed via `mcp=Tool()` decorator
  - For Shirley fixture: severity=4, category="hvac_leak", `matched_voice_memo_ids` includes `vm_2024_03_taipei_ac`, `matched_sop_id="hvac_leak"`, `skill_artifact` loaded, status=`AWAITING_HUMAN`
**Test plan:**
  - Unit: pytest writers with mocked LLM helpers; assert state transitions
  - Smoke: MCP inspector → invoke `ingest_voice_note(property_id="warm_taipei_2br", audio_url="demo_assets/shirley_ac_zh.m4a")` (with `RUNPOD_WHISPER_URL` invalid to force fallback) → poll `live_state` (T6) → ticket appears with full triage state
**Rollback plan:** `git checkout backend/src/servicers/ops_ticket.py`
**Blast radius:** Core servicer — readers (T6), workflow (T8), and UI (T11) all consume the state these writers produce.
**Research needed:** No (master §3.1 + §7 prescribe the pattern).

### T6: `live_state` + `show_brain_sources` readers
**Objective:** Reader methods exposing ticket state and brain match results to AI clients via MCP.
**Complexity:** Moderate
**Dependencies:** T5
**Files to change:** `backend/src/servicers/ops_ticket.py` (extend)
**Acceptance criteria:**
  - `live_state()` reader returns `{tickets: [...], dispatches: [...], events: [last 20]}`
  - `show_brain_sources(ticket_id)` reader returns `{voice_memo, sop, historical_resolution}` — the three on-stage cards from gdrive Beat 3
  - Both decorated `mcp=Tool()`
**Test plan:**
  - Smoke: after T5 creates Shirley ticket, MCP inspector calls both readers; verify `live_state` includes the ticket and `show_brain_sources` returns the Mr. Wang memo + hvac_leak SOP + April 2024 resolution
**Rollback plan:** `git checkout backend/src/servicers/ops_ticket.py`
**Blast radius:** Readers only.
**Research needed:** No.

### T7: NEW — Multiplayer GO/NO-GO smoke gate
**Objective:** Prove Claude Desktop ⇄ ChatGPT shared MCP state works *before* committing time to UI/workflow/Lightsprint. This is the critic's #3 concern — multiplayer must be tested at min ~95, not min ~145.
**Complexity:** Moderate
**Dependencies:** T5, T6
**Files to change:** `~/Library/Application Support/Claude/claude_desktop_config.json`; ChatGPT settings (manual UI action)
**Acceptance criteria:**
  - Claude Desktop config registers LoopOS MCP server; restart Claude → tools appear
  - From Claude Desktop: `ingest_voice_note` creates a ticket, `live_state` shows it
  - ChatGPT MCP connector configured against same LoopOS endpoint; `list_tickets` returns the same ticket
  - Approve action from ChatGPT updates ticket state visible from Claude Desktop
  - **Decision gate:** if ChatGPT MCP connector is unavailable to Ben's account or fails to connect, document the degrade in `demo_notes.md` and proceed; Beat 5 will be a verbal claim instead of a tab-flip
**Test plan:**
  - Manual cross-client interaction; capture screenshots of shared-state visibility for the demo as fallback
**Rollback plan:** Revert `claude_desktop_config.json`; remove ChatGPT connector from settings
**Blast radius:** Local client config files only — does not touch repo or server code.
**Research needed:** Yes — live discovery of ChatGPT MCP connector availability.

### T8: `dispatch_with_escalation` workflow
**Objective:** Durable dispatch flow — mock WhatsApp send to assigned ops member, durable wait for ack, auto-escalate after 30s.
**Complexity:** Moderate
**Dependencies:** T5
**Files to change:** `backend/src/servicers/ops_ticket.py` (workflow method)
**Acceptance criteria:**
  - `dispatch_with_escalation(ticket_id, vendor_id, cost_estimate)` workflow creates `Dispatch` object, status DISPATCHED
  - Mock WhatsApp send (logs to console as `[mock-wa] → assigned_to: ...`)
  - Durable wait via Reboot's workflow primitives; on ack writer call → status RESOLVED; on no-ack after `auto_escalate_after_seconds=30` → status AWAITING_HUMAN with escalation_event in history
**Test plan:**
  - Unit: pytest workflow with `auto_escalate_after_seconds=1` override; assert escalation transition
  - Smoke: trigger via MCP inspector at t=0; observe state at t=0 (DISPATCHED) and t=31 (AWAITING_HUMAN with escalation event)
**Rollback plan:** `git checkout backend/src/servicers/ops_ticket.py`
**Blast radius:** Workflow methods only — readers/writers above unaffected.
**Research needed:** No (master §3.1 prescribes pattern). **Cuttable** if T11 slips.

### T9: `propose_new_rule` writer
**Objective:** Generate rule proposal as JSON with prefilled Lightsprint prompt for the Beat 6 closing cameo.
**Complexity:** Simple
**Dependencies:** T5
**Files to change:** `backend/src/servicers/ops_ticket.py` (writer)
**Acceptance criteria:**
  - `propose_new_rule(ticket_id)` returns `ProposedRule` JSON with `id, title, description, trigger, action, rationale, lightsprint_prompt`
  - `lightsprint_prompt` matches the master §3.4 closing cameo template: instructs adding rule to `automations/rules.py` with metadata tagging
  - Method does NOT modify `automations/rules.py` itself (Lightsprint does that)
**Test plan:**
  - Smoke: invoke after T5 ticket exists; verify JSON shape; verify `lightsprint_prompt` substring matches master template
**Rollback plan:** `git checkout backend/src/servicers/ops_ticket.py`
**Blast radius:** Writer only.
**Research needed:** No.

### T10: NEW — Lightsprint smoke test
**Objective:** Prove Lightsprint accepts the prompt from T9 and produces a PR. Critic concern #4 — verify before demo, not at demo time.
**Complexity:** Simple
**Dependencies:** T9
**Files to change:** None (external service); produces `demo_assets/lightsprint_pr_screenshot.png` as fallback artifact
**Acceptance criteria:**
  - Pasting the T9 generated `lightsprint_prompt` into Lightsprint sandbox produces a visible PR against `benikigai/loopos`
  - PR diff modifies `automations/rules.py` reasonably (we don't merge — artifact only)
  - Screenshot of the PR captured as `demo_assets/lightsprint_pr_screenshot.png` regardless of outcome (used as Beat 6 fallback)
**Test plan:**
  - Manual: open Lightsprint, paste prompt, observe; capture screenshot
**Rollback plan:** Close the auto-generated PR (do not merge); no code changes to revert
**Blast radius:** External service; PR is artifact only, not auto-merged
**Research needed:** Yes — live discovery of Lightsprint sandbox state. **Cuttable** if T8 cut and Beat 6 already degrades to fixture-rendered card.

### T11: Three-pane React UI (`render` method)
**Objective:** UI inside Claude Desktop via Reboot's `ui` method — three panes plus reveals matching gdrive demo arc Beats 2–6.
**Complexity:** Complex
**Dependencies:** T6
**Files to change:** `backend/src/servicers/ops_ticket.py` (`render` ui method), `web/ui/loopos-ui/App.tsx`, `web/ui/loopos-ui/components/{TicketList,ChatPane,CostTicker,BrainSources,SkillArtifactViewer,ProposeRuleCard}.tsx`, `web/ui/loopos-ui/lib/pricing.ts`
**Acceptance criteria:**
  - `render()` ui method returns three-pane React component visible in Claude Desktop:
    - **TicketList (left):** linear feed with status / property / severity / last-action / cost per ticket
    - **ChatPane (center):** voice-drop zone + transcript reveal + classification + dispatch draft
    - **CostTicker (right):** per-property cards reading from `/api/usage` endpoint; for Warm Taipei 2BR shows `today $0.043 · budget remaining $499.96` (from `usage.jsonl`)
  - On RESOLVED status: BrainSources reveal panel with 3 cards (founder voice memo / SOP / historical resolution)
  - SkillArtifact JSON viewer renders pretty-printed (syntax highlighting, collapsible tree)
  - ProposeRule card surfaces with prefilled Lightsprint prompt; click opens Lightsprint
  - Style: zinc/stone palette, Inter font, no gradients, no emoji (anti-goal §6)
**Test plan:**
  - Visual inspection in Claude Desktop with Shirley fixture ticket
  - CostTicker matches gdrive doc target string verbatim
  - All three reveals trigger correctly on status transitions
**Rollback plan:** `git checkout web/ui/loopos-ui/ backend/src/servicers/ops_ticket.py`
**Blast radius:** UI only — backend unaffected if reverted.
**Research needed:** No.

### T12: README + push
**Objective:** One-paragraph README pitch readable on stage; push `reboot-pivot` merged into `main`.
**Complexity:** Simple
**Dependencies:** T11
**Files to change:** `README.md`, `.gitignore` (add `usage.jsonl`, `embeddings_cache.pkl`, `.venv/`)
**Acceptance criteria:**
  - README pitch ≤ 100 words; matches gdrive close: "every company is an open loop / LoopOS closes the loop / I run nine STRs / we replaced our back office with a Claude agent that does the work"
  - `reboot-pivot` merged to `main`; `git push origin main` succeeds
  - `gh repo view benikigai/loopos` shows updated README on landing
**Test plan:**
  - `gh repo view benikigai/loopos --web` visual check
**Rollback plan:** `git revert <merge-commit>` — do not force-push
**Blast radius:** Public repo on landing page.
**Research needed:** No.

### T13: Two timed dry runs
**Objective:** Two full demo runs end-to-end, ≤3 min each, all sponsor beats firing.
**Complexity:** Simple
**Dependencies:** T7, T11 (T8/T10 if shipped)
**Files to change:** None (rehearsal); produces `demo_notes.md` with timing notes
**Acceptance criteria:**
  - Run 1: stopwatch logged for each of 7 beats; identifies any beat >30s over allotment
  - Run 2: hits ≤3:00 with refinements applied; all sponsor moments load-bear correctly
  - Beat 5 has a confirmed mode (live tab-flip OR verbal-claim per T7 outcome)
  - Beat 6 has a confirmed mode (live Lightsprint OR screenshot per T10 outcome)
**Test plan:**
  - Stopwatch + verbal cue checklist; record on phone for self-review
**Rollback plan:** N/A
**Blast radius:** Rehearsal only.
**Research needed:** No.

### T14: Submit + Lightsprint bounty post
**Objective:** Hackathon submission + $25 Lightsprint bounty post on X/LinkedIn.
**Complexity:** Simple
**Dependencies:** T12, T13
**Files to change:** None (external — hackathon platform + social)
**Acceptance criteria:**
  - Submission link captured in `demo_notes.md`
  - Bounty post live on at least one of X/LinkedIn with preview link to repo
**Test plan:**
  - Visual confirmation
**Rollback plan:** N/A
**Blast radius:** Public-facing.
**Research needed:** No.

## Risks

| # | Risk | Probability | Impact | Mitigation |
|---|---|---|---|---|
| 1 | ChatGPT MCP connector unavailable to Ben's account | Medium | High (Beat 5) | T7 GO/NO-GO at min 95 → degrade to verbal-claim; demo proceeds |
| 2 | Reboot scaffold output diverges from master §2.3 expected layout | Medium | Medium | T1 pre-flight in `/tmp/loopos-scaffold-test/` flushes this out before repo pivot |
| 3 | T11 UI complexity slip (six React components in 30min) | Medium | Medium | Cut SkillArtifact viewer fancy reveals; render JSON in `<pre>`; keep three panes + cost ticker as P0 |
| 4 | T8 workflow doesn't ship cleanly (durable wait + escalation) | Medium | Low | Deferrable — Beat 6 ProposeRule card renders from fixture; demo unaffected |
| 5 | Voice corpus authenticity (synthesized vs real) | Low | Low | Tag `representative: true`; pitch line "20 in production, sample shown" |
| 6 | Lightsprint sandbox down at demo time | Low | Medium | T10 captures screenshot regardless; Beat 6 falls back to screenshot reveal |
| 7 | Stage WiFi dies | Low | High | All paths run on localhost; only Lightsprint cameo needs network; screenshot fallback covers it |
| 8 | Shirley audio not recorded by demo | Medium | Medium | Hardcoded transcript fallback dict in `whisper.py` covers all 3 voice notes |

## Research Notes

N/A — master Google Doc `1ohwoaS4nVKKbSakQrGTq0GnEaOSH9vOkqGorxh0jzqg` (LOOPOS — Master Spec) and `What LoopOS is.docx` serve as the research artifact. The master spec contains §2 architecture, §3 sponsor integration patterns with reference code, §4 four-layer Brain schema, §6 anti-goals, §9 fallback matrix.

Live discovery items deferred into task execution:
- T1: actual `/reboot-chat-app` skill scaffold output structure
- T7: ChatGPT MCP connector availability for Ben's account
- T10: Lightsprint sandbox responsiveness under AGENTHACK promo
