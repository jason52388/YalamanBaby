// A titled card section with an emoji and a list of bullet points.
export default function Section({ emoji, title, children }) {
  return (
    <section className="card">
      <h3>
        {emoji && <span aria-hidden="true">{emoji} </span>}
        {title}
      </h3>
      {children}
    </section>
  );
}
