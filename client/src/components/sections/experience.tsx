type ExperienceItem = {
  years: string;
  roleCompany: string;
  line: string;
};

const experiences: ExperienceItem[] = [
  {
    years: "2023 — NOW",
    roleCompany: "Senior PM, Hexagon",
    line: "own AI strategy for plant design software; shipped copilots and NL agents, 3× faster engineering workflows.",
  },
  {
    years: "2018 — 2022",
    roleCompany: "PM, Hexagon",
    line: "took AI MVPs from demo to product across business units; 'Voice of the Customer' award.",
  },
  {
    years: "2013 — 2018",
    roleCompany: "Support Analyst, Hexagon",
    line: "the technical years: SDK automation that cut engineering effort 80% on mission-critical deployments.",
  },
  {
    years: "2009 — 2011",
    roleCompany: "Process Engineer, Nestlé",
    line: "LEAN and Six Sigma on live production lines.",
  },
];

const F = "var(--cat-font)";
const FB = "var(--cat-font-body)";

export default function Experience() {
  return (
    <section
      id="experience"
      className="catalog-section exp-brief"
      data-testid="section-experience"
    >
      <div className="catalog-panel">
        <div className="catalog-section-header exp-brief-header">
          <p
            style={{
              fontSize: "var(--cat-fs-eyebrow)",
              letterSpacing: "var(--cat-ls-eyebrow)",
              color: "var(--cat-text-tertiary)",
              textTransform: "uppercase",
              margin: 0,
              fontWeight: 500,
              fontFamily: F,
            }}
            data-testid="heading-experience"
          >
            Experience
          </p>
          <p
            style={{
              fontSize: "var(--cat-fs-eyebrow)",
              letterSpacing: "var(--cat-ls-eyebrow)",
              color: "var(--cat-text-tertiary)",
              textTransform: "uppercase",
              margin: 0,
              fontWeight: 500,
              fontFamily: F,
            }}
          >
            {String(experiences.length).padStart(2, "0")} Roles
          </p>
        </div>

        {experiences.map((exp, index) => (
          <div key={exp.years} data-testid={`card-experience-${index}`}>
            {index > 0 && <hr className="exp-brief-divider" />}
            <div
              className="exp-brief-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(100px, 120px) 1fr",
                gap: "1rem",
                padding: "0.6rem 0",
                alignItems: "baseline",
              }}
            >
              <p
                style={{
                  fontSize: "var(--cat-fs-eyebrow)",
                  letterSpacing: "var(--cat-ls-eyebrow)",
                  color: "var(--cat-text-tertiary)",
                  textTransform: "uppercase",
                  margin: 0,
                  fontWeight: 600,
                  fontFamily: F,
                  lineHeight: 1.35,
                }}
                data-testid={`text-period-${index}`}
              >
                {exp.years}
              </p>

              <p
                style={{
                  fontSize: "var(--cat-fs-body)",
                  lineHeight: 1.45,
                  margin: 0,
                  fontFamily: FB,
                  color: "var(--cat-text-secondary)",
                }}
                data-testid={`text-exp-line-${index}`}
              >
                <span
                  style={{
                    fontWeight: 600,
                    color: "var(--cat-text)",
                    fontFamily: F,
                  }}
                  data-testid={`text-role-${index}`}
                >
                  {exp.roleCompany}
                </span>
                <span style={{ color: "var(--cat-text)" }}> — </span>
                {exp.line}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .exp-brief-header {
          margin-bottom: 0.75rem !important;
          padding-bottom: 10px !important;
        }
        .exp-brief-divider {
          border: 0;
          border-top: var(--cat-rule-width) solid var(--cat-rule);
          margin: 0;
        }
        @media (max-width: 640px) {
          .exp-brief-row {
            grid-template-columns: 1fr !important;
            gap: 0.2rem !important;
            padding: 0.55rem 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
