# LoopOS — 10-min Demo Video Outline (RECORDING-READY)

**Total runtime:** 10:00 (600 seconds)
**Format:** 1080p, 30fps, voiceover + screen recording, hybrid slide deck for Sections 1–2
**Tone:** confident operator, technical but not jargon-heavy, hackathon energy
**Demo path:** text-only (per spec amend `083e403`) — no audio drop on stage; audio is B-roll only

---

## Pre-flight (must be true before hitting record)

- [ ] Mini: OrbStack engine up; `docker info` prints Server Version
- [ ] Mini: `cd ~/code/loopos && uv run rbt dev run` running on `:9991`
- [ ] Mini: `cd ~/code/loopos/web && npm run dev` running on `:4444`
- [ ] Mini: `tail -f ~/code/loopos/usage.jsonl` visible in a small window (cost ticker B-roll)
- [ ] MBP: SSH tunnel `ssh -L 9991:localhost:9991 -L 4444:localhost:4444 -N elias@eliass-mac-mini.tail365038.ts.net`
- [ ] MBP: Claude Desktop quit + reopen, LoopOS shows in connectors
- [ ] MBP: ChatGPT in browser, LoopOS connector wired via cloudflared tunnel
- [ ] MBP: Lightsprint sandbox tab open, repo `benikigai/loopos` connected, `AGENTHACK` promo applied
- [ ] Editor open (Cursor/VS Code) on these files in advance:
  - `api/loopos/v1/loopos.py`
  - `backend/src/servicers/loopos.py`
  - `data/voice_corpus.json`
  - `data/skills/handle_hvac_leak.json`
- [ ] AirPods Pro paired, room quiet, Slack/email muted

---

# SECTION 1 — THE PROBLEM (0:00 – 2:00)

## Beat 1.1 — Cold Open Hook (0:00 – 0:25)

**On screen:** Black slide. White Mandarin text fades in:
> Ben，Warm Taipei 主臥冷氣在漏水，客人很生氣。誰可以叫？

Below, English subtitle fades in:
> "Ben — the AC at Warm Taipei is leaking, guest is angry. Who do I call?"

Optional B-roll: `shirley_ac_zh.m4a` plays at low volume in background (10s) — visceral but doesn't drive the demo.

**Voiceover:**
> "This message arrived at 3 a.m. The guest was angry. Mr. Wang — the HVAC guy — only speaks Mandarin. Shirley speaks Mandarin. I don't. And the SOP for HVAC leaks lives somewhere in my head, three time zones away."

**Capture:** record voiceover separately; sync over the slide in editor.

---

## Beat 1.2 — Setup: who I am, what I run (0:25 – 1:15)

**On screen — Slide A:** "I run 9 short-term rentals across 4 countries." 4-photo grid: Yosemite cabin, Reno house, Warm Taipei interior, Ito Stream House exterior.

**On screen — Slide B:** "5-person ops team, 4 languages." Avatar grid: Miguel (en/es), Shirley (zh-TW), Haru (ja), Celine (id).

**On screen — Slide C:** Three-column visual labelled "Every company is an open loop":
- Column 1: Slack screenshot (blurred)
- Column 2: WhatsApp thread screenshot (blurred)
- Column 3: stylized brain icon — "Ben's head"

**Voiceover:**
> "I'm Ben. I run nine short-term rentals across California, Oregon, Taiwan, and Japan, with a five-person ops team that speaks four languages between them. Miguel covers the U.S. properties in English and Spanish. Shirley covers Taipei in Mandarin. Haru covers Ito in Japanese. Celine covers Bali in Indonesian.
>
> Every company in this category — short-term rentals, cleaning, field service, hospitality, anything deskless — is an open loop. Decisions live in Slack threads. Work happens in WhatsApp messages. Vendor preferences live in my head. SOPs live in Notion docs nobody reads. Resolution history is buried in old chat history.
>
> Every fact about how my company runs is fragmented, in three languages, across four time zones. That's the open loop. That's the problem."

---

## Beat 1.3 — Thesis: YC framing (1:15 – 2:00)

**On screen — Slide D:** "YC RFS #2 — AI-Native Service Companies" with Gustaf Alströmer's photo and one-line quote.

**On screen — Slide E:** "YC RFS #4 — Company Brain" with Tom Blomfield's photo. Bold callout: *"executable skills file"*.

**Voiceover:**
> "Gustaf Alströmer wrote the AI-Native Service Companies thesis on YC's Request for Startups: companies that skip the human, do the work directly, sell the service not the software. Services TAM is multiples of software TAM.
>
> Tom Blomfield wrote the Company Brain thesis last week. The blocker to AI automation isn't model quality — it's domain knowledge. Tribal knowledge scattered across heads, email, Slack, tickets. He used a specific phrase: *executable skills file*. Not RAG over docs. Not chat over knowledge bases. Executable.
>
> LoopOS is both. We don't sell PMS software to property managers. We *are* the property manager. The agent does the work. We take the operator margin. And the Company Brain — that executable skills file — is what makes the agent smart enough to actually do it."

