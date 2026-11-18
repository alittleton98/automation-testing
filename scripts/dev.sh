#!/usr/bin/env bash
# Runs the api (3001) and the web (3000) in watch mode.
set -euo pipefail
cd "$(dirname "$0")/.."
[ -d node_modules ] || pnpm install
export API_URL="${API_URL:-http://localhost:3001}"
pnpm dev
