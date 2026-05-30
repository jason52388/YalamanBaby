# Deploying to your Hostinger VPS (Docker, via GitHub Actions)

Every push to `main` builds a **Docker image** of the site, pushes it to
GitHub Container Registry (GHCR), and deploys it on your VPS with
`docker compose`.

This VPS already runs **caddy-docker-proxy**, so the site container serves
plain HTTP on port 80 and joins the shared `caddy` Docker network. Your
existing proxy reads the container's labels, routes your domain to it, and
handles HTTPS — there are no published ports and no port 80/443 collision.

## One-time setup

### 1. Add these secrets in GitHub
Repo → **Settings** → **Secrets and variables** → **Actions** →
**New repository secret**:

| Secret name    | Value                                              | Required |
|----------------|----------------------------------------------------|----------|
| `VPS_HOST`     | Your VPS IP address (e.g. `123.45.67.89`)          | ✅ |
| `VPS_USERNAME` | SSH login user — usually `root`                    | ✅ |
| `VPS_PASSWORD` | The SSH/root password for the VPS                  | ✅ |
| `SITE_DOMAIN`  | The domain to serve at (e.g. `ouryalamanbaby.com`) | ✅ |
| `VPS_PORT`     | SSH port — only if not the default `22`            | optional |

> `GITHUB_TOKEN` is built in — you do **not** add it. It's what lets both the
> Action and your VPS pull the image from GHCR, so there's no separate
> registry login to manage.
>
> Find the IP, user, and password in Hostinger: **hPanel → VPS → your server**
> (you can reset the root password there if needed).

### 2. Point your domain at the VPS (DNS)
Done at your domain, not in GitHub. In Hostinger:
**hPanel → Domains → your domain → DNS records**, add:

| Type | Name  | Points to   |
|------|-------|-------------|
| A    | `@`   | your VPS IP |
| A    | `www` | your VPS IP |

DNS can take minutes to a few hours to take effect. Caddy needs the domain to
resolve to the VPS before it can issue the HTTPS certificate.

### 3. Run the deploy
Push any change to `main`, or go to the **Actions** tab → **Deploy to VPS** →
**Run workflow**. It will build the image, push it, install Docker on the VPS
if needed, and start the container. When it's green, visit `https://yourdomain`.

## How it's wired (the files)
- **`Dockerfile`** — multi-stage: builds the site with Node, then serves it
  from a small Caddy image over plain HTTP on :80.
- **`Caddyfile`** — serves `/srv` on `:80` (no TLS; the proxy handles that).
- **`docker-compose.yml`** — runs the image on the external `caddy` network
  with labels (`caddy: <domain>`, `reverse_proxy {{upstreams 80}}`) that
  caddy-docker-proxy uses to route the domain and issue the certificate.
- **`.github/workflows/deploy.yml`** — the build + deploy pipeline.

## Updating the site later
Edit and push to `main` (e.g. change `src/config.js`). It rebuilds the image
and redeploys automatically.

## Troubleshooting
- **Action fails at the deploy step:** check `VPS_HOST` / `VPS_USERNAME` /
  `VPS_PASSWORD`. If the VPS blocks root password login, we can switch to an
  SSH key.
- **Compose error: network "caddy" not found / not external:** the shared
  proxy network is named something else. Run `docker network ls` on the VPS
  and update the network name in the workflow's compose block.
- **Site not loading / 502 from the proxy:** confirm caddy-docker-proxy is
  running and on the `caddy` network, and that DNS for your domain points at
  the VPS. The proxy issues the cert once DNS resolves.
