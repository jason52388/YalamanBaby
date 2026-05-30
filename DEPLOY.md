# Deploying to the Hostinger VPS (mirrors the stock-site setup)

Every push to `main` triggers a deploy: GitHub Actions SSHes into the VPS,
pulls the latest code (`git reset --hard origin/main`), writes `.env` from
secrets, and runs `docker compose up -d --build`. The image is built on the
VPS — no container registry. Caddy (inside the image) serves the site and
auto-provisions Let's Encrypt HTTPS.

This is the same pattern as the Warren/stock-market site.

## ⚠️ Before you deploy — two things to set

### 1. Edit the hostname in `Caddyfile`
Replace `ourbabydomain.com` / `www.ourbabydomain.com` (both lines) with your
real domain. It's hardcoded on purpose (an empty env var would crash Caddy).

### 2. Port 80/443 must be free on the VPS
This container binds **80 and 443** directly and runs its own HTTPS — exactly
like the stock site. **Only one container can own those ports per VPS.** So:
- **Different VPS from the stock site:** ✅ works as-is.
- **Same VPS as the stock site:** ❌ collision — the stock site's Caddy already
  owns 80/443. In that case don't use this compose; instead serve the baby
  domain from the existing Caddy (add a site block + mount the built files), or
  switch both to a shared reverse proxy. Ask and we'll set that up.

## One-time setup

### Secrets (repo → Settings → Secrets and variables → Actions)
| Secret name    | Value                                                  |
|----------------|--------------------------------------------------------|
| `VPS_HOST`     | VPS IP address                                         |
| `VPS_USER`     | SSH user (e.g. `root`)                                 |
| `VPS_SSH_KEY`  | The **private** SSH key authorized on the VPS          |
| `VPS_PATH`     | Where to clone on the VPS (e.g. `/root/yalaman-baby`)  |
| `SITE_HOSTNAME`| Your domain (e.g. `www.ourbabydomain.com`)             |

> These mirror the stock site's connection secrets. You can reuse the same
> `VPS_SSH_KEY` if it's the same server account.

### DNS
Point both records at the VPS IP:

| Type | Name  | Value       |
|------|-------|-------------|
| A    | `@`   | your VPS IP |
| A    | `www` | your VPS IP |

### Deploy
Push to `main`, or **Actions → Deploy to Hostinger VPS → Run workflow**.

## Files
- **`Dockerfile`** — multi-stage: Node builds the site, Caddy serves it. The
  Caddyfile and built site are **baked into the image** (not bind-mounted),
  matching the stock-site approach for Hostinger compatibility.
- **`Caddyfile`** — hardcoded hostnames, apex→www redirect, auto-HTTPS.
- **`docker-compose.yml`** — builds locally on the VPS, binds 80/443, named
  volumes for certs (no `version:`, no `env_file:`, no bind mounts).
- **`.github/workflows/deploy.yml`** — the SSH build + deploy pipeline.

## Updating later
Edit and push to `main` (e.g. `src/config.js`). It rebuilds and redeploys.
