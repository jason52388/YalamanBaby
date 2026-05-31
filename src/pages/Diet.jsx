import { foods, lifestyle, substances } from '../data/diet.js';

function FoodCard({ group }) {
  return (
    <div className="card">
      <h3>{group.emoji} {group.title}</h3>
      <ul className="clean">
        {group.items.map((it, i) => (
          <li key={i} className="compare-item">
            <span className="name">{it.name}</span>
            <br />
            <span className="note">{it.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ListCard({ group }) {
  return (
    <div className="card">
      <h3>{group.emoji} {group.title}</h3>
      <ul className="clean">
        {group.items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Diet() {
  return (
    <div className="page">
      <div className="page-head">
        <h1>Diet Do's &amp; Don'ts</h1>
        <p>What to eat, what to avoid, and how to stay safe and healthy along the way.</p>
      </div>

      <h2 style={{ textAlign: 'center' }}>🍽️ Food</h2>
      <div className="grid grid-2">
        <FoodCard group={foods.enjoy} />
        <FoodCard group={foods.avoid} />
      </div>

      <h2 style={{ textAlign: 'center', marginTop: '2.5rem' }}>🌼 Do's &amp; Don'ts</h2>
      <div className="grid grid-2">
        <ListCard group={lifestyle.dos} />
        <ListCard group={lifestyle.donts} />
      </div>

      <h2 style={{ textAlign: 'center', marginTop: '2.5rem' }}>💊 Beyond Food</h2>
      <p style={{ textAlign: 'center', maxWidth: '40rem', margin: '0 auto 1.25rem' }}>
        {substances.intro}
      </p>
      <div className="grid grid-2">
        <FoodCard group={substances} />
      </div>

      <p className="disclaimer">
        General guidance only — dietary needs vary, so follow your provider's advice and
        any guidance specific to your pregnancy. 💛
      </p>
    </div>
  );
}
