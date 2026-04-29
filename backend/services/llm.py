"""TokenRouter wrapper for LoopOS.

Two responsibilities:
1. Tag every call with metadata.{property_id, ticket_id, tier} so TokenRouter's
   dashboard groups cost per-property.
2. Append every call to local usage.jsonl so the cost ticker is independent of
   the TR dashboard rendering on stage.
"""
import json
import os
from datetime import datetime, timezone
from pathlib import Path

from openai import OpenAI

USAGE_LOG = Path(os.environ.get("LOOPOS_USAGE_LOG", "usage.jsonl"))

# Approximate $/token. Frontend uses these too — keep in sync with web/lib/pricing.ts.
PRICING = {
    "fast": {"input": 0.0000005, "output": 0.0000015},
    "strong": {"input": 0.000015, "output": 0.000075},
}

client = OpenAI(
    api_key=os.environ["TOKENROUTER_API_KEY"],
    base_url=os.environ["TOKENROUTER_BASE_URL"],
)


def _estimate_usd(tier: str, input_tokens: int, output_tokens: int) -> float:
    p = PRICING[tier]
    return round(input_tokens * p["input"] + output_tokens * p["output"], 6)


def _log_usage(property_id: str, ticket_id: str, model: str, tier: str, response) -> None:
    usage = response.usage
    row = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "property_id": property_id,
        "ticket_id": ticket_id,
        "model": model,
        "tier": tier,
        "input_tokens": usage.prompt_tokens,
        "output_tokens": usage.completion_tokens,
        "usd": _estimate_usd(tier, usage.prompt_tokens, usage.completion_tokens),
    }
    USAGE_LOG.parent.mkdir(parents=True, exist_ok=True)
    with USAGE_LOG.open("a") as f:
        f.write(json.dumps(row) + "\n")


def classify_fast(text: str, property_id: str, ticket_id: str) -> dict:
    """Cheap OSS model for triage. Returns parsed JSON classification."""
    model = "llama-3.3-70b"
    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": (
                    "Classify ops ticket. Return JSON with keys: "
                    "category (string), severity (1-5 int), language (BCP-47), "
                    "urgency_window_minutes (int)."
                ),
            },
            {"role": "user", "content": text},
        ],
        response_format={"type": "json_object"},
        extra_body={
            "metadata": {
                "property_id": property_id,
                "ticket_id": ticket_id,
                "tier": "fast",
            }
        },
    )
    _log_usage(property_id, ticket_id, model, "fast", response)
    return json.loads(response.choices[0].message.content)


def reason_strong(prompt: str, property_id: str, ticket_id: str) -> str:
    """Claude Opus for hard reasoning. Returns raw text."""
    model = "claude-opus-4-7"
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        extra_body={
            "metadata": {
                "property_id": property_id,
                "ticket_id": ticket_id,
                "tier": "strong",
            }
        },
    )
    _log_usage(property_id, ticket_id, model, "strong", response)
    return response.choices[0].message.content