**Production note:** Slide D and E should each show ~10 seconds. Don't dwell.

---

# SECTION 2 — THE STACK (2:00 – 5:00)

## Beat 2.1 — Reboot (2:00 – 2:50)

**On screen:**
- 0:00–0:10 — Master architecture diagram (system diagram from spec §2.1)
- 0:10–0:30 — Cut to `api/loopos/v1/loopos.py` in editor; scroll-highlight the `OpsTicket` Type definition
- 0:30–0:50 — Highlight `mcp=Tool()` annotations and the `ui` method

**Voiceover:**
> "Reboot is the spine. It's a durable multiplayer state framework with first-class MCP support — meaning every method I write becomes an AI-callable tool, automatically. The `OpsTicket` type holds the full lifecycle of a service request — Reader methods for queries, Writer methods for mutations, Workflow methods for the durable wait-for-vendor-ack-or-escalate-after-30-seconds flow. The React UI ships *inside* Claude Desktop via Reboot's `ui` method — there's no separate frontend.
>
> The unlock is multiplayer. When Shirley approves a dispatch from ChatGPT in Mandarin, the same `OpsTicket` updates in my Claude Desktop in English — same durable state, two clients, no glue code. Without Reboot, this is three days of bespoke server work."

---

## Beat 2.2 — TokenRouter (2:50 – 3:40)

**On screen:**
- 0:00–0:15 — `backend/src/servicers/helpers/llm.py`, scroll to `classify_fast` function, highlight the `extra_body={"metadata": {...}}` block
- 0:15–0:30 — Cut to `usage.jsonl` tailing live, with rows tagged by property
- 0:30–0:50 — Cut to UI: per-property cost ticker with "Warm Taipei 2BR · today $0.043 · budget remaining $499.96"

**Voiceover:**
> "TokenRouter is the model gateway. Drop-in OpenAI-compatible. One API key, two-tier routing — cheap open-source Llama for classification, Claude Opus for dispatch reasoning. But the unlock is per-tenant cost telemetry. Every call is tagged with `metadata.property_id`, `metadata.ticket_id`, `metadata.tier`. We append every call to a local `usage.jsonl`.
>
> Today, Warm Taipei burned forty-three cents. Budget remaining: four hundred and ninety-nine dollars and ninety-six cents. This per-property accounting is what investors and operators actually need to underwrite an AI service company. Without TokenRouter, I'd be hand-rolling cost telemetry and inventing my own routing layer."

---

## Beat 2.3 — Runpod (3:40 – 4:00)

**On screen:**
- 0:00–0:10 — `backend/src/servicers/helpers/whisper.py`, highlight the `transcribe_and_translate` function and the `HARDCODED_TRANSCRIPTS` fallback dict
- 0:10–0:20 — Brief flash of Shirley's audio file in `demo_assets/`

**Voiceover:**
> "Runpod handles voice ingestion via faster-whisper serverless. Real ops teams send voice notes in Mandarin, Japanese, Indonesian — not text in English. The helper, the fallback dict, and the architecture are all in the repo. We ran the text path in this demo for time, but the multilingual moat extends to voice with one Runpod endpoint URL — the architectural completeness is the YC-question bridge."

---

## Beat 2.4 — Lightsprint (4:00 – 4:40)

**On screen:**
- 0:00–0:15 — UI showing the "Propose New Rule" card with prefilled prompt visible
- 0:15–0:30 — Cut to Lightsprint sandbox in browser: prompt pasted, generating a plan
- 0:30–0:40 — A live PR diff against `automations/rules.py`

**Voiceover:**
> "When a pattern repeats — HVAC at Taipei always going to Mr. Wang within two hours — LoopOS surfaces a Propose New Rule card with a prefilled Lightsprint prompt. One click. Lightsprint reads my codebase, generates a plan, ships a PR against `automations/rules.py`. The company learned. The product updated. No engineer in the loop. Diana Hu's AI Operating System for Companies — RFS #15 — made literal."

---

## Beat 2.5 — Stack closer (4:40 – 5:00)

**On screen:** Single slide with 4 sponsor logos in a row. One line each:
- **Reboot** — durable multiplayer state, MCP server, UI inside Claude
- **TokenRouter** — every LLM call, two-tier, per-tenant cost telemetry
- **Runpod** — multilingual voice ingestion (Q&A bridge)
- **Lightsprint** — closes the loop with live PRs

**Voiceover:**
> "Each of these had to exist for LoopOS to work. None of this stack was possible six months ago. Now it's a Saturday afternoon."

