import { config } from '../config.js';
import { computeWeek, trimesterLabel } from '../lib/pregnancy.js';
import { weekData } from '../data/weeks.js';

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

export default function Progress() {
  const p = computeWeek(config.dueDate);
  const week = Math.min(Math.max(p.week, 4), 40);
  const data = weekData(week);

  return (
    <div className="page">
      <div className="page-head">
        <h1>This Week's Progress</h1>
        <p>How baby is growing right now — sizes and milestones update automatically as the weeks go by.</p>
      </div>

      {!p.valid ? (
        <div className="card" style={{ textAlign: 'center' }}>
          Add your due date to <code>src/config.js</code> to see week-by-week progress.
        </div>
      ) : (
        <div className="grid grid-2">
          <div className="card size-hero">
            <div className="pill">{trimesterLabel(p.trimester)}</div>
            <div className="size-emoji" aria-hidden="true">{sizeEmoji(week)}</div>
            <h2 style={{ marginBottom: '.2em' }}>Week {p.week}</h2>
            <p style={{ fontSize: '1.15rem' }}>
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
            <small style={{ color: 'var(--ink-soft)' }}>{p.percentComplete}% of 40 weeks</small>
          </div>

          <div className="card">
            <h3>✨ Interesting this week</h3>
            <ul className="clean">
              {data.facts.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            {p.week < 4 && (
              <p style={{ color: 'var(--ink-soft)', marginTop: '1rem' }}>
                It's still very early — showing week 4 details. Check back as the weeks add up!
              </p>
            )}
            {p.week > 40 && (
              <p style={{ color: 'var(--ink-soft)', marginTop: '1rem' }}>
                Baby is fully cooked! 🎉 Any day now.
              </p>
            )}
          </div>
        </div>
      )}

      <p className="disclaimer">
        Sizes and milestones are general averages — every baby grows at their own pace. 💛
      </p>
    </div>
  );
}
