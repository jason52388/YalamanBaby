import { useEffect, useMemo, useState } from 'react';
import { config } from '../config.js';
import { computeWeek, trimesterLabel } from '../lib/pregnancy.js';
import {
  planForWeek,
  trimesterForWeek,
  MIN_WEEK,
  MAX_WEEK,
} from '../data/plan.js';

const LS_KEY = 'yalaman-plan-checks';

// Read the saved set of completed item ids from this device.
function loadChecks() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// A single tickable line — a todo or an appointment. Ticking it persists.
function CheckItem({ id, item, checked, onToggle }) {
  return (
    <li className={`plan-check ${checked ? 'done' : ''}`}>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(id)}
        />
        <span className="box" aria-hidden="true" />
        <span className="plan-check-text">
          {item.text}
          {item.note && <span className="plan-note">{item.note}</span>}
        </span>
      </label>
    </li>
  );
}

export default function Plan() {
  const p = computeWeek(config.dueDate);
  // The current pregnancy week, clamped to the range our plan covers.
  const currentWeek = p.valid
    ? Math.max(MIN_WEEK, Math.min(p.week || MIN_WEEK, MAX_WEEK))
    : MIN_WEEK;

  // The week being viewed — defaults to the current week of pregnancy.
  const [week, setWeek] = useState(currentWeek);

  // If the computed current week changes (e.g. config/date), follow it until
  // the user manually browses elsewhere.
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (!touched) setWeek(currentWeek);
  }, [currentWeek, touched]);

  const [checks, setChecks] = useState(loadChecks);
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(checks));
    } catch {
      /* ignore quota / private-mode errors */
    }
  }, [checks]);

  const toggle = (id) =>
    setChecks((c) => {
      const next = { ...c };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });

  const go = (w) => {
    setTouched(true);
    setWeek(Math.max(MIN_WEEK, Math.min(w, MAX_WEEK)));
  };

  const data = planForWeek(week);
  const trimester = trimesterForWeek(week);
  const isCurrent = week === currentWeek;

  // Build stable ids for each tickable item on this week and tally progress.
  const { items, doneCount } = useMemo(() => {
    const all = [
      ...data.todos.map((it, i) => ({ id: `w${week}-todo-${i}`, item: it })),
      ...data.appts.map((it, i) => ({ id: `w${week}-appt-${i}`, item: it })),
    ];
    return { items: all, doneCount: all.filter((x) => checks[x.id]).length };
  }, [data, week, checks]);

  const total = items.length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="page">
      <div className="page-head">
        <h1>Your Plan</h1>
        <p>
          A week-by-week game plan — what’s happening, what to do, and what to
          line up next. It opens on your current week, but you can look ahead or
          back any time.
        </p>
      </div>

      {/* Week navigator */}
      <div className="plan-nav">
        <button
          type="button"
          className="btn-icon"
          onClick={() => go(week - 1)}
          disabled={week <= MIN_WEEK}
          aria-label="Previous week"
        >
          ‹
        </button>

        <div className="plan-week-pick">
          <div className="pill">{trimesterLabel(trimester)}</div>
          <label className="plan-week-label">
            Week
            <select
              value={week}
              onChange={(e) => go(Number(e.target.value))}
              aria-label="Jump to week"
            >
              {Array.from({ length: MAX_WEEK - MIN_WEEK + 1 }, (_, i) => MIN_WEEK + i).map(
                (w) => (
                  <option key={w} value={w}>
                    {w}
                    {w === currentWeek ? ' (now)' : ''}
                  </option>
                ),
              )}
            </select>
          </label>
        </div>

        <button
          type="button"
          className="btn-icon"
          onClick={() => go(week + 1)}
          disabled={week >= MAX_WEEK}
          aria-label="Next week"
        >
          ›
        </button>
      </div>

      {!isCurrent && p.valid && (
        <div className="filter-bar" style={{ justifyContent: 'center' }}>
          <span className="pill" style={{ background: 'var(--cream-deep)' }}>
            Viewing week {week}
          </span>
          <button type="button" className="link-btn" onClick={() => { setTouched(false); setWeek(currentWeek); }}>
            Jump to my week ({currentWeek})
          </button>
        </div>
      )}

      {/* Week range slider for quick scrubbing */}
      <input
        type="range"
        className="plan-range"
        min={MIN_WEEK}
        max={MAX_WEEK}
        value={week}
        onChange={(e) => go(Number(e.target.value))}
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
        </div>
        <p style={{ margin: 0 }}>{data.summary}</p>

        {total > 0 && (
          <>
            <div className="progress-track" aria-hidden="true" style={{ marginTop: '1.1rem' }}>
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <small style={{ color: 'var(--ink-soft)' }}>
              {doneCount} of {total} checked off for this week
            </small>
          </>
        )}
      </div>

      <div className="grid grid-2" style={{ marginTop: '1.25rem' }}>
        {data.todos.length > 0 && (
          <section className="card">
            <h3>✅ What to do this week</h3>
            <ul className="clean plan-checks">
              {data.todos.map((it, i) => {
                const id = `w${week}-todo-${i}`;
                return (
                  <CheckItem key={id} id={id} item={it} checked={!!checks[id]} onToggle={toggle} />
                );
              })}
            </ul>
          </section>
        )}

        {data.appts.length > 0 && (
          <section className="card">
            <h3>🩺 Appointments &amp; tests</h3>
            <ul className="clean plan-checks">
              {data.appts.map((it, i) => {
                const id = `w${week}-appt-${i}`;
                return (
                  <CheckItem key={id} id={id} item={it} checked={!!checks[id]} onToggle={toggle} />
                );
              })}
            </ul>
          </section>
        )}
      </div>

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

      <p className="disclaimer">
        This is a general roadmap compiled from common pregnancy resources — not
        medical advice. The exact timing of visits, tests, classes, and
        vaccines varies by person and pregnancy, so always follow your doctor or
        midwife’s schedule. 💛
      </p>
    </div>
  );
}
