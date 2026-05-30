import { useEffect, useState } from 'react';
import {
  uid, updateName, deleteName, moveName,
  viewColumn,
} from '../lib/names.js';
import { subscribeNames, saveNames, sharedMode } from '../lib/namesStore.js';
import { lookupMeaning } from '../data/nameMeanings.js';
import { lookupNameAuto } from '../lib/lookupName.js';

const COLUMNS = [
  { gender: 'boy',    title: 'Boys',   emoji: '👦' },
  { gender: 'girl',   title: 'Girls',  emoji: '👧' },
  { gender: 'unisex', title: 'Unisex', emoji: '⭐' },
];

const SORTS = [
  { value: 'rank',   label: 'By rank' },
  { value: 'alpha',  label: 'A → Z' },
  { value: 'newest', label: 'Newest first' },
];

// ─────────────────────────────────────────────────────────────
//  Add-name form (inline at the top of each column)
// ─────────────────────────────────────────────────────────────
function AddForm({ gender, onAdd }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    // Just the name — origin & meaning are pulled automatically.
    onAdd({ name: name.trim(), gender });
    setName('');
    setOpen(false);
  }

  if (!open) {
    return (
      <button className="add-btn" onClick={() => setOpen(true)}>
        + Add a name
      </button>
    );
  }

  return (
    <form className="add-form" onSubmit={submit}>
      <input
        autoFocus
        placeholder="Type a name…"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="form-row">
        <button type="submit" className="btn-primary">Add</button>
        <button type="button" className="btn-link" onClick={() => { setOpen(false); setName(''); }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
//  A single name row (expandable, with inline edit)
// ─────────────────────────────────────────────────────────────
function NameRow({ entry, onUpdate, onDelete, onMoveUp, onMoveDown }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: entry.name,
    origin: entry.origin,
    meaning: entry.meaning,
  });

  function startEdit() {
    setDraft({ name: entry.name, origin: entry.origin, meaning: entry.meaning });
    setEditing(true);
    setOpen(true);
  }
  function save() {
    if (!draft.name.trim()) return;
    onUpdate(entry.id, {
      name: draft.name.trim(),
      origin: draft.origin.trim(),
      meaning: draft.meaning.trim(),
    });
    setEditing(false);
  }
  function remove() {
    if (confirm(`Remove "${entry.name}"?`)) onDelete(entry.id);
  }

  return (
    <div className={`name-row ${open ? 'open' : ''}`}>
      <button className="name-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="rank">#{entry.rank}</span>
        <span className="name-text">{entry.name}</span>
        <span className="chev" aria-hidden="true">{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div className="name-body">
          {!editing ? (
            <>
              <p className="meaning">
                {entry.pending ? (
                  <em style={{ color: 'var(--ink-soft)' }}>Looking up origin & meaning…</em>
                ) : (
                  <>
                    {entry.origin && <span className="origin">{entry.origin}</span>}
                    {entry.origin && entry.meaning && ' — '}
                    {entry.meaning || (!entry.origin && (
                      <em style={{ color: 'var(--ink-soft)' }}>No description found — click Edit to add one.</em>
                    ))}
                  </>
                )}
              </p>
              <div className="row-actions">
                <button onClick={startEdit} className="btn-link">Edit</button>
                <button onClick={remove} className="btn-link danger">Delete</button>
                <span className="spacer" />
                <button onClick={() => onMoveUp(entry.id)} title="Move up" className="btn-icon">↑</button>
                <button onClick={() => onMoveDown(entry.id)} title="Move down" className="btn-icon">↓</button>
              </div>
            </>
          ) : (
            <div className="edit-form">
              <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Name" />
              <input value={draft.origin} onChange={(e) => setDraft({ ...draft, origin: e.target.value })} placeholder="Origin" />
              <input value={draft.meaning} onChange={(e) => setDraft({ ...draft, meaning: e.target.value })} placeholder="Meaning / notes" />
              <div className="form-row">
                <button onClick={save} className="btn-primary">Save</button>
                <button onClick={() => setEditing(false)} className="btn-link">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  One gender column
// ─────────────────────────────────────────────────────────────
function Column({ column, list, sort, setSort, ...handlers }) {
  const rows = viewColumn(list, column.gender, sort);
  return (
    <div className="card name-col">
      <header className="col-head">
        <h3>{column.emoji} {column.title} <span className="count">({rows.length})</span></h3>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort">
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </header>

      <AddForm gender={column.gender} onAdd={handlers.onAdd} />

      {rows.length === 0 ? (
        <p className="empty">No {column.title.toLowerCase()} yet. Add one above!</p>
      ) : (
        <div className="name-list">
          {rows.map((entry) => (
            <NameRow
              key={entry.id}
              entry={entry}
              onUpdate={handlers.onUpdate}
              onDelete={handlers.onDelete}
              onMoveUp={(id) => handlers.onMove(id, -1)}
              onMoveDown={(id) => handlers.onMove(id, +1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────────────────────
export default function Names() {
  const [list, setList] = useState([]);
  const [sort, setSort] = useState({ boy: 'rank', girl: 'rank', unisex: 'rank' });

  // Subscribe to the shared/cloud (or local) store. The cb fires once
  // immediately and again on every remote change — so the page reacts live
  // when the other person edits.
  useEffect(() => {
    const unsub = subscribeNames(setList);
    return unsub;
  }, []);

  // Optimistic-update helper: apply the transform locally for snappy UX,
  // then push to storage. The next snapshot from the store will match what
  // we already have, so no flicker.
  function mutate(fn) {
    setList((current) => {
      const next = fn(current);
      saveNames(next);
      return next;
    });
  }

  // Add a name, then auto-pull its origin/meaning (dictionary first, then a
  // live Wikipedia lookup) and patch it in when it resolves.
  async function onAdd({ name, gender }) {
    const id = uid();
    const dict = lookupMeaning(name);
    const entry = {
      id, name, gender,
      origin: dict?.origin || '',
      meaning: dict?.meaning || '',
      // Mark as still-resolving when we have no instant dictionary hit, so the
      // row can show "Looking up…" instead of "No description".
      pending: !dict,
      addedAt: Date.now(),
    };
    mutate((l) => [...l, entry]);

    if (!dict) {
      let found = null;
      try {
        found = await lookupNameAuto(name);
      } catch { /* ignore */ }
      mutate((l) => updateName(l, id, {
        origin: found?.origin || '',
        meaning: found?.meaning || '',
        pending: false,
      }));
    }
  }

  const handlers = {
    onAdd,
    onUpdate: (id, patch) => mutate((l) => updateName(l, id, patch)),
    onDelete: (id) => mutate((l) => deleteName(l, id)),
    onMove: (id, dir) => mutate((l) => moveName(l, id, dir)),
  };

  return (
    <div className="page">
      <div className="page-head">
        <h1>Baby Names</h1>
        <p>Our running list — add, rank, and click any name to see its origin and meaning.</p>
      </div>

      <div className="name-toolbar">
        <button className="btn-link" onClick={() => exportJson(list)}>⤓ Export list</button>
        <button className="btn-link" onClick={() => fileRef.current?.click()}>⤒ Import / merge</button>
        <input ref={fileRef} type="file" accept="application/json" onChange={handleImport} hidden />
        <span className="hint">
          {sharedMode
            ? '☁️  Synced live — both of you see every change.'
            : '📱 Saved in this browser only. Add your Firebase config in src/firebase.js to share live with Erika.'}
        </span>
      </div>

      <div className="name-cols">
        {COLUMNS.map((col) => (
          <Column
            key={col.gender}
            column={col}
            list={list}
            sort={sort[col.gender]}
            setSort={(v) => setSort({ ...sort, [col.gender]: v })}
            {...handlers}
          />
        ))}
      </div>
    </div>
  );
}
