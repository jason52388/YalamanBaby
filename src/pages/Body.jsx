import { useEffect, useState } from 'react';
import { config } from '../config.js';
import {
  computeWeek,
  trimesterLabel,
  weekDateRange,
  formatWeekRange,
} from '../lib/pregnancy.js';
import { trimesterForWeek } from '../data/plan.js';
import { bodyForWeek, MIN_WEEK, MAX_WEEK, ALL_WEEKS } from '../data/body.js';

const clamp = (w) => Math.max(MIN_WEEK, Math.min(w, MAX_WEEK));

// Emoji for each body "area" tag used in the data file. Falls back to a dot.
const AREA_ICON = {
  Uterus: '🤰', Ovaries: '🥚', 'Fallopian tube': '🥚', Cervix: '🌸', Placenta: '🛡️',
  Hormones: '⚗️', Blood: '🩸', 'Blood & heart': '❤️', 'Blood & legs': '🩸',
  'Blood & Rh': '🩸', 'Blood pressure': '🩺', Breasts: '🤱', Bladder: '🚻',
  Skin: '✨', Hair: '💇', Digestion: '🍽️', Stomach: '🍽️', Saliva: '💧',
  Waist: '📏', Belly: '🤰', Ligaments: '🦴', 'Round ligaments': '🦴', Joints: '🦴',
  'Joints & ligaments': '🦴', 'Joints & posture': '🧍', 'Joints & pelvis': '🦴',
  'Posture & back': '🧍', Pelvis: '🦴', Lungs: '🫁', Ribs: '🫁', Eyes: '👁️',
  'Feet & ankles': '🦶', 'Feet & hands': '🤲', 'Legs & circulation': '🦵',
  Metabolism: '🔥', Sleep: '😴', Energy: '⚡', Appetite: '🍴', 'Mucus plug': '🌸',
  'Whole body': '💗',
};
const areaIcon = (area) => AREA_ICON[area] || '🔹';

// ── Infographic data, all derived from the week number ──────────────────────

// Cumulative recommended weight gain (lbs) for a typical (normal-BMI) range:
// ~2–4 lb through the first trimester, then ~1 lb/week after.
function weightGain(week) {
  if (week <= 13) {
    return { lo: Math.round((week / 13) * 2), hi: Math.round((week / 13) * 4) };
  }
  const extra = week - 13;
  return { lo: Math.round(2 + extra * 0.9), hi: Math.round(4 + extra * 1.0) };
}

// Blood volume rises ~40–50% above baseline, climbing from ~week 6 and
// plateauing around weeks 32–34.
function bloodVolumePct(week) {
  if (week < 6) return 0;
  return Math.min(45, Math.round(((week - 6) / (33 - 6)) * 45));
}

// A short label for where the top of the uterus (fundus) sits.
function fundalLabel(week) {
  if (week < 12) return 'Low in pelvis';
  if (week < 16) return 'At pubic bone';
  if (week < 20) return 'Below the navel';
  if (week === 20) return 'At the navel';
  if (week <= 35) return `≈ ${week} cm`;
  if (week === 36) return 'Up at the ribs';
  return 'Dropping ↓';
}

// A fun fruit/object comparison for the size of the uterus & bump.
function uterusSize(week) {
  if (week < 6) return '🍐 a pear';
  if (week < 9) return '🍊 an orange';
  if (week < 13) return '🍈 a grapefruit';
  if (week < 17) return '🍈 a cantaloupe';
  if (week < 21) return '🍈 a small melon';
  if (week < 28) return '🏉 a rugby ball';
  if (week < 35) return '🍉 a small watermelon';
  return '🍉 a watermelon';
}

// A sentence describing the fundal height for the diagram caption.
function fundalCaption(week) {
  if (week < 12) return 'Your uterus is still tucked down behind your pubic bone.';
  if (week < 16) return 'Your uterus has risen just above your pubic bone.';
  if (week < 20) return 'Your uterus sits about halfway between your pubic bone and belly button.';
  if (week === 20) return 'The top of your uterus has reached your belly button — halfway!';
  if (week <= 35) return `The top of your uterus is roughly ${week} cm above your pubic bone.`;
  if (week === 36) return 'Your uterus is at its highest point, right up near your ribs.';
  return 'Baby may “drop” into your pelvis (lightening), easing the pressure on your lungs.';
}

