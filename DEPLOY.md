# Deploying to the Hostinger VPS (mirrors the stock-site setup)

Every push to `main` triggers a deploy: GitHub Actions SSHes into the VPS,
pulls the latest code (`git reset --hard origin/main`), writes `.env` from
secrets, and runs `docker compose up -d --build`. The image is built on the
VPS — no container registry. Caddy inside this image serves the static files on
localhost port `8088`; the already-running public Caddy on the VPS owns
80/443, HTTPS, and the `yalamanbaby.com` routing.

This is designed to coexist on the same VPS as the Warren/stock-market site.

## Before you deploy

### 1. Add the baby-site route to the public Caddy

In the Caddyfile for the container that already binds VPS ports 80/443, add:

```caddyfile
yalamanbaby.com {
    redir https://www.yalamanbaby.com{uri} permanent
}

www.yalamanbaby.com {
    reverse_proxy 172.17.0.1:8088
}
```

Then rebuild/restart that public Caddy container. `172.17.0.1` is the default
Docker bridge gateway on Linux; if your VPS uses a different gateway, replace it
with the bridge gateway shown by:

```bash
docker network inspect bridge --format '{{(index .IPAM.Config 0).Gateway}}'
```

### 2. Keep the local port open

This app binds `127.0.0.1:8088` on the VPS. If that port is already taken, set
`BABY_HTTP_PORT` in the VPS `.env` and update the public Caddy `reverse_proxy`
target to match.

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

## SSH authentication failure

If GitHub Actions fails at `appleboy/ssh-action` with:

```text
ssh: handshake failed: ssh: unable to authenticate, attempted methods [none publickey], no supported methods remain
```

the workflow reached the VPS, but the VPS rejected the key for `VPS_USER`.
Check these in order:

1. In this repo's **Settings → Secrets and variables → Actions**, confirm
   `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, and `VPS_PATH` exist. Secrets are
   per-repository unless they were configured at the organization level.
2. `VPS_SSH_KEY` must be the private key, including the full
   `-----BEGIN ... PRIVATE KEY-----` and `-----END ... PRIVATE KEY-----` lines.
   Do not paste the `.pub` file here.
3. The matching public key must be in `/home/<VPS_USER>/.ssh/authorized_keys`
   on the VPS. For `root`, that path is `/root/.ssh/authorized_keys`.
4. Make sure the secret's `VPS_USER` matches the account whose
   `authorized_keys` file contains the public key.
5. If you generated a new key, add only the public half to the VPS:

```bash
cat ~/.ssh/your_deploy_key.pub
```

Copy that one-line output into the server's `authorized_keys`; paste the
private key contents into the GitHub `VPS_SSH_KEY` secret.

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
- **`Caddyfile`** — internal static-file server on port 80; public HTTPS lives
  in the existing VPS Caddy.
- **`docker-compose.yml`** — builds locally on the VPS and binds
  `127.0.0.1:8088:80` (no `version:`, no `env_file:`, no bind mounts).
- **`.github/workflows/deploy.yml`** — the SSH build + deploy pipeline.

## Updating later
Edit and push to `main` (e.g. `src/config.js`). It rebuilds and redeploys.
