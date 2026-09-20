export default function Education() {
  return (
    <section
      id="education"
      className="catalog-section"
      style={{ background: "transparent" }}
      data-testid="section-education"
    >
      <div className="catalog-panel">
        <p className="work-label" data-testid="text-education-label">
          Education
        </p>
        <p
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.5,
            color: "var(--cat-text)",
            fontFamily: "var(--cat-font-body)",
            fontWeight: 500,
            margin: 0,
          }}
          data-testid="text-education-line"
        >
          Master of Science, North Carolina State University, Raleigh
        </p>
      </div>
    </section>
  );
}
