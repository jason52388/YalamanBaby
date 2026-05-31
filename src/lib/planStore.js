// Plan storage: Firebase Realtime Database (shared & live) if configured,
// localStorage fallback (per-device) if not. Mirrors namesStore.js.
//
// Stored at path  babyPlan/state  as:
//   {
//     checks: { [itemId]: true },          // which items are ticked off
//     custom: { [week]: [ {id,text,audience,addedAt} ] },  // your own items
//     updatedAt
//   }
//
// `checks` is keyed by item id so it works the same for built-in items
// (ids like "w12-todo-0") and custom items (their own uid). Writes go
// through a server-side transaction so two people editing at once merge
// instead of clobbering each other.

import { ref, onValue, runTransaction } from 'firebase/database';
import { rtdb, isConfigured } from '../firebase.js';

const LS_KEY = 'yalaman-baby-plan-v1';
const PATH = 'babyPlan/state';

/** Whether shared cloud storage is on. The UI shows a status badge. */
export const sharedMode = isConfigured;

const EMPTY = { checks: {}, custom: {} };

function normalize(state) {
  return {
    checks: state && typeof state.checks === 'object' && state.checks ? state.checks : {},
    custom: state && typeof state.custom === 'object' && state.custom ? state.custom : {},
  };
}

function readLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? normalize(JSON.parse(raw)) : { ...EMPTY };
  } catch {
    return { ...EMPTY };
  }
}

/**
 * Subscribe to the plan state. `cb(state)` fires once immediately and again
 * on every remote change. Returns an unsubscribe function.
 */
export function subscribePlan(cb) {
  if (isConfigured) {
    const node = ref(rtdb(), PATH);
    return onValue(
      node,
      (snap) => cb(normalize(snap.val())),
      (err) => console.error('[plan] Realtime DB subscription error:', err),
    );
  }
  cb(readLocal());
  return () => {};
}

/**
 * Atomically transform the stored state. `transform(state) => nextState` is a
 * pure function applied to the *latest* stored value (re-run by Firebase on
 * conflict), so concurrent edits don't lose data.
 */
export async function mutatePlan(transform) {
  if (isConfigured) {
    const node = ref(rtdb(), PATH);
    await runTransaction(node, (current) => ({
      ...transform(normalize(current)),
      updatedAt: Date.now(),
    }));
    return;
  }
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(transform(readLocal())));
  } catch (e) {
    console.error('[plan] localStorage save failed:', e);
  }
}

// ── Pure transforms (exported so they're easy to test/compose) ──

export function toggleCheck(state, id) {
  const checks = { ...state.checks };
  if (checks[id]) delete checks[id];
  else checks[id] = true;
  return { ...state, checks };
}

export function addCustom(state, week, item) {
  const list = Array.isArray(state.custom[week]) ? state.custom[week] : [];
  return { ...state, custom: { ...state.custom, [week]: [...list, item] } };
}

export function editCustom(state, week, id, text) {
  const list = Array.isArray(state.custom[week]) ? state.custom[week] : [];
  return {
    ...state,
    custom: {
      ...state.custom,
      [week]: list.map((it) => (it.id === id ? { ...it, text } : it)),
    },
  };
}

export function removeCustom(state, week, id) {
  const list = Array.isArray(state.custom[week]) ? state.custom[week] : [];
  const checks = { ...state.checks };
  delete checks[id];
  return {
    ...state,
    checks,
    custom: { ...state.custom, [week]: list.filter((it) => it.id !== id) },
  };
}

export function customForWeek(state, week) {
  return Array.isArray(state.custom?.[week]) ? state.custom[week] : [];
}

let _seq = 0;
export function uid() {
  _seq += 1;
  return `c_${Date.now().toString(36)}_${_seq.toString(36)}`;
}
