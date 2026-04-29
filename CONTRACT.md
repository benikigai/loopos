# LoopOS — Inter-Session Contract

> Source of truth for both Claude sessions (loop-core, loop-skin).
> If you change anything here, commit it, and tell the other session to re-read.

## Sessions

| tmux session | Owns | Stack |
|---|---|---|
| `agent-hackday-loopcore` | `backend/`, `agent/`, `fixtures/`, `shared/`, `CONTRACT.md` | Python (Reboot, OpenAI SDK→TokenRouter, Runpod) |
| `agent-hackday-loopskin` | `web/` | Next.js (Lightsprint scaffold), Tailwind + shadcn/ui |

Backend dev server runs on **`localhost:8000`**.
Frontend dev server runs on **`localhost:3000`** with `NEXT_PUBLIC_API_BASE=http://localhost:8000`.

## Demo cast (use real names, never placeholders)

| Person | Lang | Region | Properties |
|---|---|---|---|
| Miguel | en/es | US | Yosemite + Reno |
| Shirley | zh-TW | Taiwan | Warm Taipei 2BR + others |
| Haru | ja | Japan | Ito Yukawa |
| Celine | id | Indonesia | Bali villa |

Operator: **Ben** (founder voice memos).

## API surface

All endpoints return JSON. CORS open for `localhost:3000` during dev.

| Method | Path | Returns |
|---|---|---|
| `POST` | `/ingest` | Accepts `{audio_url?, text?, sender, property_id, channel}`. Creates an `OpsTicket`. Returns `{ticket_id}`. |
| `GET` | `/tickets` | List of `OpsTicket` summaries (id, sender, property_id, status, created_at, snippet). |
| `GET` | `/tickets/:id` | Full `OpsTicket` (includes transcript, translation, classification, dispatch_draft). |
| `GET` | `/tickets/:id/brain` | `{sources: BrainSource[]}` — the 3-layer brain match. |
| `POST` | `/tickets/:id/resolve` | Marks ticket resolved. Returns `{skill: SkillArtifact, proposed_rule: Rule}`. |
| `GET` | `/costs/by-property` | `{[property_id]: {today_usd, fast_calls, fast_usd, strong_calls, strong_usd, budget_remaining_usd}}`. Polled every 1s by cost ticker. Reads from `usage.jsonl`. |
| `GET` | `/usage` | Tail of `usage.jsonl`, last 100 rows. (Optional — `/costs/by-property` is the primary feed.) |

## Shared types

- TS types in `shared/schema.ts` (loop-skin imports)
- Pydantic mirror in `backend/schema.py` (loop-core imports)
- **Both must stay in sync.** If one side changes, edit both, commit, ping.

## Demo invariants

1. **Fixture is the floor.** `fixtures/shirley_ac_leak.json` is the demo path. Both sessions code against this shape. If the live path flakes on stage, we render from this fixture and the demo still works.
2. **Cost ticker is independent of TokenRouter dashboard.** The wrapper writes `usage.jsonl` locally. If TR's dashboard is slow or weird on stage, ticker reads local disk. Never blinks.
3. **Every LLM call is tagged.** `extra_body.metadata` always includes `property_id`, `ticket_id`, `tier` (`fast`|`strong`). No exceptions — this is the unit-economics story.
4. **Skill JSON viewer is the YC #4 payoff.** Resolved tickets generate `SkillArtifact`. Render it pretty (syntax highlighting, collapsible tree). This is the screenshot judges remember.
5. **Real names, real properties, every label.** "Warm Taipei 2BR", not "Property A". "Shirley", not "Operator 2".

## Sync protocol

- **t=15min** — both sides ack: schema read, fixture read, scaffolds running
- **t=1.5h** — first integration sync (3-line status each)
- **t=2.5h** — final integration sync, then polish + pitch
- **t=3.5h** — demo

## Sponsor stack

- **TokenRouter** (`tokenrouter.com`) — OpenAI-compatible. `OPENAI_BASE_URL=$TOKENROUTER_BASE_URL`, `OPENAI_API_KEY=$TOKENROUTER_API_KEY`. Tag every call.
- **Reboot** (`reboot.dev`) — durable workflow. `OpsTicket` is the durable object.
- **Runpod** — faster-whisper serverless template. **Hardcoded fallback** to fixture transcript if endpoint flakes.
- **Lightsprint** — repo + sandbox host. Closing cameo: ship a new rule via plan-mode prompt on stage.

## Env vars (loop-core needs these in backend/.env)

```
TOKENROUTER_API_KEY=...
TOKENROUTER_BASE_URL=...
RUNPOD_API_KEY=...
RUNPOD_WHISPER_ENDPOINT=...
```

(Loop-skin needs nothing in env beyond `NEXT_PUBLIC_API_BASE`.)
