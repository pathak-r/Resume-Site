import EntryRow from "@/components/catalog/entry-row";

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

export default function About() {
  return (
    <section id="about" className="catalog-section" data-testid="section-about">
      <div className="px-4">
        <div className="catalog-panel">
          <EntryRow entryNumber="№ 05" numeral="05" label="About">
            <p className="catalog-meta" style={{ marginBottom: "6px" }}>A brief entry on</p>
            <h2
              style={{
                fontSize: "var(--cat-fs-h2)",
                fontWeight: 600,
                margin: "0 0 18px",
                lineHeight: 1.15,
                color: "var(--cat-text)",
                letterSpacing: "-0.025em",
              }}
              data-testid="heading-about"
            >
              How I think about building.
            </h2>

            <p
              style={{
                fontSize: "var(--cat-fs-body)",
                lineHeight: 1.75,
                color: "var(--cat-text)",
                margin: "0 0 14px",
              }}
            >
              I prototype before I pitch. Every real idea starts as something I build
              myself, rough, working, put in front of users and stakeholders early.
              I iterate on it alone until the feedback stops surprising me, and only
              then do I bring in the team to build it properly.
            </p>
            <p
              style={{
                fontSize: "var(--cat-fs-body)",
                lineHeight: 1.75,
                color: "var(--cat-text-secondary)",
                margin: "0 0 20px",
              }}
            >
              It's slower at the start and faster at the end. Most of the cost of
              software is built wrong, not built slowly.
            </p>

            <p
              style={{
                fontSize: "var(--cat-fs-eyebrow)",
                letterSpacing: "var(--cat-ls-eyebrow)",
                color: "var(--cat-text-tertiary)",
                textTransform: "uppercase",
                margin: "0 0 10px",
                fontWeight: 500,
              }}
            >
              Core Expertise
            </p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "1.75rem" }}>
              {expertise.map((skill, i) => (
                <span key={skill} className="catalog-tag catalog-tag--filled" data-testid={`chip-skill-${i}`}>
                  {skill}
                </span>
              ))}
            </div>

            <p
              style={{
                fontSize: "var(--cat-fs-eyebrow)",
                letterSpacing: "var(--cat-ls-eyebrow)",
                color: "var(--cat-text-tertiary)",
                textTransform: "uppercase",
                margin: "0 0 10px",
                fontWeight: 500,
              }}
            >
              Education
            </p>
            <div
              style={{
                background: "var(--cat-bg-card)",
                borderRadius: "var(--cat-radius-card)",
                border: `var(--cat-rule-width) solid var(--cat-rule)`,
                padding: "1.25rem 1.5rem",
              }}
            >
              {education.map((ed, i) => (
                <div
                  key={ed.degree}
                  data-testid={`text-education-${i}`}
                  style={{
                    paddingTop: i === 0 ? 0 : "1rem",
                    paddingBottom: i === education.length - 1 ? 0 : "1rem",
                    borderBottom:
                      i === education.length - 1
                        ? "none"
                        : `var(--cat-rule-width) solid var(--cat-rule)`,
                  }}
                >
                  <div style={{ fontSize: "var(--cat-fs-body)", fontWeight: 500, color: "var(--cat-text)" }}>
                    {ed.degree}
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--cat-text-secondary)", marginTop: "2px" }}>
                    {ed.school}
                  </div>
                </div>
              ))}
            </div>
          </EntryRow>
        </div>
      </div>
    </section>
  );
}
