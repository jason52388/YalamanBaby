// Pure helpers for the names list. No storage — storage lives in namesStore.js.
//
// Each name is:
//   { id, name, gender ('boy'|'girl'|'unisex'), origin, meaning, addedAt }
// Order within a gender column = rank (index 0 is #1).

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function addName(list, { name, gender, origin = '', meaning = '' }) {
  return [...list, {
    id: uid(),
    name: name.trim(),
    gender,
    origin: origin.trim(),
    meaning: meaning.trim(),
    addedAt: Date.now(),
  }];
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

export function exportJson(list) {
  const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `baby-names-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function mergeImport(current, incoming) {
  if (!Array.isArray(incoming)) return current;
  const key = (n) => `${n.gender}::${n.name.trim().toLowerCase()}`;
  const seen = new Set(current.map(key));
  const additions = incoming
    .filter((n) => n && n.name && n.gender)
    .filter((n) => !seen.has(key(n)))
    .map((n) => ({
      id: uid(),
      name: String(n.name).trim(),
      gender: ['boy', 'girl', 'unisex'].includes(n.gender) ? n.gender : 'unisex',
      origin: String(n.origin || '').trim(),
      meaning: String(n.meaning || '').trim(),
      addedAt: Number(n.addedAt) || Date.now(),
    }));
  return [...current, ...additions];
}