---

# SECTION 3 — LIVE DEMO + CODE (5:00 – 10:00)

## Beat 3.0 — Setup shot (5:00 – 5:30)

**On screen:**
- Split frame: Claude Desktop on left half, ChatGPT on right half. Both showing empty LoopOS panes — same project, two clients.
- Title overlay: "Two AI assistants. One Company Brain."

**Voiceover:**
> "Two AI assistants. Different operators, different languages, different time zones. Both connected to the same LoopOS MCP server. Same durable state."

**Capture:** zoom out to show both windows; record at 1920x1080 with both apps tiled.

---

## Beat 3.1 — Voice In (Text path) (5:30 – 6:00)

**On screen:**
- Focus on Claude Desktop. Open a fresh chat with the LoopOS connector active.
- Paste into Claude:
  > Use loopos to ingest a text message for property `warm_taipei_2br`. The message in Mandarin is: `Ben，Warm Taipei 主臥冷氣在漏水，客人很生氣。誰可以叫？`
- Watch the tool call fire. The LoopOS UI panel renders inside the chat.

**Voiceover:**
> "Shirley just texted me from Taipei. She wrote in Mandarin because that's how my ops team works. I paste her message into Claude — Claude calls the LoopOS `ingest_text_message` tool. A new `OpsTicket` is created in Reboot with status `NEW`."

---

## Beat 3.2 — Triage + Brain Sources (6:00 – 6:45)

**On screen:**
- Watch the ticket cascade:
  - Status: NEW → TRIAGED → AWAITING_HUMAN
  - Category: `hvac_leak`
  - Severity: 4
  - Cost ticker increments by ~$0.001 (classification)
- Click "Show Brain Sources." Three cards reveal:
  - **Founder Voice** — Mr. Wang memo from `voice_corpus.json` (verbatim text on screen)
  - **SOP Matched** — `hvac_leak` from `sops.json`
  - **Historical Resolution** — April 2024 Warm Taipei AC leak, $145, 5-star outcome

**Voiceover:**
> "TokenRouter routes the classification to a cheap Llama model — language detected as Traditional Chinese, category `hvac_leak`, severity four. Then the four-layer Brain runs retrieval. Three layers fire.
>
> Layer one — Founder Voice. My actual voice memo from March 2024: 'AC at Taipei, always Mr. Wang first, Mandarin OK, around eighty bucks emergency, don't auth over two hundred.'
>
> Layer two — SOP. The HVAC Leak protocol, from the SOP library.
>
> Layer three — Historical resolution. Same property, same category, April 2024 — Mr. Wang again, 2.1 hours, $145, 5-star outcome.
>
> This is not RAG over docs. Three layers of company knowledge synthesized into one decision."

---

## Beat 3.3 — SkillArtifact (6:45 – 7:15)

**On screen:** SkillArtifact JSON viewer opens, pretty-printed and syntax-highlighted:
```json
{
  "skill_id": "handle_hvac_leak",
  "trigger_conditions": ["AC leaking", "water near electrical"],
  "preferred_vendors": ["mr_wang_hvac"],
  "auth_cap_usd": 200,
  "guest_voice_style": "founder_voice",
  "approval_rules": ["manager approval >$500"],
  "sources": { ... }
}
```

**Voiceover:**
> "And here's the YC #4 payoff. Tom Blomfield called this the Company Brain primitive in last week's RFS — an *executable skills file*, not a chatbot. This is what one looks like. Not training data. Not a prompt. A literal JSON artifact the agent runs against. Skill ID, triggers, preferred vendors, authorization cap, guest voice style, approval rules, source citations."

---

## Beat 3.4 — Multiplayer reveal (7:15 – 7:45)

**On screen:**
- Tab-flip from Claude Desktop to ChatGPT.
- In ChatGPT: type "list loopos tickets."
- The Warm Taipei ticket appears — same ID, same state, same severity.
- Type: "approve dispatch."
- Tab-flip back to Claude Desktop. Same ticket — status flipped from `awaiting_human` to `dispatched`.

**Voiceover:**
> "Shirley doesn't use Claude. She uses ChatGPT, in Mandarin. So I flip to her ChatGPT — and the same ticket is sitting there. Same ID. Same state. She approves dispatch. I flip back to my Claude — the dispatch is authorized. Same MCP server. Two clients. Shared durable state. Every team member plugs in from whichever AI assistant they prefer. This is what Reboot's multiplayer durable state actually buys you."

---

## Beat 3.5 — Closed loop / Lightsprint (7:45 – 8:15)

**On screen:**
- Ticket flips to `RESOLVED`.
- Propose New Rule card surfaces with prefilled Lightsprint prompt.
- Click → opens Lightsprint sandbox in new tab, prompt already pasted.
- Hit "Ship." Lightsprint generates a PR diff against `automations/rules.py` live on screen.

