import { useEffect, useRef, useState } from 'react';
import {
  subscribePhotos,
  addPhoto,
  deletePhoto,
  sharedMode,
} from '../lib/photoStore.js';
import { exifDateFromArrayBuffer } from '../lib/exifDate.js';

// Photos are stored in Firebase (shared & live) or this browser as a fallback.
// Each upload is resized/compressed to a data URL so it works on any host
// without an upload server, and sorted by the date the photo was taken.
const MAX_DIM = 1600; // longest edge, in px
const JPEG_QUALITY = 0.82;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('could not read image'));
    img.src = src;
  });
}

// Draw the image onto a canvas scaled down to MAX_DIM and export a JPEG data
// URL — keeps stored photos small enough for the database while staying sharp.
async function compressImage(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Group photos into month sections, oldest first, so the page reads like a
// timeline of the journey.
function groupByMonth(photos) {
  const sorted = [...photos].sort(
    (a, b) => (a.takenAt || a.addedAt || 0) - (b.takenAt || b.addedAt || 0),
  );
  const groups = [];
  let current = null;
  for (const p of sorted) {
    const d = new Date(p.takenAt || p.addedAt || 0);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!current || current.key !== key) {
      current = {
        key,
        label: d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
        items: [],
      };
      groups.push(current);
    }
    current.items.push(p);
  }
  return groups;
}

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [active, setActive] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileInput = useRef(null);

  useEffect(() => subscribePhotos(setPhotos), []);

  async function uploadFiles(files) {
    if (!files || files.length === 0) return;
    setError('');
    setBusy(true);
    const failures = [];
    for (const file of files) {
      try {
        // Prefer the real capture date from EXIF; fall back to the file date.
        let takenAt = file.lastModified || Date.now();
        try {
          const exif = exifDateFromArrayBuffer(await file.arrayBuffer());
          if (exif) takenAt = exif;
        } catch {
          /* keep the fallback date */
        }
        const dataUrl = await compressImage(file);
        const stored = await addPhoto({
          dataUrl,
          name: file.name,
          takenAt,
          addedAt: Date.now(),
        });
        // In local-only mode there's no live subscription, so update directly.
        if (!sharedMode) setPhotos((prev) => [...prev, stored]);
      } catch (e) {
        failures.push(`${file.name}: ${e.message || 'upload failed'}`);
      }
    }
    setBusy(false);
    if (failures.length) setError(failures.join(' · '));
  }

  function onPick(e) {
    uploadFiles(Array.from(e.target.files || []));
    e.target.value = ''; // allow re-selecting the same file
  }

  async function remove(photo) {
    if (!confirm('Remove this photo?')) return;
    setActive(null);
    if (!sharedMode) setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    try {
      await deletePhoto(photo.id);
    } catch {
      setError('Could not delete that photo.');
    }
  }

  const groups = groupByMonth(photos);

  return (
    <div className="page">
      <div className="page-head">
        <h1>Our Gallery</h1>
        <p>Moments from our journey together — bumps, scans, and everything in between, in order.</p>
      </div>

      <div className="gallery-actions">
        <span className="plan-sync">
          {sharedMode
            ? '☁️ Synced live — you both see every photo.'
            : '📱 Saved in this browser only. Add Firebase config in src/firebase.js to share with Erika.'}
        </span>
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
        groups.map((group) => (
          <section key={group.key} className="gallery-section">
            <h2 className="gallery-month">{group.label}</h2>
            <div className="gallery-grid">
              {group.items.map((p) => (
                <img
                  key={p.id}
                  src={p.dataUrl}
                  alt={p.name || ''}
                  loading="lazy"
                  onClick={() => setActive(p)}
                />
              ))}
            </div>
          </section>
        ))
      )}

      {active && (
        <div className="lightbox" onClick={() => setActive(null)}>
          <button className="close" aria-label="Close" onClick={() => setActive(null)}>×</button>
          <img src={active.dataUrl} alt={active.name || ''} onClick={(e) => e.stopPropagation()} />
          <button
            type="button"
            className="lightbox-delete"
            onClick={(e) => { e.stopPropagation(); remove(active); }}
          >
            🗑 Delete
          </button>
        </div>
      )}
    </div>
  );
}
