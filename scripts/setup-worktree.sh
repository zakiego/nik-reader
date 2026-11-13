#!/usr/bin/env bash
# Prepare a fresh git worktree for development.
# T3 runs it in the worktree on create (see t3.json); it also works by hand.
set -euo pipefail

# Queue behind any other install or build on this machine (shared with Claude's
# heavy-guard hook), so many worktrees created at once install one at a time.
# No-op when the helper isn't installed or the lock is already held.
heavy_lock="$HOME/.claude/hooks/heavy-lock.sh"
if [ -f "$heavy_lock" ]; then
  # shellcheck source=/dev/null
  . "$heavy_lock" 1800 "t3 setup $(basename "$PWD")"
fi

root="$(git rev-parse --show-toplevel)"
# T3 sets T3CODE_PROJECT_ROOT to the main checkout; fall back to git outside T3.
main_root="${T3CODE_PROJECT_ROOT:-$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")}"
cd "$root"

# Copy gitignored local env and secret files from the main checkout, if missing here.
if [ "$main_root" != "$root" ] && [ -d "$main_root" ]; then
  while IFS= read -r file; do
    rel="${file#"$main_root"/}"
    if [ ! -e "$root/$rel" ]; then
      mkdir -p "$(dirname "$root/$rel")"
      cp "$file" "$root/$rel"
      echo "copied $rel"
    fi
  done < <(find "$main_root" \( -name node_modules -o -name .git -o -name .venv \) -prune -o \
    -type f \( -name '.env*' -o -name '.dev.vars*' \) -print)
fi

# Install dependencies with whatever the lockfile says. CI=true and a closed
# stdin keep installers from waiting on a prompt nobody can answer.
export CI=true
if [ -f pnpm-lock.yaml ]; then
  pnpm install --frozen-lockfile --prefer-offline < /dev/null
elif [ -f bun.lock ] || [ -f bun.lockb ]; then
  bun install --frozen-lockfile < /dev/null
elif [ -f yarn.lock ]; then
  yarn install --immutable < /dev/null
elif [ -f package-lock.json ]; then
  npm ci --prefer-offline < /dev/null
fi
if [ -f uv.lock ]; then
  uv sync --frozen < /dev/null
fi
