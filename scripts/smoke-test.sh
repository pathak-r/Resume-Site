#!/usr/bin/env bash
# Smoke tests after Railway deploy. Usage:
#   RESUME_URL=https://resume-site.up.railway.app GEO_URL=https://geo-rag.up.railway.app ./scripts/smoke-test.sh
set -euo pipefail

RESUME_URL="${RESUME_URL:?Set RESUME_URL (resume-site public URL, no trailing slash)}"
GEO_URL="${GEO_URL:?Set GEO_URL (geo-rag public URL, no trailing slash)}"

fail=0
check() {
  local name="$1" url="$2" expect="$3"
  echo "→ $name: $url"
  body="$(curl -sfS --max-time 60 "$url" 2>/dev/null)" || { echo "  FAIL (request)"; fail=1; return; }
  if echo "$body" | grep -q "$expect"; then
    echo "  OK"
  else
    echo "  FAIL (expected substring: $expect)"
    echo "  body: ${body:0:200}"
    fail=1
  fi
}

check "Resume home" "$RESUME_URL/" "Rohit Pathak"
# SPA route: initial HTML is the shell; client renders Geo-Agentic after load
check "Geo demo page" "$RESUME_URL/geo-agentic-int" 'id="root"'
check "Geo health (direct)" "$GEO_URL/api/health" '"ok":true'
check "Geo health (proxied)" "$RESUME_URL/api/geo/health" '"ok":true'

if [[ "$fail" -ne 0 ]]; then
  echo ""
  echo "Some checks failed. If proxied health fails, verify GEO_RAG_API_URL on resume-site."
  exit 1
fi
echo ""
echo "All smoke checks passed."
