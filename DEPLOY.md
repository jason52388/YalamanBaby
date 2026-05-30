# Deploying to your Hostinger VPS (automatic via GitHub Actions)

Every push to `main` builds the site and deploys it to your VPS automatically.
The workflow also installs and configures the **Caddy** web server on the first
run (Caddy gives you free automatic HTTPS).

## One-time setup

### 1. Add these secrets in GitHub
Go to your repo → **Settings** → **Secrets and variables** → **Actions** →
**New repository secret**, and add each of these:

| Secret name    | Value                                              | Required |
|----------------|----------------------------------------------------|----------|
| `VPS_HOST`     | Your VPS IP address (e.g. `123.45.67.89`)          | ✅ |
| `VPS_USERNAME` | SSH login user — usually `root`                    | ✅ |
| `VPS_PASSWORD` | The SSH/root password for the VPS                  | ✅ |
| `SITE_DOMAIN`  | The domain to serve at (e.g. `ouryalamanbaby.com`) | ✅ |
| `VPS_PORT`     | SSH port — only if not the default `22`            | optional |

> Find the IP, root user, and password in Hostinger: **hPanel → VPS → your
> server**. Use the "Root password" you set when creating the VPS (you can
> reset it there if you've forgotten it).

### 2. Point your domain at the VPS (DNS)
GitHub can't do this part — it's done at your domain. In Hostinger:
**hPanel → Domains → (your domain) → DNS / Nameservers → DNS records**, and add:

| Type | Name | Points to / Value | TTL  |
|------|------|-------------------|------|
| A    | `@`  | your VPS IP       | auto |
| A    | `www`| your VPS IP       | auto |

DNS can take anywhere from a few minutes to a few hours to take effect.

### 3. Run the deploy
Either push any change to `main`, or go to the **Actions** tab → **Deploy to
VPS** → **Run workflow**. Watch it go green, then visit `https://yourdomain`.

The first visit may take a few extra seconds while Caddy fetches the HTTPS
certificate. After that it's instant.

## Updating the site later
Just edit and push to `main` (e.g. change `src/config.js`). It redeploys
automatically. Photos: see the note in `public/photos/` — adding photos
requires a rebuild, which a push triggers.

## Troubleshooting
- **Action fails at "Provision web server":** double-check `VPS_HOST`,
  `VPS_USERNAME`, and `VPS_PASSWORD`. If your VPS blocks root password login,
  switch to an SSH key (ask and we'll set that up).
- **Site loads on http but not https:** make sure the DNS A record points to
  the VPS and has propagated, then re-run the workflow.
- **"Port 80 already in use":** another web server (Apache/nginx) is running.
  We can stop/disable it — let me know.
