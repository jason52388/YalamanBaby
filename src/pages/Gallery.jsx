import { useEffect, useState } from 'react';

// Photos are NOT bundled into the build — they're personal and gitignored, and
// the server rebuilds from a clean clone where they don't exist. Instead they
// live in a runtime-mounted folder (see docker-compose `PHOTOS_DIR`) that Caddy
// serves at /photos/ with a browsable JSON listing. We fetch that listing here.
const IMG_RE = /\.(jpe?g|png|webp|gif)$/i;

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/photos/', { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        // Caddy's file_server browse returns { items: [{ name, is_dir, ... }] };
        // tolerate a bare array too.
        const items = Array.isArray(data) ? data : data.items || [];
        const list = items
          .filter((it) => it && !it.is_dir && IMG_RE.test(it.name))
          .map((it) => ({ url: `/photos/${encodeURIComponent(it.name)}`, name: it.name }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setPhotos(list);
      })
      .catch(() => { /* folder not mounted yet — show the empty state */ });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="page">
      <div className="page-head">
        <h1>Our Gallery</h1>
        <p>Moments from our journey together — bumps, scans, and everything in between.</p>
      </div>

      {photos.length === 0 ? (
        <div className="gallery-empty">
          <p style={{ fontSize: '2.5rem', margin: 0 }}>📸</p>
          <h3>No photos yet</h3>
          <p>
            Add image files to the server's photos folder (the <code>PHOTOS_DIR</code>
            volume — see <code>DEPLOY.md</code>) and they'll appear here automatically.
          </p>
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
