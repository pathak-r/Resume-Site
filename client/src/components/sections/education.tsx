export default function Education() {
  return (
    <section
      id="education"
      className="catalog-section"
      style={{ background: "transparent" }}
      data-testid="section-education"
    >
      <div className="catalog-panel">
        <p
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--cat-text-tertiary)",
            fontWeight: 500,
            fontFamily: "var(--cat-font-mono)",
            margin: "0 0 0.45rem",
          }}
          data-testid="text-education-label"
        >
          Education
        </p>
        <p
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.55,
            color: "var(--cat-text-secondary)",
            fontFamily: "var(--cat-font)",
            margin: 0,
            maxWidth: "36em",
          }}
          data-testid="text-education-line"
        >
          Master of Science, North Carolina State University, Raleigh
        </p>
      </div>
    </section>
  );
}
