#!/usr/bin/env sh
# Deploys the public demo to Cloudflare Pages from a fresh clone of HEAD, so
# the git-ignored private programme can never reach it.

set -e

PAGES_PROJECT=sport

repo_root=$(git rev-parse --show-toplevel)
workdir=$(mktemp -d)
trap 'cd / && rm -rf "$workdir"' EXIT

git clone --quiet "$repo_root" "$workdir/app"
cd "$workdir/app"
pnpm install --frozen-lockfile --ignore-scripts
build_log=$(pnpm build 2>&1) || { echo "$build_log"; exit 1; }
echo "$build_log" | grep -q 'programme: public' || { echo 'Refusing to deploy: the build did not use the public programme.'; exit 1; }
npx --yes wrangler@4 pages deploy dist --project-name "$PAGES_PROJECT" --branch main --commit-dirty=true
