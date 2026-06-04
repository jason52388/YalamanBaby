#!/usr/bin/env bash
# Runs ON the VPS, invoked over SSH by .github/workflows/deploy.yml after the
# repo has been pulled to the latest origin/main. Kept in the repo (instead of
# inline in the workflow) so the workflow can call it from each retry attempt
# without duplicating the deploy logic.
#
# Expects these environment variables (forwarded by the SSH action):
#   BABY_AUTH_HASH_B64  base64 of the bcrypt auth hash (no '$', survives transport)
#   BABY_AUTH_COOKIE    random hex cookie secret
#   SITE_HOSTNAME       public hostname
#   BABY_HTTP_PORT      optional, defaults to 8088
#   PHOTOS_DIR          optional, defaults to /srv/yalaman-photos
#
# Must be run from the repo root on the VPS (the workflow cd's there first).

set -euo pipefail

# Decode the bcrypt hash back from base64. Done in a single shell var
# assignment so the '$' characters are never re-expanded.
BABY_AUTH_HASH="$(printf '%s' "${BABY_AUTH_HASH_B64:-}" | base64 -d)"

# Fail loudly if the hash didn't survive transport, instead of deploying a
# Caddy that crash-loops on an empty basic_auth hash.
case "$BABY_AUTH_HASH" in
  '$2'*) : ;;
  *) echo "::error:: decoded BABY_AUTH_HASH is not a bcrypt hash; aborting deploy." >&2; exit 1 ;;
esac

# Export the values so `docker compose` substitutes them via ${...} in
# docker-compose.yml. Compose reads them literally from the process
# environment (no further '$' interpretation), so the hash reaches the
# container — and Caddy's {$BABY_AUTH_HASH} — intact. We deliberately do NOT
# write the hash into .env, because compose re-interprets '$' inside .env values.
export BABY_AUTH_HASH
export BABY_AUTH_COOKIE="${BABY_AUTH_COOKIE:-}"
export PHOTOS_DIR="${PHOTOS_DIR:-/srv/yalaman-photos}"

# Write .env with only the '$'-free values. umask 077 -> chmod 600.
umask 077
cat > .env <<EOF
SITE_HOSTNAME=${SITE_HOSTNAME}
BABY_HTTP_PORT=${BABY_HTTP_PORT:-8088}
EOF

# Make sure the shared proxy network exists (idempotent — no-op if it's already
# there). warren-caddy joins this same network so it can reverse_proxy to
# yalaman-baby:80 by container name.
docker network create proxy-shared 2>/dev/null || true

docker compose up -d --build

# Surface the container state in the deploy log so a crash-looping Caddy is
# visible here instead of as a silent blank page.
sleep 3
docker compose ps
docker compose logs --tail=20 web || true

docker image prune -f
