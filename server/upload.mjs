// ─────────────────────────────────────────────────────────────
//  Tiny, dependency-free photo upload service.
//
//  It lives BEHIND the site's Caddy password gate: the Caddyfile only
//  reverse-proxies /api/* to this server from inside the @authed block, so a
//  request can't reach here without the valid `babyauth` cookie. As
//  defense-in-depth we ALSO verify that cookie here against BABY_AUTH_COOKIE,
//  so the uploader is safe even if it were ever exposed directly.
//
//  Uploads are sent as the raw file body (no multipart) to keep parsing
//  trivial and safe:  fetch('/api/upload?name=foo.jpg', { method:'POST',
//  body: file }).  We ignore the client-supplied name except for sanity,
//  generate our own collision-free filename, and SNIFF MAGIC BYTES rather than
//  trusting the extension or Content-Type. Files land in PHOTOS_DIR, which
//  Caddy serves read-only at /photos/.
// ─────────────────────────────────────────────────────────────

import http from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const PORT = Number(process.env.UPLOAD_PORT || 8080);
const PHOTOS_DIR = process.env.PHOTOS_DIR_INTERNAL || '/srv/photos';
const AUTH_COOKIE = process.env.BABY_AUTH_COOKIE || '';
const MAX_BYTES = Number(process.env.UPLOAD_MAX_BYTES || 20 * 1024 * 1024); // 20 MB

// Sniff the real type from the leading bytes. Returns a safe extension or null.
function sniffExt(buf) {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
  ) return 'png';
  if (buf.length >= 6 && buf.toString('ascii', 0, 4) === 'GIF8') return 'gif';
  if (
    buf.length >= 12 &&
    buf.toString('ascii', 0, 4) === 'RIFF' &&
    buf.toString('ascii', 8, 12) === 'WEBP'
  ) return 'webp';
  return null;
}

// Constant-time cookie check so the proxy gate has a belt-and-suspenders peer.
function hasValidCookie(req) {
  if (!AUTH_COOKIE) return true; // not configured (e.g. local dev) → rely on proxy
  const cookies = req.headers.cookie || '';
  const m = /(?:^|;\s*)babyauth=([^;]+)/.exec(cookies);
  if (!m) return false;
  const got = Buffer.from(m[1]);
  const want = Buffer.from(AUTH_COOKIE);
  return got.length === want.length && timingSafeEqual(got, want);
}

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) });
  res.end(payload);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && url.pathname === '/api/health') {
    return json(res, 200, { ok: true });
  }

  if (req.method !== 'POST' || url.pathname !== '/api/upload') {
    return json(res, 404, { error: 'not found' });
  }

  if (!hasValidCookie(req)) {
    return json(res, 401, { error: 'not authorized' });
  }

  // Collect the raw body with a hard size cap.
  const chunks = [];
  let size = 0;
  let aborted = false;
  req.on('data', (c) => {
    if (aborted) return;
    size += c.length;
    if (size > MAX_BYTES) {
      aborted = true;
      json(res, 413, { error: `file too large (max ${Math.round(MAX_BYTES / 1024 / 1024)} MB)` });
      req.destroy();
      return;
    }
    chunks.push(c);
  });
  req.on('error', () => { if (!aborted) json(res, 400, { error: 'upload failed' }); });
  req.on('end', async () => {
    if (aborted) return;
    const buf = Buffer.concat(chunks);
    if (buf.length === 0) return json(res, 400, { error: 'empty file' });

    const ext = sniffExt(buf);
    if (!ext) {
      return json(res, 415, { error: 'unsupported file type — use JPG, PNG, WebP, or GIF' });
    }

    // Generate our own name: timestamp keeps the Gallery roughly chronological
    // (it sorts by filename), random suffix avoids collisions, and there is no
    // client-controlled path component so traversal is impossible.
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
    const rand = randomBytes(4).toString('hex');
    const filename = `${stamp}-${rand}.${ext}`;
    const dest = path.join(PHOTOS_DIR, filename);

    try {
      await mkdir(PHOTOS_DIR, { recursive: true });
      await writeFile(dest, buf, { flag: 'wx' }); // wx: never clobber
    } catch (err) {
      return json(res, 500, { error: 'could not save file' });
    }
    return json(res, 201, { ok: true, name: filename, url: `/photos/${filename}` });
  });
});

server.listen(PORT, () => {
  console.log(`upload service listening on :${PORT}, saving to ${PHOTOS_DIR}`);
});