**Voiceover:**
> "Ticket resolves. The system noticed: HVAC at Taipei + Mr. Wang + 2-hour resolution — that's a pattern. Propose New Rule card surfaces with a Lightsprint prompt prefilled. One click, Lightsprint opens. Hit ship. PR generated, live, on stage. The loop closes. The company learned. The product updated. No engineer required. This is RFS #15 — Diana Hu's AI Operating System for Companies — made literal."

---

## Beat 3.6 — Code highlights (8:15 – 9:30)

**On screen — File 1 (~25s):** `api/loopos/v1/loopos.py`. Scroll-highlight:
- The `OpsTicket` Type definition
- Three Reader methods, three Writer methods, one Workflow, one UI
- Each annotated `mcp=Tool()`

**Voiceover:**
> "Here's the entire backend contract. Two hundred lines. The `OpsTicket` durable type. Three readers. Three writers. One workflow. One UI mount point. Every method tagged `mcp=Tool` exposes it to the AI clients automatically. Reboot generates the gRPC, the MCP wire format, the React bindings. I write Pydantic, I get a multi-client durable backend."

**On screen — File 2 (~25s):** `backend/src/servicers/loopos.py`. Highlight the `triage` writer:
- LLM call to `classify_fast`
- Call to `retrieve_brain_context`
- Skill artifact attachment
- Status gate based on severity

**Voiceover:**
> "And here's `triage`. Forty lines. Classify, retrieve, decide. Reboot handles the durability. TokenRouter handles the inference. The retrieval helper handles the brain. Each piece is small, composable, swappable."

**On screen — File 3 (~25s):** `data/voice_corpus.json`. Scroll the entries. Pause on `vm_2024_03_taipei_ac` — the Mr. Wang memo.

**Voiceover:**
> "This is the unfakeable bit. My actual founder voice memos. Two years of WhatsApp conversations and ops decisions, structured into queryable artifacts. This is the moat. You can clone the architecture in a week. You can't clone the corpus."

---

## Beat 3.7 — Close (9:30 – 10:00)

**On screen:** Final slide.
- Centered: **LoopOS** logo
- Below: tagline — "Closed-loop AI operating system for deskless service companies."
- Bottom: GitHub link `github.com/benikigai/loopos`, demo link, Discord handle, email.

**Voiceover:**
> "LoopOS — closed-loop AI operating system for deskless service companies. We're not pitching software to property managers. We *are* the property manager. AI-native service company with software margins — Gustaf Alströmer's RFS #2. The Company Brain — Tom Blomfield's RFS #4 — made executable. The closed loop — Diana Hu's RFS #15 — made literal.
>
> Built in three hours at AWS Builder Loft. Open source on GitHub. Apply with us. Thanks."

---

# Production Checklist (estimated 90–120 min)

| Step | Time | Tool |
|---|---|---|
| Make slides for Sections 1+2 (~12 slides total) | 30 min | Keynote / Google Slides |
| Record voiceover for Sections 1+2 (script above) | 15 min | QuickTime audio + AirPods Pro |
| Live demo screen recording (Section 3, two takes) | 20 min | QuickTime / OBS |
| Code-highlight screen recording (Beat 3.6) | 10 min | Cursor/VS Code dark theme |
| Edit + sync + export 1080p MP4 | 30 min | iMovie / Descript |
| Upload to YouTube (unlisted) + add to submission | 5 min | — |

# B-roll / Asset Inventory

| Asset | Source | Used in |
|---|---|---|
| 4 property photos (Yosemite/Reno/Taipei/Ito) | iCloud / phone | Slide A |
| 4 ops team avatars (Miguel/Shirley/Haru/Celine) | profile pics or generic icons | Slide B |
| Slack + WhatsApp blurred screenshots | own accounts | Slide C |
| Gustaf + Tom Blomfield + Diana Hu photos | YC site (with credit) | Slides D/E |
| `shirley_ac_zh.m4a` audio | `~/code/loopos/demo_assets/` | Beat 1.1 cold open (B-roll) |
| 4 sponsor logos | each sponsor's press kit | Beat 2.5 closer |
| LoopOS logo / tagline | TBD — generate or text-only | End slide |

# Editing Notes

- Set slide transitions to "fade through black" 0.4s — feels punchy, not flashy
- Voiceover normalize to -16 LUFS, ducked under any sponsor logo motion
- Add lower-third captions for: "Ben Shyong, founder LoopOS" and timestamps for each beat
- Add caption for the Mandarin paste in Beat 3.1 (English subtitle below)
- Color-grade screen recordings to match: editor uses One Dark Pro, terminal uses iTerm2 SF Mono
- Export: H.264, 1080p30, target 12 Mbps, AAC audio 256 kbps
