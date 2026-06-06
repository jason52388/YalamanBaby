# Permanent deploy fix: pull-based autodeploy

## Why

The GitHub Actions deploy SSHes **into** the VPS. Intermittently the host's edge
(fail2ban / Hostinger rate-limiting) drops the GitHub runner's connection to
port 22 — `dial tcp <host>:22: i/o timeout` — and the deploy goes red. Retrying
from the same runner can't help, because every step in a run shares one source
IP that stays blocked for the ban window.

This autodeploy flips the direction: the **VPS polls GitHub over HTTPS** once a
minute and redeploys itself when `origin/main` moves. Nothing ever has to reach
the VPS on port 22, so the flaky-inbound-SSH failure mode is gone for good. It
reuses `scripts/deploy-remote.sh`, so the build/restart logic stays identical to
what the Actions deploy did.

## One-time setup on the VPS

SSH into the VPS as a user in the `docker` group, then:

```bash
# 1. Clone the repo where the systemd unit expects it.
sudo git clone https://github.com/jason52388/YalamanBaby.git /opt/yalamanbaby

# 2. Create the deploy secrets file (root-owned, 0600). These are the same
#    values the GitHub Actions secrets held. Generate the base64 hash with:
#       printf '%s' '<your-bcrypt-hash>' | base64 -w0
sudo install -d -m 700 /etc/yalaman
sudo tee /etc/yalaman/deploy.env >/dev/null <<'EOF'
SITE_HOSTNAME=your.domain
BABY_HTTP_PORT=8088
BABY_AUTH_HASH_B64=<base64 of the bcrypt hash>
BABY_AUTH_COOKIE=<random hex cookie secret>
PHOTOS_DIR=/srv/yalaman-photos
EOF
sudo chmod 600 /etc/yalaman/deploy.env

# 3. Install the systemd timer + service.
sudo cp /opt/yalamanbaby/deploy/yalaman-autodeploy.service /etc/systemd/system/
sudo cp /opt/yalamanbaby/deploy/yalaman-autodeploy.timer   /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now yalaman-autodeploy.timer

# 4. Force the first deploy now (don't wait for a push) and watch it.
sudo systemctl start yalaman-autodeploy.service
journalctl -u yalaman-autodeploy.service -f
```

If you cloned somewhere other than `/opt/yalamanbaby`, edit the
`WorkingDirectory` and `ExecStart` paths in
`/etc/systemd/system/yalaman-autodeploy.service` to match.

## Verifying

```bash
systemctl list-timers yalaman-autodeploy.timer   # next/last run
journalctl -u yalaman-autodeploy.service --since '1 hour ago'
```

A push to `main` now shows up on the site within ~1 minute, with no GitHub
runner involved.

## Turning off the old SSH deploy

Once the timer is confirmed working, retire the inbound-SSH path so it stops
running (and stops being able to fail). Either delete
`.github/workflows/deploy.yml`, or gate it to manual-only by replacing its
`on:` trigger with just `workflow_dispatch:`. The hardened retry loop is kept in
the meantime as a fallback for anyone who hasn't enabled the timer yet.

## Manual deploy / rollback

```bash
# Redeploy current main right now:
sudo /opt/yalamanbaby/scripts/vps-autodeploy.sh --force

# Roll back to a previous commit:
cd /opt/yalamanbaby && sudo git reset --hard <sha> && sudo bash scripts/deploy-remote.sh
```
