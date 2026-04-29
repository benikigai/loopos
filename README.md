# LoopOS

Closed-loop AI operating system for deskless service companies.

> Every company is an open loop — decisions in Slack, work in tickets, knowledge in heads. LoopOS closes the loop.

Built at AWS Builder Loft "Build YC's Next Unicorn — Agent Hack Day", Apr 29 2026.

## Architecture

- **`backend/`** — Python. Reboot durable workflow + TokenRouter (OpenAI-compatible) + Runpod Whisper.
- **`web/`** — Next.js. Lightsprint-scaffolded UI.
- **`shared/schema.ts`** + **`backend/schema.py`** — typed shapes, mirrored.
- **`fixtures/shirley_ac_leak.json`** — demo path source-of-truth.
- **`CONTRACT.md`** — inter-session contract.

## Run

```bash
# backend
cd backend
cp .env.example .env  # fill in TokenRouter + Runpod
python -m venv .venv && source .venv/bin/activate
pip install openai pydantic fastapi uvicorn reboot
uvicorn api.main:app --reload --port 8000

# frontend (after Lightsprint scaffolds web/)
cd web
npm install
NEXT_PUBLIC_API_BASE=http://localhost:8000 npm run dev
```
