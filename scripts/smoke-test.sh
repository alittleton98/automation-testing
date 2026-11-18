#!/usr/bin/env bash
# Checks a running app: the api's health, a note round trip, and the web's pages.
# Used by CI against the docker compose stack, and by hand after `pnpm infra:up`.
#   bash scripts/smoke-test.sh [web-url] [api-url]
set -euo pipefail

WEB_URL="${1:-${WEB_URL:-http://localhost:3000}}"
API_URL="${2:-${API_URL:-http://localhost:3001}}"

wait_for() {
  local url="$1"
  for _ in $(seq 1 30); do
    if curl -fsS "$url" >/dev/null 2>&1; then return 0; fi
    sleep 2
  done
  echo "FAIL: $url never came up" >&2
  exit 1
}

echo "Waiting for $API_URL and $WEB_URL ..."
wait_for "$API_URL/health"
wait_for "$WEB_URL/api/health"

echo "api /health"
curl -fsS "$API_URL/health" | grep -q '"status":"ok"'

echo "api creates a note"
TITLE="smoke-$(date +%s)"
curl -fsS -X POST "$API_URL/api/notes" \
  -H 'Content-Type: application/json' \
  -d "{\"title\":\"$TITLE\"}" | grep -q "$TITLE"

echo "web home page shows the note"
curl -fsS "$WEB_URL/" | grep -q "$TITLE"

echo "Smoke test passed."
