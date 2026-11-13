#!/usr/bin/env bash
# Free disk in a settled linked worktree: delete dependencies and build output.
# Never touches a folder that holds tracked files, env files, or local data.
# Refuses to run in the main checkout. Run "Setup Worktree" to reinstall.
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
git_dir="$(git rev-parse --path-format=absolute --git-dir)"
common_dir="$(git rev-parse --path-format=absolute --git-common-dir)"

if [ "$git_dir" = "$common_dir" ]; then
  echo "not a linked worktree, skipping: $root"
  exit 0
fi

cd "$root"
before="$(du -sk . | cut -f1)"

# Dependency and build folders that an install or build recreates.
names=(node_modules .output .nitro .tanstack .vite .next .svelte-kit .astro .turbo
  .source coverage dist .venv __pycache__ .pytest_cache .mypy_cache .ruff_cache)

expr=()
for n in "${names[@]}"; do
  expr+=(-name "$n" -o)
done
unset 'expr[${#expr[@]}-1]'

while IFS= read -r -d '' dir; do
  # Skip anything git tracks, so a committed dist/ is never lost.
  if [ -n "$(git ls-files -- "$dir" | head -1)" ]; then
    echo "kept $dir (tracked files)"
    continue
  fi
  rm -rf "$dir"
done < <(find . -path ./.git -prune -o \( "${expr[@]}" \) -type d -prune -print0)

find . -path ./.git -prune -o -name '*.tsbuildinfo' -type f -print0 | xargs -0 rm -f

after="$(du -sk . | cut -f1)"
echo "freed $(((before - after) / 1024)) MB in $root"
