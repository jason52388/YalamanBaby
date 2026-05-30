import Section from '../components/Section.jsx';
import { tipSections, warningSigns } from '../data/tips.js';

export default function Tips() {
  return (
    <div className="page">
      <div className="page-head">
        <h1>Tips & Tricks</h1>
        <p>Gentle, practical ideas for navigating the ups and downs of pregnancy.</p>
      </div>

      <div className="grid grid-2">
        {tipSections.map((s) => (
          <Section key={s.title} emoji={s.emoji} title={s.title}>
            <ul className="clean">
              {s.tips.map((t, i) => (
                <li key={i}>{t}</li>
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
