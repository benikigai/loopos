"""Runpod faster-whisper wrapper with hardcoded transcript fallback.

The hardcoded dict ensures the demo never blocks on a flaky external API.
Beat 1 of the demo uses the text-only path (`ingest_text_message`); the
voice path is exercised off-stage via `ingest_voice_note`.
"""
import os
import time
from typing import Any

import httpx

# Hardcoded transcript fallbacks. Keys match demo_assets/ filenames.
HARDCODED_TRANSCRIPTS: dict[str, dict[str, str]] = {
    "shirley_ac_zh.m4a": {
        "text_native": (
            "Ben，Warm Taipei 主臥冷氣在漏水，"
            "水滴到插座旁邊，客人在生氣，要找誰？"
        ),
        "text_en": (
            "Hi Ben, the AC at Warm Taipei is leaking near the outlet. "
            "Guest is angry. Who do I call?"
        ),
        "language": "zh-TW",
    },
    "haru_lockout_ja.m4a": {
        "text_native": (
            "ベンさん、伊東のゲストが鍵を開けられず外にいます。"
            "早めに到着しました。どうしたらよいですか？"
        ),
        "text_en": (
            "Ben, the guest at Ito Stream House is locked out. "
            "They arrived early. What should I do?"
        ),
        "language": "ja",
    },
    "celine_plumbing_id.m4a": {
        "text_native": (
            "Halo Pak Ben, ada air di dapur villa Bali, "
            "sepertinya ada pipa bocor. Bagaimana?"
        ),
        "text_en": (
            "Hi Ben, there is water in the kitchen at the Bali villa. "
            "Looks like a pipe issue. What should we do?"
        ),
        "language": "id",
    },
}


def _filename(audio_path: str) -> str:
    return audio_path.rsplit("/", 1)[-1]


def transcribe_and_translate(audio_path: str) -> dict[str, Any]:
    """Call Runpod faster-whisper; on failure or timeout, use hardcoded dict.

    Returns: {"text_native": str, "text_en": str, "language": str}
    Raises:  RuntimeError if neither Runpod nor fallback can produce a result.
    """
    runpod_url = os.environ.get("RUNPOD_WHISPER_URL", "")
    runpod_key = os.environ.get("RUNPOD_API_KEY", "")

    if runpod_url and runpod_key:
        try:
            start = time.time()
            with httpx.Client(timeout=10.0) as client:
                response = client.post(
                    runpod_url,
                    headers={"Authorization": f"Bearer {runpod_key}"},
                    json={"input": {"audio_url": audio_path, "translate": True}},
                )
            if response.status_code == 200 and (time.time() - start) < 10:
                data = response.json().get("output", {})
                text = data.get("text", "")
                return {
                    "text_native": text,
                    "text_en": data.get("translation", text),
                    "language": data.get("language", ""),
                }
            print(
                f"[whisper fallback] Runpod returned {response.status_code} "
                f"or timed out; using hardcoded for {_filename(audio_path)}"
            )
        except (httpx.HTTPError, ValueError) as e:
            print(f"[whisper fallback] Runpod failed: {e}")

    fallback = HARDCODED_TRANSCRIPTS.get(_filename(audio_path))
    if fallback is not None:
        return dict(fallback)

    raise RuntimeError(
        f"No transcript for {audio_path} (Runpod unavailable, no fallback)"
    )
