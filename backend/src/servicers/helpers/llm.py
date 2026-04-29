"""TokenRouter wrapper for LoopOS.

Two responsibilities:
1. Tag every call with metadata.{property_id, ticket_id, tier} so
   TokenRouter's dashboard groups cost per-property.
2. Append every call to local usage.jsonl so the cost ticker is
   independent of the TR dashboard rendering on stage.
"""
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

from openai import OpenAI

# Project-root usage log (resolved from this file's location).
USAGE_LOG = Path(
    os.environ.get(
        "LOOPOS_USAGE_LOG",
        Path(__file__).resolve().parents[4] / "usage.jsonl",
    )
)

# Approximate $/token. Frontend mirrors this in web/ui/loopos-ui/lib/pricing.ts.
PRICING: dict[str, dict[str, float]] = {
    "fast": {"input": 0.0000005, "output": 0.0000015},
    "strong": {"input": 0.000015, "output": 0.000075},
}

FAST_MODEL = os.environ.get("LOOPOS_FAST_MODEL", "llama-3.3-70b")
STRONG_MODEL = os.environ.get("LOOPOS_STRONG_MODEL", "claude-opus-4-7")
EMBEDDING_MODEL = os.environ.get(
    "LOOPOS_EMBEDDING_MODEL", "text-embedding-3-small"
)

_client: Optional[OpenAI] = None


def _get_client() -> OpenAI:
    """Lazy-init so `import` doesn't crash without env vars set."""
    global _client
    if _client is None:
        _client = OpenAI(
            api_key=os.environ["TOKENROUTER_API_KEY"],
            base_url=os.environ["TOKENROUTER_BASE_URL"],
        )
    return _client


def _estimate_usd(tier: str, input_tokens: int, output_tokens: int) -> float:
    p = PRICING[tier]
    return round(input_tokens * p["input"] + output_tokens * p["output"], 6)


def _log_usage(
    property_id: str,
    ticket_id: str,
    model: str,
    tier: str,
    input_tokens: int,
    output_tokens: int,
) -> None:
    row = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "property_id": property_id,
        "ticket_id": ticket_id,
        "model": model,
        "tier": tier,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "usd": _estimate_usd(tier, input_tokens, output_tokens),
    }
    USAGE_LOG.parent.mkdir(parents=True, exist_ok=True)
    with USAGE_LOG.open("a") as f:
        f.write(json.dumps(row) + "\n")


def classify_fast(text: str, property_id: str, ticket_id: str) -> dict[str, Any]:
    """Cheap OSS model for triage. Returns parsed JSON classification."""
    response = _get_client().chat.completions.create(
        model=FAST_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "Classify ops ticket. Return JSON with keys: "
                    "category (string, e.g. hvac_leak / lockout / plumbing_leak), "
                    "severity (1-5 int), language (BCP-47), "
                    "urgency_window_minutes (int), "
                    "risk_tags (array of strings, e.g. electrical_risk)."
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
    usage = response.usage
    _log_usage(
        property_id,
        ticket_id,
        FAST_MODEL,
        "fast",
        usage.prompt_tokens if usage else 0,
        usage.completion_tokens if usage else 0,
    )
    return json.loads(response.choices[0].message.content or "{}")


def reason_strong(prompt: str, property_id: str, ticket_id: str) -> str:
    """Claude Opus for hard reasoning. Returns raw text."""
    response = _get_client().chat.completions.create(
        model=STRONG_MODEL,
        messages=[{"role": "user", "content": prompt}],
        extra_body={
            "metadata": {
                "property_id": property_id,
                "ticket_id": ticket_id,
                "tier": "strong",
            }
        },
    )
    usage = response.usage
    _log_usage(
        property_id,
        ticket_id,
        STRONG_MODEL,
        "strong",
        usage.prompt_tokens if usage else 0,
        usage.completion_tokens if usage else 0,
    )
    return response.choices[0].message.content or ""


def embed(text: str) -> list[float]:
    """Single-text embedding via TokenRouter. Used by retrieval cosine ranking."""
    response = _get_client().embeddings.create(
        model=EMBEDDING_MODEL,
        input=text,
    )
    return list(response.data[0].embedding)
