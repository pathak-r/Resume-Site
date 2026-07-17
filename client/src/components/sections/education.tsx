const F = "var(--cat-font)";

export default function Education() {
  return (
    <section id="education" className="catalog-section" data-testid="section-education">
      <div className="catalog-panel">
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--cat-text-tertiary)",
            fontWeight: 600,
            fontFamily: F,
            margin: "0 0 10px",
          }}
          data-testid="text-education-label"
        >
          Education
        </p>
        <p
          style={{
            fontSize: "17px",
            lineHeight: 1.55,
            color: "var(--cat-text-secondary)",
            fontFamily: "var(--cat-font-body)",
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
