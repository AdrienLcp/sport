#!/usr/bin/env sh
# Builds with the private programme and deploys it to the owner's Netlify site.
#
# Enabled only where a Netlify token is configured, by path, never by value:
# NETLIFY_TOKEN_FILE, or the first line of `netlify-token-path.local` at the
# repository root (git-ignored). Without one, this is a clone that does not
# deploy, and it exits quietly. Once enabled, every failure exits non-zero.

set -e

NETLIFY_SITE=seance-adrien
TOKEN_PATH_FILE=netlify-token-path.local

repo_root=$(git rev-parse --show-toplevel)
cd "$repo_root"

token_file=${NETLIFY_TOKEN_FILE:-}
if [ -z "$token_file" ] && [ -f "$TOKEN_PATH_FILE" ]; then
  token_file=$(head -n 1 "$TOKEN_PATH_FILE" | tr -d '\r')
fi

if [ -z "$token_file" ]; then
  echo "deploy: no Netlify token configured, skipping the personal site"
  exit 0
fi

if [ ! -s "$token_file" ]; then
  echo "deploy: the configured Netlify token file is missing or empty" >&2
  exit 1
fi

build_log=$(mktemp)
validate_status_file=$(mktemp)
{ pnpm validate 2>&1; echo $? > "$validate_status_file"; } | tee "$build_log"
validate_status=$(cat "$validate_status_file")
built_private=false
grep -q "programme: private" "$build_log" && built_private=true
rm -f "$build_log" "$validate_status_file"

if [ "$validate_status" -ne 0 ]; then
  echo "deploy: pnpm validate failed, nothing deployed" >&2
  exit 1
fi

if [ "$built_private" != true ]; then
  echo "deploy: the build did not read the private programme, refusing to deploy it to $NETLIFY_SITE" >&2
  exit 1
fi

# Outside any pnpm workspace: under one, netlify-cli asks which project to deploy
# and dies without a TTY to answer it.
staging=$(mktemp -d)
trap 'rm -rf "$staging" 2>/dev/null || true' EXIT
cp -r dist "$staging/dist"
# Netlify answers a deep link it has no file for with a 404, where Cloudflare
# Pages falls back to the app by itself.
echo '/* /index.html 200' > "$staging/dist/_redirects"

NETLIFY_AUTH_TOKEN=$(tr -d ' \r\n"' < "$token_file")
export NETLIFY_AUTH_TOKEN
(cd "$staging" && npx --yes netlify-cli deploy --prod --dir=dist --site="$NETLIFY_SITE" --no-build)
