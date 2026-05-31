import { useState } from 'react';
import Section from '../components/Section.jsx';
import { config } from '../config.js';
import { computeWeek } from '../lib/pregnancy.js';
import {
  tipSections,
  sectionsForWeek,
  tipText,
  warningSigns,
} from '../data/tips.js';

export default function Tips() {
  const p = computeWeek(config.dueDate);
  const hasWeek = p.valid && p.week > 0 && p.week < 41;
  const [showAll, setShowAll] = useState(false);

  const sections = hasWeek && !showAll ? sectionsForWeek(p.week) : tipSections;

  return (
    <div className="page">
      <div className="page-head">
        <h1>Tips &amp; Tricks</h1>
        <p>Gentle, practical ideas for navigating the ups and downs of pregnancy.</p>
      </div>

      {hasWeek && (
        <div className="filter-bar">
          <span className="pill">
            {showAll ? 'All tips' : `Most relevant for week ${p.week}`}
          </span>
          <button
            type="button"
            className="link-btn"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? `Show week ${p.week} only` : 'Show all tips'}
          </button>
        </div>
      )}

      <div className="grid grid-2">
        {sections.map((s) => (
          <Section key={s.title} emoji={s.emoji} title={s.title}>
            <ul className="clean">
              {s.tips.map((t) => (
                <li key={tipText(t)}>{tipText(t)}</li>
              ))}
            </ul>
          </Section>
        ))}
      </div>

      <div className="callout">
        <h3>{warningSigns.emoji} {warningSigns.title}</h3>
        <p>{warningSigns.intro}</p>
        <ul className="clean">
          {warningSigns.signs.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <p className="disclaimer">
        This is general wellness information, not medical advice. Always check with your
        doctor or midwife about your specific situation. 💛
      </p>
    </div>
  );
}
