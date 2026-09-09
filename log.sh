#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$REPO_DIR/data/cloud-log.json"
TODAY=$(date +%F)
NOTE="${1:-}"

if ! command -v jq &> /dev/null; then
  echo "jq is required. Install it with: sudo apt-get install jq"
  exit 1
fi

if [ -z "$NOTE" ]; then
  echo "Usage: ./log.sh \"short note about what you did\""
  exit 1
fi

if [ ! -f "$LOG_FILE" ]; then
  echo "[]" > "$LOG_FILE"
fi

EXISTING=$(jq --arg d "$TODAY" '[.[] | select(.date == $d)] | length' "$LOG_FILE")

if [ "$EXISTING" -gt 0 ]; then
  jq --arg d "$TODAY" --arg n "$NOTE" \
    '(.[] | select(.date == $d)) |= (.count += 1 | .note += (" · " + $n))' \
    "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
  echo "Updated $TODAY (count incremented)."
else
  jq --arg d "$TODAY" --arg n "$NOTE" \
    '. += [{"date": $d, "count": 1, "note": $n}]' \
    "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
  echo "Added new entry for $TODAY."
fi

cd "$REPO_DIR"
git add data/cloud-log.json
git commit -m "log: $TODAY - $NOTE"
git push origin main

echo "Pushed. Pipeline will redeploy shortly."
