Photos are NOT served from this folder anymore.

Because the server rebuilds from a clean git clone (where these gitignored
photos don't exist), the Gallery now loads photos from a runtime-mounted folder
on the VPS instead — the PHOTOS_DIR volume (default /srv/yalaman-photos),
served by Caddy at /photos/.

To add photos: drop .jpg/.jpeg/.png/.webp/.gif files into that folder on the
server. They appear on the Gallery page automatically, sorted by filename
(e.g. 01-scan.jpg, 02-bump.jpg). See DEPLOY.md → "Gallery photos".
