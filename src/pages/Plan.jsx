import { useEffect, useMemo, useState } from 'react';
import { config } from '../config.js';
import {
  computeWeek,
  trimesterLabel,
  weekDateRange,
  formatWeekRange,
} from '../lib/pregnancy.js';
import {
  planForWeek,
  trimesterForWeek,
  MIN_WEEK,
  MAX_WEEK,
  ALL_WEEKS,
} from '../data/plan.js';
import {
  subscribePlan,
  mutatePlan,
  toggleCheck,
  addCustom,
  editCustom,
  removeCustom,
  customForWeek,
  uid,
  sharedMode,
} from '../lib/planStore.js';

const clamp = (w) => Math.max(MIN_WEEK, Math.min(w, MAX_WEEK));

// Build the tickable items for a week, splitting built-in + custom items by
// audience. Returns { todos, ptodos, appts } where each entry is
// { id, item:{text,note?}, custom? }.
function buildItems(week, state) {
  const data = planForWeek(week);
  const custom = customForWeek(state, week);
  const youCustom = custom
    .filter((c) => c.audience !== 'partner')
    .map((c) => ({ id: c.id, item: { text: c.text }, custom: c }));
  const partnerCustom = custom
    .filter((c) => c.audience === 'partner')
    .map((c) => ({ id: c.id, item: { text: c.text }, custom: c }));

  return {
    todos: [
      ...data.todos.map((it, i) => ({ id: `w${week}-todo-${i}`, item: it })),
      ...youCustom,
    ],
    ptodos: [
      ...(data.ptodos || []).map((it, i) => ({ id: `w${week}-ptodo-${i}`, item: it })),
      ...partnerCustom,
    ],
    appts: data.appts.map((it, i) => ({ id: `w${week}-appt-${i}`, item: it })),
  };
}

function weekProgress(week, state) {
  const { todos, ptodos, appts } = buildItems(week, state);
  const all = [...todos, ...ptodos, ...appts];
  return { total: all.length, done: all.filter((x) => state.checks[x.id]).length };
}

// ── A single tickable line (built-in or custom; custom ones can be edited) ──
function CheckItem({ entry, week, checked, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(entry.item.text);
  const isCustom = Boolean(entry.custom);

  if (editing) {
    return (
      <li className="plan-check editing">
        <form
          className="edit-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            onEdit(week, entry.id, draft.trim());
            setEditing(false);
          }}
        >
          <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} />
          <div className="form-row">
            <button type="submit" className="btn-primary">Save</button>
            <button
              type="button"
              className="btn-link"
              onClick={() => { setDraft(entry.item.text); setEditing(false); }}
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={`plan-check ${checked ? 'done' : ''}`}>
      <label className="plan-check-main">
        <input type="checkbox" checked={checked} onChange={() => onToggle(entry.id)} />
        <span className="box" aria-hidden="true" />
        <span className="plan-check-text">
          {entry.item.text}
          {isCustom && <span className="plan-mine-tag">yours</span>}
          {entry.item.note && <span className="plan-note">{entry.item.note}</span>}
        </span>
      </label>
      {isCustom && (
        <span className="plan-item-actions">
          <button
            type="button"
            className="btn-icon"
            title="Edit"
            onClick={() => { setDraft(entry.item.text); setEditing(true); }}
          >
            ✎
          </button>
          <button
            type="button"
            className="btn-icon"
            title="Delete"
            onClick={() => onDelete(week, entry.id)}
          >
            ✕
          </button>
        </span>
      )}
    </li>
  );
}

