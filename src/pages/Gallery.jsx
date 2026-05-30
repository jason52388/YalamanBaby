import { useState } from 'react';

// Load every image dropped into /public/photos automatically.
// Add or remove files there and the gallery updates — no code changes.
const modules = import.meta.glob('/public/photos/*.{jpg,jpeg,png,JPG,JPEG,PNG,webp,gif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const photos = Object.entries(modules)
  .map(([path, url]) => ({ url, name: path.split('/').pop() }))
  .sort((a, b) => a.name.localeCompare(b.name));

export default function Gallery() {
  const [active, setActive] = useState(null);

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
            Drop image files into the <code>public/photos</code> folder and they'll appear
            here automatically. (We can also export them straight from Apple Photos together.)
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
