import { Link } from 'react-router-dom';
import { config } from '../config.js';
import { computeWeek, trimesterLabel } from '../lib/pregnancy.js';
import { weekData } from '../data/weeks.js';

const cards = [
  { to: '/plan', ico: '🗓️', label: 'Your Plan', desc: 'Week-by-week to-dos & what’s next' },
  { to: '/body', ico: '🤰', label: 'Your Body', desc: 'Week-by-week body changes & medical facts' },
  { to: '/gallery', ico: '📸', label: 'Gallery', desc: 'Our journey in pictures' },
  { to: '/names', ico: '✨', label: 'Names', desc: 'Our running list of favorites' },
  { to: '/tips', ico: '💡', label: 'Tips & Tricks', desc: 'Morning sickness & feeling your best' },
  { to: '/diet', ico: '🥗', label: "Diet Do's & Don'ts", desc: 'What to eat, avoid, do & skip' },
];

// A rough fruit/veg emoji per stage, just for fun.
function sizeEmoji(week) {
  if (week < 8) return '🫐';
  if (week < 11) return '🍒';
  if (week < 14) return '🍑';
  if (week < 16) return '🍋';
  if (week < 19) return '🥑';
  if (week < 21) return '🍌';
  if (week < 24) return '🥕';
  if (week < 28) return '🌽';
  if (week < 31) return '🍆';
  if (week < 34) return '🍍';
  if (week < 37) return '🍈';
  return '🎃';
}

export default function Home() {
  const p = computeWeek(config.dueDate);
  const showWeek = p.valid && p.week > 0 && p.week < 41;
  // weekData clamps very early/late weeks to the nearest entry (4–40).
  const data = showWeek ? weekData(p.week) : null;

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

        {/* This-week snapshot: countdown + baby's size & growth, all in one place. */}
        <div className="hero-card">
          {showWeek ? (
            <>
              <div className="pill">{trimesterLabel(p.trimester)}</div>
              <div className="size-emoji" aria-hidden="true">{sizeEmoji(p.week)}</div>
              <div className="big-number">Week {p.week}</div>
              <p style={{ margin: '.35rem 0 0', fontSize: '1.1rem' }}>
                Baby is about the size of <strong>{data.size}</strong>.
              </p>

              <div className="stat-row">
                <div className="stat"><div className="num">{data.length}</div><div className="lbl">Length</div></div>
                <div className="stat"><div className="num">{data.weight}</div><div className="lbl">Weight</div></div>
                <div className="stat"><div className="num">{p.daysRemaining}</div><div className="lbl">Days to go</div></div>
              </div>

              <div className="progress-track" aria-hidden="true">
                <div className="progress-fill" style={{ width: `${p.percentComplete}%` }} />
              </div>
              <small style={{ color: 'var(--ink-soft)' }}>{p.percentComplete}% of 40 weeks 💕</small>

              {p.week < 4 && (
                <p style={{ color: 'var(--ink-soft)', margin: '.75rem 0 0', fontSize: '.9rem' }}>
                  It’s still very early — showing week 4 details. Check back as the weeks add up!
                </p>
              )}
            </>
          ) : (
            <p style={{ margin: 0, color: 'var(--ink-soft)' }}>
              Set your due date in <code>src/config.js</code> to start the countdown!
            </p>
          )}
        </div>

        {/* Milestones for the week — carried over from the old Progress page. */}
        {showWeek && (
          <div className="card" style={{ maxWidth: '560px', margin: '1.25rem auto 0', textAlign: 'left' }}>
            <h3>✨ Interesting this week</h3>
            <ul className="clean">
              {data.facts.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}
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

      {showWeek && (
        <p className="disclaimer">
          Baby sizes and milestones are general averages — every baby grows at their own pace. 💛
        </p>
      )}
    </div>
  );
}