// ── Inline "add your own" form ──
function AddItemForm({ audience, label, onAdd }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  if (!open) {
    return (
      <button type="button" className="add-btn" onClick={() => setOpen(true)}>
        + {label}
      </button>
    );
  }
  return (
    <form
      className="add-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onAdd(text.trim(), audience);
        setText('');
        setOpen(false);
      }}
    >
      <input autoFocus placeholder="Add your own task…" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="form-row">
        <button type="submit" className="btn-primary">Add</button>
        <button type="button" className="btn-link" onClick={() => { setText(''); setOpen(false); }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── A list of CheckItems (shared by the week view and master view) ──
function CheckList({ entries, week, state, handlers }) {
  return (
    <ul className="clean plan-checks">
      {entries.map((entry) => (
        <CheckItem
          key={entry.id}
          entry={entry}
          week={week}
          checked={!!state.checks[entry.id]}
          onToggle={handlers.toggle}
          onEdit={handlers.editItem}
          onDelete={handlers.delItem}
        />
      ))}
    </ul>
  );
}

// ─────────────────────────────────────────────────────────────
//  Full checklist (every week in one scroll), feature #2
// ─────────────────────────────────────────────────────────────
function MasterView({ state, handlers, currentWeek, dueValid }) {
  const [hideDone, setHideDone] = useState(false);

  const totals = useMemo(() => {
    let total = 0;
    let done = 0;
    ALL_WEEKS.forEach((w) => {
      const wp = weekProgress(w, state);
      total += wp.total;
      done += wp.done;
    });
    return { total, done };
  }, [state]);

  const pct = totals.total ? Math.round((totals.done / totals.total) * 100) : 0;

  return (
    <>
      <div className="card plan-focus">
        <div className="plan-focus-head">
          <h2>Full checklist</h2>
          <span className="plan-focus-eyebrow">all 40 weeks</span>
        </div>
        <p style={{ margin: 0 }}>
          Everything across the whole pregnancy in one place. Tick items off here too —
          progress is shared with the week view.
        </p>
        <div className="progress-track" aria-hidden="true" style={{ marginTop: '1.1rem' }}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="filter-bar" style={{ marginTop: '.6rem', marginBottom: 0 }}>
          <small style={{ color: 'var(--ink-soft)' }}>
            {totals.done} of {totals.total} done overall ({pct}%)
          </small>
          <button type="button" className="link-btn" onClick={() => setHideDone((v) => !v)}>
            {hideDone ? 'Show completed too' : 'Show only what’s left'}
          </button>
        </div>
      </div>

      <div className="plan-master">
        {ALL_WEEKS.map((w) => {
          const data = planForWeek(w);
          const { todos, ptodos, appts } = buildItems(w, state);
          let entries = [...todos, ...ptodos, ...appts];
          if (hideDone) entries = entries.filter((e) => !state.checks[e.id]);
          if (entries.length === 0) return null;

          const range = dueValid ? weekDateRange(config.dueDate, w) : null;
          const isNow = w === currentWeek;

          return (
            <section key={w} className={`card plan-week-block ${isNow ? 'is-now' : ''}`}>
              <header className="plan-week-block-head">
                <h3>
                  Week {w}
                  {isNow && <span className="now-tag">now</span>}
                </h3>
                <span className="plan-week-block-meta">
                  {data.focus}
                  {range && <> · {formatWeekRange(range)}</>}
                </span>
              </header>
              <CheckList entries={entries} week={w} state={state} handlers={handlers} />
            </section>
          );
        })}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
//  Single-week view (default), features #1, #3, #5
// ─────────────────────────────────────────────────────────────
function WeekView({ week, state, handlers, currentWeek, nav, dueValid }) {
  const data = planForWeek(week);
  const trimester = trimesterForWeek(week);
  const isCurrent = week === currentWeek;
  const { todos, ptodos, appts } = buildItems(week, state);
  const { total, done } = weekProgress(week, state);
  const pct = total ? Math.round((done / total) * 100) : 0;
  const range = dueValid ? weekDateRange(config.dueDate, week) : null;

  return (
    <>
      {/* Week navigator */}
      <div className="plan-nav">
        <button
          type="button"
          className="btn-icon"
          onClick={() => nav.go(week - 1)}
          disabled={week <= MIN_WEEK}
          aria-label="Previous week"
        >
          ‹
        </button>

        <div className="plan-week-pick">
          <div className="pill">{trimesterLabel(trimester)}</div>
          <label className="plan-week-label">
            Week
            <select value={week} onChange={(e) => nav.go(Number(e.target.value))} aria-label="Jump to week">
              {ALL_WEEKS.map((w) => (
                <option key={w} value={w}>
                  {w}
                  {w === currentWeek ? ' (now)' : ''}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          className="btn-icon"
          onClick={() => nav.go(week + 1)}
          disabled={week >= MAX_WEEK}
          aria-label="Next week"
        >
          ›
        </button>
      </div>

      {!isCurrent && dueValid && (
        <div className="filter-bar" style={{ justifyContent: 'center' }}>
          <span className="pill" style={{ background: 'var(--cream-deep)' }}>Viewing week {week}</span>
          <button type="button" className="link-btn" onClick={nav.toCurrent}>
            Jump to my week ({currentWeek})
          </button>
        </div>
      )}

      <input
        type="range"
        className="plan-range"
        min={MIN_WEEK}
        max={MAX_WEEK}
        value={week}
        onChange={(e) => nav.go(Number(e.target.value))}
        aria-label="Slide to a week"
      />

      {/* Focus header */}
      <div className="card plan-focus">
        <div className="plan-focus-head">
          <h2>
            Week {week}
            {isCurrent && <span className="now-tag">you are here</span>}
          </h2>
          <span className="plan-focus-eyebrow">{data.focus}</span>
          {range && <span className="plan-dates">📅 {formatWeekRange(range)}</span>}
        </div>
        <p style={{ margin: 0 }}>{data.summary}</p>

        {total > 0 && (
          <>
            <div className="progress-track" aria-hidden="true" style={{ marginTop: '1.1rem' }}>
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <small style={{ color: 'var(--ink-soft)' }}>
              {done} of {total} checked off for this week
            </small>
          </>
        )}
      </div>

      <div className="grid grid-2" style={{ marginTop: '1.25rem' }}>
        <section className="card">
          <h3>✅ What to do this week</h3>
          {todos.length > 0 ? (
            <CheckList entries={todos} week={week} state={state} handlers={handlers} />
          ) : (
            <p className="empty">Nothing preset — add your own below.</p>
          )}
          <AddItemForm audience="you" label="Add a task" onAdd={(text) => handlers.addItem(week, text, 'you')} />
        </section>

        <section className="card">
          <h3>👫 For your partner</h3>
          {ptodos.length > 0 ? (
            <CheckList entries={ptodos} week={week} state={state} handlers={handlers} />
          ) : (
            <p className="empty">Nothing preset — add a partner task below.</p>
          )}
          <AddItemForm audience="partner" label="Add a partner task" onAdd={(text) => handlers.addItem(week, text, 'partner')} />
        </section>
      </div>

      {appts.length > 0 && (
        <section className="card" style={{ marginTop: '1.25rem' }}>
          <h3>🩺 Appointments &amp; tests</h3>
          <CheckList entries={appts} week={week} state={state} handlers={handlers} />
        </section>
      )}

      {data.tips.length > 0 && (
        <div className="callout">
          <h3>💡 Advice for week {week}</h3>
          <ul className="clean">
            {data.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────────────────────
export default function Plan() {
  const p = computeWeek(config.dueDate);
  const currentWeek = p.valid ? clamp(p.week || MIN_WEEK) : MIN_WEEK;

  const [week, setWeek] = useState(currentWeek);
  const [touched, setTouched] = useState(false);
  const [view, setView] = useState('week'); // 'week' | 'all'

  // Follow the live current week until the user manually browses elsewhere.
  useEffect(() => {
    if (!touched) setWeek(currentWeek);
  }, [currentWeek, touched]);

  const [state, setState] = useState({ checks: {}, custom: {} });
  useEffect(() => subscribePlan(setState), []);

  // Optimistic update: apply locally for snappy UX, then persist the same
  // pure transform atomically so concurrent edits merge instead of clobber.
  function mutate(fn) {
    setState(fn);
    mutatePlan(fn);
  }

  const handlers = {
    toggle: (id) => mutate((s) => toggleCheck(s, id)),
    addItem: (w, text, audience) =>
      mutate((s) => addCustom(s, w, { id: uid(), text, audience, addedAt: Date.now() })),
    editItem: (w, id, text) => mutate((s) => editCustom(s, w, id, text)),
    delItem: (w, id) => mutate((s) => removeCustom(s, w, id)),
  };

  const nav = {
    go: (w) => { setTouched(true); setWeek(clamp(w)); },
    toCurrent: () => { setTouched(false); setWeek(currentWeek); },
  };

  return (
    <div className="page">
      <div className="page-head">
        <h1>Your Plan</h1>
        <p>
          A week-by-week game plan — what’s happening, what to do, and what to line up
          next. It opens on your current week, and you can add your own to-dos any time.
        </p>
      </div>

      <div className="plan-toolbar">
        <div className="plan-tabs" role="tablist" aria-label="Plan view">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'week'}
            className={`plan-tab ${view === 'week' ? 'active' : ''}`}
            onClick={() => setView('week')}
          >
            This week
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'all'}
            className={`plan-tab ${view === 'all' ? 'active' : ''}`}
            onClick={() => setView('all')}
          >
            Full checklist
          </button>
        </div>
        <span className="plan-sync">
          {sharedMode
            ? '☁️ Synced live — you both share one plan.'
            : '📱 Saved on this device. Add Firebase config in src/firebase.js to sync with Erika.'}
        </span>
      </div>

      {view === 'week' ? (
        <WeekView
          week={week}
          state={state}
          handlers={handlers}
          currentWeek={currentWeek}
          nav={nav}
          dueValid={p.valid}
        />
      ) : (
        <MasterView
          state={state}
          handlers={handlers}
          currentWeek={currentWeek}
          dueValid={p.valid}
        />
      )}

      <p className="disclaimer">
        Based on a typical <strong>US</strong> prenatal schedule and compiled from common
        pregnancy resources — this is general guidance, not medical advice. The timing of
        visits, tests, classes, and vaccines varies by person and pregnancy, so always
        follow your OB/GYN or midwife’s schedule. 💛
      </p>
    </div>
  );
}
