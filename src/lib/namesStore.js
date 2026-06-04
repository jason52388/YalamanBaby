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

/**
 * Normalize stored items to the current shape: each name belongs to an
 * `owner` ('erika' | 'jason'). Older entries used a `gender` field and had no
 * owner — those were the single shared girls list, so they migrate to Erika.
 * Applied on every read and write, so the migration persists on first edit.
 */
function normalizeItems(items) {
  if (!Array.isArray(items)) return [];
  return items.map((n) => {
    const owner = n.owner === 'jason' ? 'jason' : 'erika';
    const out = { ...n, owner };
    delete out.gender; // drop the legacy field once migrated
    return out;
  });
}

function readLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return normalizeItems(parsed);
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
        cb(normalizeItems(data?.items));
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
      const items = normalizeItems(current?.items);
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