// Vertical position (SVG y) of the top of the uterus for a given week.
// Lower y = higher up the torso. Built from a few anchor points and lerped.
function fundusY(week) {
  const pts = [
    [1, 250], [8, 245], [12, 232], [16, 196], [20, 150],
    [24, 116], [28, 92], [32, 72], [36, 60], [40, 80],
  ];
  if (week <= pts[0][0]) return pts[0][1];
  if (week >= pts[pts.length - 1][0]) return pts[pts.length - 1][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [w0, y0] = pts[i];
    const [w1, y1] = pts[i + 1];
    if (week >= w0 && week <= w1) {
      const t = (week - w0) / (w1 - w0);
      return y0 + (y1 - y0) * t;
    }
  }
  return 250;
}

// ── The growing-uterus infographic (front-view schematic) ───────────────────
function BellyDiagram({ week }) {
  const PELVIS_Y = 250;
  const top = fundusY(week);
  const cx = 120;
  const cy = (top + PELVIS_Y) / 2;
  const ry = (PELVIS_Y - top) / 2;
  const rx = Math.max(16, Math.min(78, 18 + (PELVIS_Y - top) * 0.33));

  const landmarks = [
    { y: 72, label: 'Ribs' },
    { y: 150, label: 'Belly button' },
    { y: 250, label: 'Pubic bone' },
  ];

  return (
    <svg
      className="belly-svg"
      viewBox="0 0 260 300"
      role="img"
      aria-label={`Diagram of the uterus at week ${week}: ${fundalCaption(week)}`}
    >
      <defs>
        <linearGradient id="uterusFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--pink)" />
          <stop offset="100%" stopColor="var(--rose)" />
        </linearGradient>
      </defs>

      {/* Torso silhouette */}
      <path
        d="M74,54 Q54,150 78,250 Q120,288 162,250 Q186,150 166,54 Q120,40 74,54 Z"
        fill="var(--cream-deep)"
        stroke="rgba(138,124,118,0.5)"
        strokeWidth="2"
      />

      {/* Landmark lines + right-hand labels */}
      {landmarks.map((m) => (
        <g key={m.label}>
          <line
            x1="70" y1={m.y} x2="168" y2={m.y}
            stroke="rgba(138,124,118,0.45)" strokeWidth="1.5" strokeDasharray="3 3"
          />
          <line x1="168" y1={m.y} x2="180" y2={m.y} stroke="rgba(138,124,118,0.55)" strokeWidth="1.5" />
          <text x="184" y={m.y + 4} className="belly-label">{m.label}</text>
        </g>
      ))}

      {/* The uterus, growing upward with the weeks */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#uterusFill)" opacity="0.92" />
      {/* baby hint once there's room */}
      {week >= 14 && (
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="22" opacity="0.85">👶</text>
      )}

      {/* Navel dot */}
      <circle cx="120" cy="150" r="3.2" fill="rgba(90,77,73,0.7)" />

      {/* "Top of uterus" marker on the left */}
      <line
        x1="60" y1={top} x2={cx - rx} y2={top}
        stroke="var(--pink-deep)" strokeWidth="1.5" strokeDasharray="3 3"
      />
      <circle cx={cx - rx} cy={top} r="3" fill="var(--pink-deep)" />
      <text x="56" y={top - 5} textAnchor="end" className="belly-label belly-label-accent">Top of</text>
      <text x="56" y={top + 9} textAnchor="end" className="belly-label belly-label-accent">uterus</text>
    </svg>
  );
}

// ── A small labelled metric tile (with an optional bar) ─────────────────────
function Metric({ icon, label, value, sub, barPct }) {
  return (
    <div className="body-metric">
      <div className="body-metric-top">
        <span className="body-metric-icon" aria-hidden="true">{icon}</span>
        <span className="body-metric-label">{label}</span>
      </div>
      <div className="body-metric-value">{value}</div>
      {typeof barPct === 'number' && (
        <div className="body-bar" aria-hidden="true">
          <div className="body-bar-fill" style={{ width: `${barPct}%` }} />
        </div>
      )}
      {sub && <div className="body-metric-sub">{sub}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Single-week body view
// ─────────────────────────────────────────────────────────────
function WeekView({ week, currentWeek, nav, dueValid }) {
  const data = bodyForWeek(week);
  const trimester = trimesterForWeek(week);
  const isCurrent = week === currentWeek;
  const range = dueValid ? weekDateRange(config.dueDate, week) : null;

  const blood = bloodVolumePct(week);
  const gain = weightGain(week);

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
      </div>

      {/* Infographic: growing uterus + key measures */}
      <div className="grid grid-2" style={{ marginTop: '1.25rem' }}>
        <section className="card body-figure-card">
          <h3>📐 Where your uterus reaches</h3>
          <div className="body-figure">
            <BellyDiagram week={week} />
          </div>
          <p className="body-figure-caption">{fundalCaption(week)}</p>
        </section>

        <section className="card">
          <h3>📊 By the numbers</h3>
          <div className="body-metrics">
            <Metric
              icon="📏"
              label="Top of uterus"
              value={fundalLabel(week)}
              sub="Fundal height"
            />
            <Metric
              icon="🩸"
              label="Blood volume"
              value={blood > 0 ? `+${blood}%` : 'Baseline'}
              sub="Above pre-pregnancy"
              barPct={(blood / 45) * 100}
            />
            <Metric
              icon="⚖️"
              label="Weight gain"
              value={gain.hi > 0 ? `${gain.lo}–${gain.hi} lb` : '~0 lb'}
              sub="Typical range so far"
            />
            <Metric
              icon="🤰"
              label="Uterus & bump"
              value={uterusSize(week)}
              sub="Rough size"
            />
          </div>
        </section>
      </div>

      {/* What's changing */}
      <section className="card" style={{ marginTop: '1.25rem' }}>
        <h3>🌷 What’s changing in your body</h3>
        <ul className="clean body-changes">
          {data.changes.map((ch, i) => (
            <li key={i} className="body-change">
              <span className="body-change-icon" aria-hidden="true">{areaIcon(ch.area)}</span>
              <span className="body-change-text">
                <strong className="body-change-area">{ch.area}</strong>
                <span>{ch.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid grid-2" style={{ marginTop: '1.25rem' }}>
        {/* Common symptoms */}
        <section className="card">
          <h3>🫧 Symptoms you might notice</h3>
          <div className="symptom-tags">
            {data.symptoms.map((s, i) => (
              <span key={i} className="symptom-tag">{s}</span>
            ))}
          </div>
        </section>

        {/* Medical facts */}
        <section className="card body-facts">
          <h3>🩺 Good to know</h3>
          <ul className="clean">
            {data.facts.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────────────────────
export default function Body() {
  const p = computeWeek(config.dueDate);
  const currentWeek = p.valid ? clamp(p.week || MIN_WEEK) : MIN_WEEK;

  const [week, setWeek] = useState(currentWeek);
  const [touched, setTouched] = useState(false);

  // Follow the live current week until the user manually browses elsewhere.
  useEffect(() => {
    if (!touched) setWeek(currentWeek);
  }, [currentWeek, touched]);

  const nav = {
    go: (w) => { setTouched(true); setWeek(clamp(w)); },
    toCurrent: () => { setTouched(false); setWeek(currentWeek); },
  };

  return (
    <div className="page">
      <div className="page-head">
        <h1>Your Body, Week by Week</h1>
        <p>
          What’s happening to your body and the medical milestones along the way —
          from your uterus and blood volume to the symptoms to expect. It opens on
          your current week, and you can browse any week.
        </p>
      </div>

      <WeekView week={week} currentWeek={currentWeek} nav={nav} dueValid={p.valid} />

      <p className="disclaimer">
        General information compiled from common pregnancy resources — measurements
        like fundal height, blood volume, and weight gain are typical averages and
        vary from person to person. This is not medical advice, so always follow
        your OB/GYN or midwife. 💛
      </p>
    </div>
  );
}
