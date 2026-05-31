// Photo storage: Firebase Realtime Database (shared & live) if configured,
// localStorage fallback (per-device) if not. Same pattern as names/plan, but
// each photo lives in its own child node under babyPhotos/items so we never
// have to read or rewrite the whole collection on a single add/delete.
//
// A photo is { dataUrl, name, takenAt, addedAt }. Images are compressed to a
// data URL client-side before storing (see compressImage in the Gallery), so
// uploads work on any host — no upload server required.

import { ref, onValue, push, set, remove } from 'firebase/database';
import { rtdb, isConfigured } from '../firebase.js';

const LS_KEY = 'yalaman-baby-photos-v1';
const PATH = 'babyPhotos/items';

/** Whether shared cloud storage is on. The UI shows a status badge. */
export const sharedMode = isConfigured;

function readLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(list) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('[photos] localStorage save failed:', e);
  }
}

/**
 * Subscribe to the photo collection. `cb(photos)` fires once immediately and
 * again on every remote change. Returns an unsubscribe function.
 */
export function subscribePhotos(cb) {
  if (isConfigured) {
    const node = ref(rtdb(), PATH);
    return onValue(
      node,
      (snap) => {
        const val = snap.val() || {};
        cb(Object.entries(val).map(([id, v]) => ({ id, ...v })));
      },
      (err) => console.error('[photos] Realtime DB subscription error:', err),
    );
  }
  cb(readLocal());
  return () => {};
}

/** Store a photo. Returns the stored record (with its id). */
export async function addPhoto(photo) {
  if (isConfigured) {
    const node = push(ref(rtdb(), PATH));
    await set(node, photo);
    return { id: node.key, ...photo };
  }
  const stored = { id: `l_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, ...photo };
  writeLocal([...readLocal(), stored]);
  return stored;
}

/** Remove a photo by id. */
export async function deletePhoto(id) {
  if (isConfigured) {
    await remove(ref(rtdb(), `${PATH}/${id}`));
    return;
  }
  writeLocal(readLocal().filter((p) => p.id !== id));
}
