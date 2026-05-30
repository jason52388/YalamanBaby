// Names storage: Firebase Realtime Database (shared & live) if configured,
// localStorage fallback (per-device) if not.
//
// Stored at path  babyNames/list  as  { items: [...], updatedAt }.
// The whole list lives in one node — it's small (<100 names) and one
// round-trip per change is plenty for a personal list.

import { ref, onValue, set } from 'firebase/database';
import { rtdb, isConfigured } from '../firebase.js';

const LS_KEY = 'yalaman-baby-names-v1';
const PATH = 'babyNames/list';

/** Whether shared cloud storage is on. UI shows a status badge. */
export const sharedMode = isConfigured;

/**
 * Subscribe to the names list. `cb(items)` fires once immediately and again
 * on every remote change. Returns an unsubscribe function.
 */
export function subscribeNames(cb) {
  if (isConfigured) {
    const node = ref(rtdb(), PATH);
    // onValue returns its own unsubscribe function.
    return onValue(
      node,
      (snap) => {
        const data = snap.val();
        cb(Array.isArray(data?.items) ? data.items : []);
      },
      (err) => console.error('[names] Realtime DB subscription error:', err)
    );
  }
  // Fallback: read once from localStorage, no live updates.
  try {
    const raw = localStorage.getItem(LS_KEY);
    cb(raw ? JSON.parse(raw) : []);
  } catch {
    cb([]);
  }
  return () => {};
}

/** Persist the names list. */
export async function saveNames(items) {
  if (isConfigured) {
    await set(ref(rtdb(), PATH), { items, updatedAt: Date.now() });
    return;
  }
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('[names] localStorage save failed:', e);
  }
}
