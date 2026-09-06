"""Azure OpenAI chat helper with on-disk cache. Never logs the API key."""

from __future__ import annotations

import hashlib
import json
import os
import threading
import time
from pathlib import Path

from dotenv import load_dotenv
from openai import APIStatusError, AzureOpenAI, RateLimitError

from scripts.common import CACHE_DIR, ENV_PATH, ensure_dirs

_CLIENT: AzureOpenAI | None = None
_DEPLOYMENT: str | None = None
_GATE = threading.Lock()
_NEXT_OK = 0.0
# Stay under the deployment RPM (currently 65).
MIN_INTERVAL_SEC = 1.2


def _client() -> tuple[AzureOpenAI, str]:
    global _CLIENT, _DEPLOYMENT
    if _CLIENT is None:
        load_dotenv(ENV_PATH)
        endpoint = os.environ["AZURE_OPENAI_ENDPOINT"].rstrip("/")
        key = os.environ["AZURE_OPENAI_KEY"]
        deployment = os.environ["AZURE_OPENAI_DEPLOYMENT"]
        api_version = os.environ.get("AZURE_OPENAI_API_VERSION", "2024-10-21")
        if not key:
            raise RuntimeError("AZURE_OPENAI_KEY is empty in .env")
        _CLIENT = AzureOpenAI(
            azure_endpoint=endpoint,
            api_key=key,
            api_version=api_version,
        )
        _DEPLOYMENT = deployment
    assert _DEPLOYMENT is not None
    return _CLIENT, _DEPLOYMENT


def _cache_path(namespace: str, payload: dict) -> Path:
    ensure_dirs()
    folder = CACHE_DIR / namespace
    folder.mkdir(parents=True, exist_ok=True)
    digest = hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()
    return folder / f"{digest}.json"


def _wait_for_slot() -> None:
    global _NEXT_OK
    with _GATE:
        now = time.monotonic()
        wait = _NEXT_OK - now
        if wait > 0:
            time.sleep(wait)
        _NEXT_OK = time.monotonic() + MIN_INTERVAL_SEC


def _retry_after(exc: Exception, fallback: float) -> float:
    resp = getattr(exc, "response", None)
    headers = getattr(resp, "headers", None) or {}
    raw = headers.get("retry-after") or headers.get("Retry-After")
    if raw:
        try:
            return min(max(float(raw), 1.0), 60.0)
        except ValueError:
            pass
    return fallback


def cached_chat(
    namespace: str,
    system: str,
    user: str,
    *,
    temperature: float = 0.4,
    max_tokens: int = 220,
    max_retries: int = 12,
) -> str:
    payload = {"system": system, "user": user, "temperature": temperature, "max_tokens": max_tokens}
    path = _cache_path(namespace, payload)
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))["text"]

    client, deployment = _client()
    delay = 3.0
    last_err: Exception | None = None
    for _ in range(max_retries):
        try:
            _wait_for_slot()
            resp = client.chat.completions.create(
                model=deployment,
                temperature=temperature,
                max_tokens=max_tokens,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
            )
            text = (resp.choices[0].message.content or "").strip()
            path.write_text(json.dumps({"text": text}, ensure_ascii=False), encoding="utf-8")
            return text
        except (RateLimitError, APIStatusError) as exc:
            last_err = exc
            status = getattr(exc, "status_code", None)
            if status not in (None, 429, 503, 500) and not isinstance(exc, RateLimitError):
                raise
            time.sleep(_retry_after(exc, delay))
            delay = min(delay * 1.6, 45.0)
    raise RuntimeError(f"Azure OpenAI failed after retries: {last_err}") from last_err
