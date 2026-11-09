#!/usr/bin/env bash
# Renders public/og/<page>.png (1200x630) from scripts/og/template.html with
# agent-browser. Run from the repo root: bash scripts/og/generate.sh
set -euo pipefail

root="$(cd "$(dirname "$0")/../.." && pwd)"
template="file://$root/scripts/og/template.html"
session="og-nik-reader"
mkdir -p "$root/public/og"

ab() { agent-browser --session "$session" "$@"; }
trap 'ab close >/dev/null 2>&1 || true' EXIT

ab set viewport 1200 630 >/dev/null
for page in home tanggal-lahir generator panduan; do
  ab open "$template?page=$page" >/dev/null
  ab wait 600 >/dev/null
  ab screenshot "$root/public/og/$page.png" >/dev/null
  echo "built public/og/$page.png"
done
