import { Link } from 'react-router-dom';
import { config } from '../config.js';
import { computeWeek, trimesterLabel } from '../lib/pregnancy.js';

const cards = [
  { to: '/plan', ico: '🗓️', label: 'Your Plan', desc: 'Week-by-week to-dos & what’s next' },
  { to: '/body', ico: '🤰', label: 'Your Body', desc: 'Week-by-week body changes & medical facts' },
  { to: '/progress', ico: '📏', label: 'Progress', desc: "Baby's size & this week's milestones" },
  { to: '/tips', ico: '💡', label: 'Tips & Tricks', desc: 'Morning sickness & feeling your best' },
  { to: '/diet', ico: '🥗', label: "Diet Do's & Don'ts", desc: 'What to eat, avoid, do & skip' },
  { to: '/gallery', ico: '📸', label: 'Gallery', desc: 'Our journey in pictures' },
  { to: '/names', ico: '✨', label: 'Names', desc: 'Our running list of favorites' },
];

export default function Home() {
  const p = computeWeek(config.dueDate);

  return (
    <div className="page">
      <div className="hero">
        <p className="eyebrow">{config.parentNames} are expecting</p>
        <h1>Our Baby Journey 👶</h1>
        <p className="girl-reveal">
          <span className="sparkle" aria-hidden="true">🎀</span>
          It’s a girl!
          <span className="sparkle" aria-hidden="true">💕</span>
        </p>
        <p style={{ maxWidth: '34rem', margin: '0 auto', color: 'var(--ink-soft)' }}>
          Following our little girl week by week — the milestones, the cravings,
          and every precious moment along the way until we meet her.
        </p>

        <div className="hero-card">
          {p.valid && p.week > 0 && p.week < 41 ? (
            <>
              <div className="pill">{trimesterLabel(p.trimester)}</div>
              <div className="big-number" style={{ marginTop: '.5rem' }}>
                Week {p.week}
              </div>
              <p style={{ margin: '.5rem 0 0', color: 'var(--ink-soft)' }}>
                {p.daysRemaining} days until we meet you 💕
              </p>
              <div className="progress-track" aria-hidden="true">
                <div className="progress-fill" style={{ width: `${p.percentComplete}%` }} />
              </div>
              <small style={{ color: 'var(--ink-soft)' }}>{p.percentComplete}% of the way there</small>
            </>
          ) : (
            <p style={{ margin: 0, color: 'var(--ink-soft)' }}>
              Set your due date in <code>src/config.js</code> to start the countdown!
            </p>
          )}
        </div>
      </div>

      <div className="home-links">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="home-link">
            <span className="ico" aria-hidden="true">{c.ico}</span>
            <span>
              <strong>{c.label}</strong>
              <br />
              <small style={{ color: 'var(--ink-soft)' }}>{c.desc}</small>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
