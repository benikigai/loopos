"""Four-layer Brain retrieval over the JSON corpus in data/.

Layers:
  1. Founder voice corpus (top-3 by cosine over OpenAI embeddings, with
     keyword fallback if the embedding API fails).
  2. SOP library (keyword match over trigger_phrases).
  3. Historical resolutions (filter by property + category, recent-first).
  4. Skills registry (load data/skills/handle_<category>.json).
"""
import json
import math
import os
import pickle
from pathlib import Path
from typing import Any, Optional

import numpy as np

from servicers.helpers import llm

_PROJECT_ROOT = Path(__file__).resolve().parents[4]
_DATA_DIR = _PROJECT_ROOT / "data"
_EMBEDDINGS_CACHE = _PROJECT_ROOT / "embeddings_cache.pkl"


def _load_json(name: str) -> Any:
    return json.loads((_DATA_DIR / name).read_text())


# Lazy-loaded corpus.
_corpus: dict[str, Any] = {}


def _corpus_get(name: str) -> Any:
    if name not in _corpus:
        _corpus[name] = _load_json(name)
    return _corpus[name]


def _load_embeddings_cache() -> dict[str, list[float]]:
    if _EMBEDDINGS_CACHE.exists():
        try:
            return pickle.loads(_EMBEDDINGS_CACHE.read_bytes())
        except (pickle.UnpicklingError, EOFError):
            return {}
    return {}


def _save_embeddings_cache(cache: dict[str, list[float]]) -> None:
    _EMBEDDINGS_CACHE.write_bytes(pickle.dumps(cache))


def _cosine(a: list[float], b: list[float]) -> float:
    if not a or not b:
        return 0.0
    av = np.array(a, dtype=np.float32)
    bv = np.array(b, dtype=np.float32)
    denom = float(np.linalg.norm(av) * np.linalg.norm(bv))
    if denom == 0.0 or math.isnan(denom):
        return 0.0
    return float(np.dot(av, bv) / denom)


def _embed_with_fallback(text: str, cache: dict[str, list[float]]) -> Optional[list[float]]:
    if text in cache:
        return cache[text]
    if not os.environ.get("TOKENROUTER_API_KEY"):
        return None
    try:
        vec = llm.embed(text)
    except Exception as exc:
        print(f"[retrieval] embedding failed, keyword fallback: {exc}")
        return None
    cache[text] = vec
    return vec


def _voice_memo_text(memo: dict[str, Any]) -> str:
    """Concatenate memo text + tags for embedding/keyword scoring."""
    return f"{memo.get('text', '')} {' '.join(memo.get('tags', []))}"


def _keyword_score(query: str, doc: str) -> float:
    """Simple bag-of-words overlap. Lowercase, strip punctuation."""
    qtokens = {t for t in query.lower().split() if len(t) > 2}
    dtokens = {t for t in doc.lower().split() if len(t) > 2}
    if not qtokens:
        return 0.0
    return len(qtokens & dtokens) / len(qtokens)


def _rank_voice_memos(
    query_text: str,
    property_id: str,
    category: str,
    top_k: int = 3,
) -> list[dict[str, Any]]:
    """Returns up to top_k voice memos with relevance score attached."""
    memos = _corpus_get("voice_corpus.json")
    cache = _load_embeddings_cache()
    query_embedding = _embed_with_fallback(query_text, cache)

    scored: list[tuple[float, dict[str, Any]]] = []
    for memo in memos:
        memo_text = _voice_memo_text(memo)
        # Tag-level boost when the memo cites this property or category.
        tag_boost = 0.0
        if property_id and property_id in memo.get("tags", []):
            tag_boost += 0.15
        if category and category in memo.get("tags", []):
            tag_boost += 0.10

        if query_embedding is not None:
            memo_embedding = _embed_with_fallback(memo_text, cache)
            base = _cosine(query_embedding, memo_embedding) if memo_embedding else 0.0
        else:
            base = _keyword_score(query_text, memo_text)

        scored.append((base + tag_boost, memo))

    _save_embeddings_cache(cache)
    scored.sort(key=lambda x: x[0], reverse=True)
    out: list[dict[str, Any]] = []
    for score, memo in scored[:top_k]:
        m = dict(memo)
        m["relevance"] = round(min(1.0, max(0.0, score)), 3)
        out.append(m)
    return out


def _match_sop(query_text: str, category: str) -> Optional[dict[str, Any]]:
    sops = _corpus_get("sops.json")
    qlower = query_text.lower()
    # Direct id match wins (e.g. category="hvac_leak" → SOP id="hvac_leak").
    for sop in sops:
        if sop.get("id") == category:
            return sop
    # Trigger phrase match.
    best: tuple[int, Optional[dict[str, Any]]] = (0, None)
    for sop in sops:
        hits = sum(
            1 for phrase in sop.get("trigger_phrases", [])
            if phrase.lower() in qlower
        )
        if hits > best[0]:
            best = (hits, sop)
    return best[1]


def _filter_historical(
    property_id: str,
    category: str,
    top_k: int = 3,
) -> list[dict[str, Any]]:
    rows = _corpus_get("historical_resolutions.json")
    matches = [
        r for r in rows
        if r.get("property_id") == property_id and r.get("category") == category
    ]
    matches.sort(key=lambda r: r.get("resolved_at", ""), reverse=True)
    out: list[dict[str, Any]] = []
    for r in matches[:top_k]:
        m = dict(r)
        # Synthetic relevance: 1.0 for the most recent, decay by 0.1 per slot.
        m["relevance"] = round(max(0.5, 1.0 - 0.1 * len(out)), 3)
        out.append(m)
    return out


def _load_skill(category: str) -> Optional[dict[str, Any]]:
    skill_path = _DATA_DIR / "skills" / f"handle_{category}.json"
    if not skill_path.exists():
        return None
    return json.loads(skill_path.read_text())


def retrieve_brain_context(
    *,
    transcript: str,
    property_id: str,
    category: str,
) -> dict[str, Any]:
    """Top-level Brain query — returns the four layers a triage writer needs.

    Args:
        transcript: text of the ticket (transcript_en preferred, or native)
        property_id: e.g. "warm_taipei_2br"
        category: e.g. "hvac_leak"

    Returns:
        {
          "voice_memos": list[dict] with relevance,
          "matched_sop": dict | None,
          "historical_resolutions": list[dict] with relevance,
          "synthesized_skill": dict | None,
        }
    """
    return {
        "voice_memos": _rank_voice_memos(transcript, property_id, category),
        "matched_sop": _match_sop(transcript, category),
        "historical_resolutions": _filter_historical(property_id, category),
        "synthesized_skill": _load_skill(category),
    }
