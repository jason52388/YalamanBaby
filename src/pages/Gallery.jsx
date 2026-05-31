import { useCallback, useEffect, useRef, useState } from 'react';

// Photos are NOT bundled into the build — they're personal and gitignored, and
// the server rebuilds from a clean clone where they don't exist. Instead they
// live in a runtime-mounted folder (see docker-compose `PHOTOS_DIR`) that Caddy
// serves at /photos/ with a browsable JSON listing. We fetch that listing here.
//
// New photos are added via the Upload button, which POSTs the raw file to the
// gated /api/upload service (see server/upload.mjs). Both run behind the site's
// password gate, so only logged-in visitors can view or add photos.
const IMG_RE = /\.(jpe?g|png|webp|gif)$/i;

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [active, setActive] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileInput = useRef(null);

  const loadPhotos = useCallback(async () => {
    try {
      const r = await fetch('/photos/', { headers: { Accept: 'application/json' } });
      if (!r.ok) return;
      const data = await r.json();
      // Caddy's file_server browse returns { items: [{ name, is_dir, ... }] };
      // tolerate a bare array too.
      const items = Array.isArray(data) ? data : data.items || [];
      const list = items
        .filter((it) => it && !it.is_dir && IMG_RE.test(it.name))
        .map((it) => ({ url: `/photos/${encodeURIComponent(it.name)}`, name: it.name }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setPhotos(list);
    } catch {
      /* folder not mounted yet — show the empty state */
    }
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  async function uploadFiles(files) {
    if (!files || files.length === 0) return;
    setError('');
    setBusy(true);
    const failures = [];
    for (const file of files) {
      try {
        const res = await fetch(`/api/upload?name=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body: file,
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          failures.push(`${file.name}: ${body.error || res.statusText}`);
        }
      } catch {
        failures.push(`${file.name}: upload failed`);
      }
    }
    setBusy(false);
    if (failures.length) setError(failures.join(' · '));
    await loadPhotos();
  }

  function onPick(e) {
    const files = Array.from(e.target.files || []);
    uploadFiles(files);
    e.target.value = ''; // allow re-selecting the same file
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Our Gallery</h1>
        <p>Moments from our journey together — bumps, scans, and everything in between.</p>
      </div>

      <div className="gallery-actions">
        {/* accept + capture let phones offer the camera or photo library directly */}
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          style={{ display: 'none' }}
          onChange={onPick}
        />
        <button
          type="button"
          className="upload-btn"
          disabled={busy}
          onClick={() => fileInput.current?.click()}
        >
          {busy ? 'Uploading…' : '＋ Add photos'}
        </button>
      </div>

      {error && <p className="gallery-error">{error}</p>}

      {photos.length === 0 ? (
        <div className="gallery-empty">
          <p style={{ fontSize: '2.5rem', margin: 0 }}>📸</p>
          <h3>No photos yet</h3>
          <p>Tap <strong>Add photos</strong> above to upload from your phone or computer.</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {photos.map((p) => (
            <img
              key={p.url}
              src={p.url}
              alt={p.name}
              loading="lazy"
              onClick={() => setActive(p.url)}
            />
          ))}
        </div>
      )}

      {active && (
        <div className="lightbox" onClick={() => setActive(null)}>
          <button className="close" aria-label="Close" onClick={() => setActive(null)}>×</button>
          <img src={active} alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
