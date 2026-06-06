#!/usr/bin/env bash
# Pull-based deploy. Runs ON the VPS (via the systemd timer in deploy/), polling
# origin/main and redeploying when it moves. This is the deploy path that never
# depends on a GitHub runner reaching port 22 — the VPS reaches OUT to GitHub
# over HTTPS instead, so the intermittent inbound-SSH source-IP block that makes
# the Actions deploy flaky simply can't happen here. See deploy/AUTODEPLOY.md.
#
# It reuses scripts/deploy-remote.sh for the actual build/restart, so there is
# exactly one source of truth for how the app is deployed.
#
# Usage:
#   vps-autodeploy.sh            # deploy only if origin/main moved
#   vps-autodeploy.sh --force    # deploy even if the SHA is unchanged
#
# Configuration (all optional, via the secrets env file or the environment):
#   AUTODEPLOY_ENV_FILE  path to the secrets file        (default /etc/yalaman/deploy.env)
#   REPO_DIR             repo checkout on the VPS         (default: this repo's root)
#   BRANCH               branch to track                  (default: main)
#
# The secrets file must define what deploy-remote.sh needs:
#   SITE_HOSTNAME, BABY_HTTP_PORT, BABY_AUTH_HASH_B64, BABY_AUTH_COOKIE, PHOTOS_DIR

set -euo pipefail

log() { printf '%s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"; }

FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1

ENV_FILE="${AUTODEPLOY_ENV_FILE:-/etc/yalaman/deploy.env}"
BRANCH="${BRANCH:-main}"

# Default REPO_DIR to the git root containing this script, so a plain
# `git clone` + symlinked unit works with no extra config.
if [ -z "${REPO_DIR:-}" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  REPO_DIR="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
fi

# Load deploy secrets (kept off git, root-owned chmod 600). deploy-remote.sh
# reads them from the environment.
if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
else
  log "ERROR: secrets file $ENV_FILE not found. See deploy/AUTODEPLOY.md."
  exit 1
fi

cd "$REPO_DIR"

# Fetch quietly; a transient network blip should just mean "try again next
# tick", not a hard failure that trips the systemd unit into a failed state.
if ! git fetch --quiet origin "$BRANCH"; then
  log "git fetch failed (transient?); will retry on the next tick."
  exit 0
fi

LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse "origin/$BRANCH")"

if [ "$LOCAL" = "$REMOTE" ] && [ "$FORCE" -ne 1 ]; then
  # Up to date — nothing to do. Silent on purpose so the journal isn't spammed
  # once a minute; the timer's own logs record that it ran.
  exit 0
fi

log "Deploying $BRANCH: ${LOCAL:0:7} -> ${REMOTE:0:7} (force=$FORCE)"
git reset --hard "origin/$BRANCH"
bash scripts/deploy-remote.sh
log "Deploy complete at ${REMOTE:0:7}."
