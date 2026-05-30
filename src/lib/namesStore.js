// Names storage: Firebase Realtime Database (shared & live) if configured,
// localStorage fallback (per-device) if not.
//
// Stored at path  babyNames/list  as  { items: [...], updatedAt }.
// The whole list lives in one node — it's small (<100 names) and one
// round-trip per change is plenty for a personal list.
//
// Writes go through a server-side transaction (runTransaction) so two people
// editing at the same time merge against the latest value instead of the
// last writer silently clobbering the other's change.

import { ref, onValue, runTransaction } from 'firebase/database';
import { rtdb, isConfigured } from '../firebase.js';

const LS_KEY = 'yalaman-baby-names-v1';
const PATH = 'babyNames/list';

/** Whether shared cloud storage is on. UI shows a status badge. */
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
  cb(readLocal());
  return () => {};
}

/**
 * Atomically transform the stored list. `transform(items) => nextItems` is a
 * pure function applied to the *latest* stored value (re-run by Firebase on
 * conflict), so concurrent edits don't lose data.
 */
export async function mutateNames(transform) {
  if (isConfigured) {
    const node = ref(rtdb(), PATH);
    await runTransaction(node, (current) => {
      const items = Array.isArray(current?.items) ? current.items : [];
      return { items: transform(items), updatedAt: Date.now() };
    });
    return;
  }
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(transform(readLocal())));
  } catch (e) {
    console.error('[names] localStorage save failed:', e);
  }
}
