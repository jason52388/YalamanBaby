// Pure helpers for the names list. No storage — storage lives in namesStore.js.
//
// Each name is:
//   { id, name, gender ('boy'|'girl'|'unisex'), origin, meaning, addedAt }
// Order within a gender column = rank (index 0 is #1).

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

/** Move an entry up (-1) or down (+1) within its gender column. */
export function moveName(list, id, dir) {
  const item = list.find((n) => n.id === id);
  if (!item) return list;
  const sameCol = list.filter((n) => n.gender === item.gender);
  const idx = sameCol.findIndex((n) => n.id === id);
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= sameCol.length) return list;
  const reordered = [...sameCol];
  [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
  const result = [];
  let i = 0;
  for (const n of list) {
    if (n.gender === item.gender) {
      result.push(reordered[i]); i++;
    } else {
      result.push(n);
    }
  }
  return result;
}

/**
 * Returns rows for a given gender, sorted by `mode`. Always tags each row
 * with a 1-based `rank` reflecting MANUAL order (so the badge stays stable
 * even when sorted A→Z).
 */
export function viewColumn(list, gender, mode = 'rank') {
  const col = list.filter((n) => n.gender === gender);
  const ranked = col.map((n, i) => ({ ...n, rank: i + 1 }));
  if (mode === 'alpha') return [...ranked].sort((a, b) => a.name.localeCompare(b.name));
  if (mode === 'newest') return [...ranked].sort((a, b) => b.addedAt - a.addedAt);
  return ranked;
}
