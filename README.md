# LoopOS

Closed-loop AI operating system for deskless service companies.

> Every company is an open loop — decisions in Slack, work in tickets, knowledge in heads. **LoopOS closes the loop.**

I run nine short-term rentals across four countries with a five-person multilingual ops team. We replaced our back office with an AI agent that does the work. We don't sell PMS software — we *are* the property manager. AI-native service company with software margins.

Built at AWS Builder Loft "Build YC's Next Unicorn — Agent Hack Day", April 29 2026.

## What it is

A multiplayer MCP-native AI Chat App. Every team member's AI assistant (Claude, ChatGPT) plugs into the same durable backend and shares state. Voice notes from a cleaner in Mandarin, a host in Japanese, an operator in Indonesian — all flow into the same Company Brain, get triaged in their language, and dispatched to the right vendor with the right cost cap.

The Company Brain is a four-layer durable state:

- Founder voice corpus (the unfakeable bit — Ben's real ops decisions)
- Structured property/team/vendor data
- SOP library (markdown, indexed)
- Resolution history (every closed ticket sharpens the brain)

When a pattern repeats, LoopOS proposes a new Skill — a YC #4 *executable skills file* — and ships it as a PR via Lightsprint.

## Architecture

- **Reboot** — durable multiplayer state, MCP server connecting Claude Desktop and ChatGPT, React UI shipped *inside* Claude
- **TokenRouter** — every LLM call, two-tier routed (cheap OSS for classification, Claude Opus for reasoning), tagged per-property for unit-economics telemetry
- **Runpod** — multilingual Whisper transcription (faster-whisper serverless)
- **Lightsprint** — closing-cameo PR ship for new automation rules

## Run

```bash
# Terminal 1 — backend
uv run rbt dev run

# Terminal 2 — Vite HMR
cd web && npm run dev

# Terminal 3 — MCP inspector for testing
npx @mcpjam/inspector@2.4.0 --config mcp_servers.json --server loopos
```

Then connect Claude Desktop and ChatGPT to the LoopOS MCP server (see `mcp_servers.json`).

## YC RFS coverage

- **#2 — AI-Native Service Companies** (Alströmer): the frame. We don't sell software; we sell the service.
- **#4 — Company Brain** (Blomfield): the executable Skills file is the differentiator.
- **#15 — AI OS for Companies** (Hu): closed loop — every interaction legible, every ticket sharpens the brain.
- **#12 — Software for Agents** (Epstein): every Skill is `agent.json`-compatible.

## Demo path

Drop a Mandarin text from Shirley about an AC leak at Warm Taipei into Claude. Watch:

1. TokenRouter classifies (fast tier) — `hvac_leak`, severity 4, electrical risk
2. Brain retrieves: founder voice memo (Mr. Wang first, Mandarin OK, $200 cap), SOP, prior April 2024 resolution
3. Claude Opus drafts dispatch (Mr. Wang HVAC, $145 estimate)
4. SkillArtifact JSON renders — `handle_hvac_leak` with `auth_cap_usd: 200`
5. Tab to ChatGPT — same ticket visible. Same MCP, two clients.
6. "Propose New Rule" surfaces. One click → Lightsprint plan-mode → PR opens live.

Three minutes flat. Every sponsor lands a load-bearing moment.
