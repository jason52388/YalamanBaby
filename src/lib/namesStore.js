// Names storage: Firebase Firestore (shared & live) if configured,
// localStorage fallback (per-device) if not.
//
// Single document: collection "babyNames", document "list" with field
// `items: [...]`. We store the whole list as one document because it's small
// (<100 names) and one round-trip per change is fine for a personal list —
// dramatically simpler than per-name docs.

import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, isConfigured } from '../firebase.js';

const LS_KEY = 'yalaman-baby-names-v1';
const COLLECTION = 'babyNames';
const DOC_ID = 'list';

/** Whether shared cloud storage is on. UI can show a status badge. */
export const sharedMode = isConfigured;

/**
 * Subscribe to the names list. `cb(items)` fires on every remote change.
 * Returns an unsubscribe function.
 */
export function subscribeNames(cb) {
  if (isConfigured) {
    const ref = doc(db(), COLLECTION, DOC_ID);
    return onSnapshot(
      ref,
      (snap) => {
        const data = snap.data();
        cb(Array.isArray(data?.items) ? data.items : []);
      },
      (err) => {
        console.error('[names] Firestore subscription error:', err);
      }
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
    const ref = doc(db(), COLLECTION, DOC_ID);
    await setDoc(ref, { items, updatedAt: Date.now() });
    return;
  }
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('[names] localStorage save failed:', e);
  }
}
