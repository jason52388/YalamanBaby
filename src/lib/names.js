// Pure helpers for the names list. No storage — storage lives in namesStore.js.
//
// Each name is:
//   { id, name, owner ('erika'|'jason'), origin, meaning, addedAt }
// Order within an owner's list = rank (index 0 is #1).

export function uid() {
  // Prefer a real UUID where available; fall back for very old browsers.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function updateName(list, id, patch) {
  return list.map((n) => (n.id === id ? { ...n, ...patch } : n));
}

export function deleteName(list, id) {
  return list.filter((n) => n.id !== id);
}

/** Move an entry up (-1) or down (+1) within its owner's list. */
export function moveName(list, id, dir) {
  const item = list.find((n) => n.id === id);
  if (!item) return list;
  const sameCol = list.filter((n) => n.owner === item.owner);
  const idx = sameCol.findIndex((n) => n.id === id);
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= sameCol.length) return list;
  const reordered = [...sameCol];
  [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
  const result = [];
  let i = 0;
  for (const n of list) {
    if (n.owner === item.owner) {
      result.push(reordered[i]); i++;
    } else {
      result.push(n);
    }
  }
  return result;
}

/**
 * Drag-and-drop reorder: move `draggedId` to sit immediately before
 * `targetId` within their (shared) list. No-op across different owners.
 */
export function reorderName(list, draggedId, targetId) {
  const dragged = list.find((n) => n.id === draggedId);
  const target = list.find((n) => n.id === targetId);
  if (!dragged || !target || draggedId === targetId) return list;
  if (dragged.owner !== target.owner) return list;

  const col = list.filter((n) => n.owner === dragged.owner);
  const byId = Object.fromEntries(col.map((n) => [n.id, n]));
  const ids = col.map((n) => n.id).filter((id) => id !== draggedId);
  const targetIdx = ids.indexOf(targetId);
  ids.splice(targetIdx, 0, draggedId); // insert before the target
  const reordered = ids.map((id) => byId[id]);

  const result = [];
  let i = 0;
  for (const n of list) {
    if (n.owner === dragged.owner) { result.push(reordered[i]); i++; }
    else result.push(n);
  }
  return result;
}

/**
 * Returns rows for a given owner, sorted by `mode`. Always tags each row
 * with a 1-based `rank` reflecting MANUAL order (so the badge stays stable
 * even when sorted A→Z).
 */
export function viewColumn(list, owner, mode = 'rank') {
  const col = list.filter((n) => n.owner === owner);
  const ranked = col.map((n, i) => ({ ...n, rank: i + 1 }));
  if (mode === 'alpha') return [...ranked].sort((a, b) => a.name.localeCompare(b.name));
  if (mode === 'newest') return [...ranked].sort((a, b) => b.addedAt - a.addedAt);
  return ranked;
}

/**
 * Suggest the names that appear on BOTH owners' lists, ranked by how highly
 * each person placed them. Returns rows of:
 *   { key, name, display, ranks: { [owner]: rank }, score }
 * sorted by combined score (lower = both ranked it higher). Matching is
 * case-insensitive on the trimmed name.
 */
export function sharedSuggestions(list, ownerA, ownerB) {
  const rankMap = (owner) => {
    const m = new Map();
    viewColumn(list, owner, 'rank').forEach((n) => {
      const key = n.name.trim().toLowerCase();
      // Keep the highest (lowest-numbered) rank if a name is duplicated.
      if (!m.has(key) || n.rank < m.get(key).rank) m.set(key, n);
    });
    return m;
  };

  const a = rankMap(ownerA);
  const b = rankMap(ownerB);

  const shared = [];
  for (const [key, entryA] of a) {
    const entryB = b.get(key);
    if (!entryB) continue;
    shared.push({
      key,
      name: entryA.name,
      ranks: { [ownerA]: entryA.rank, [ownerB]: entryB.rank },
      score: entryA.rank + entryB.rank,
      best: Math.min(entryA.rank, entryB.rank),
    });
  }

  shared.sort((x, y) => x.score - y.score || x.best - y.best || x.name.localeCompare(y.name));
  return shared;
}
