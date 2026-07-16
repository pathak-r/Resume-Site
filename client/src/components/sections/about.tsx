const expertise = [
  "Product strategy",
  "Generative AI",
  "LLMs & RAG",
  "Enterprise SaaS",
  "MLOps awareness",
  "Roadmapping",
  "Stakeholder management",
  "Azure PaaS",
  "Agentic systems",
  "Data analytics",
];

const education = [
  {
    degree: "M.S. Mechanical Engineering",
    school: "North Carolina State University",
  },
  {
    degree: "B.Tech Mechanical Engineering",
    school: "National Institute of Technology (NIT) Rourkela",
  },
];

const F = "var(--cat-font)";
const FB = "var(--cat-font-body)";

export default function About() {
  return (
    <section id="about" className="catalog-section" data-testid="section-about">
      <div className="catalog-panel">
        <h2
          style={{
            fontSize: "32px",
            fontWeight: 600,
            margin: "0 0 24px",
            lineHeight: 1.2,
            color: "var(--cat-text)",
            letterSpacing: "-0.015em",
            fontFamily: F,
          }}
          data-testid="heading-about"
        >
          How I think about building.
        </h2>

        <div className="about-grid">
          <div>
            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.75,
                color: "var(--cat-text)",
                margin: "0 0 14px",
                fontFamily: FB,
              }}
            >
              I prototype before I pitch. Every real idea starts as something I build
              myself, rough, working, put in front of users and stakeholders early.
              I iterate on it alone until the feedback stops surprising me, and only
              then do I bring in the team to build it properly.
            </p>
            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.75,
                color: "var(--cat-text-secondary)",
                margin: "0 0 24px",
                fontFamily: FB,
              }}
            >
              It's slower at the start and faster at the end. Most of the cost of
              software is built wrong, not built slowly.
            </p>

            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                color: "var(--cat-text-tertiary)",
                textTransform: "uppercase",
                margin: "0 0 10px",
                fontWeight: 600,
                fontFamily: F,
              }}
            >
              Core Expertise
            </p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {expertise.map((skill, i) => (
                <span key={skill} className="catalog-tag catalog-tag--filled" data-testid={`chip-skill-${i}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="cat-plate" style={{ padding: "1.25rem 1.5rem", alignSelf: "start" }}>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                color: "var(--cat-ink-tertiary)",
                textTransform: "uppercase",
                margin: "0 0 12px",
                fontWeight: 600,
                fontFamily: F,
              }}
            >
              Education
            </p>
            {education.map((ed, i) => (
              <div
                key={ed.degree}
                data-testid={`text-education-${i}`}
                style={{
                  paddingTop: i === 0 ? 0 : "1rem",
                  paddingBottom: i === education.length - 1 ? 0 : "1rem",
                  borderBottom:
                    i === education.length - 1 ? "none" : "1px solid var(--cat-ink-rule)",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--cat-ink)",
                    fontFamily: F,
                  }}
                >
                  {ed.degree}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "var(--cat-ink-secondary)",
                    marginTop: "2px",
                    fontFamily: FB,
                  }}
                >
                  {ed.school}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
          gap: 2.5rem;
          align-items: start;
        }
        @media (max-width: 767px) {
          .about-grid { grid-template-columns: 1fr; gap: 1.5rem; }
        }
      `}</style>
    </section>
  );
}
