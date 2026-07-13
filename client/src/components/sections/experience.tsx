type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  periodLabel: string;
  location: string;
  description: string;
  achievements: string[];
};

const experiences: ExperienceItem[] = [
  {
    company: "Hexagon AB",
    role: "Senior Product Manager",
    period: "Jan 2023 – Present",
    periodLabel: "JAN 2023 — PRESENT",
    location: "Abu Dhabi, UAE",
    description:
      "Leading end-to-end strategy for AI product innovation, building and scaling LLM-based agentic systems.",
    achievements: [
      "Led strategy for AI copilots, achieving 3× faster execution for engineering workflows.",
      "Delivered enterprise-grade AI agents for complex database queries.",
      "Launched secure RAG assistant deflecting 40% of support tickets.",
    ],
  },
  {
    company: "Hexagon AB",
    role: "Product Manager",
    period: "Sep 2018 – Dec 2022",
    periodLabel: "SEP 2018 — DEC 2022",
    location: "Abu Dhabi, UAE",
    description:
      "Managed product lifecycle and delivered high-impact AI MVPs across business units.",
    achievements: [
      "Recognized with 'Voice of the Customer' award for productivity gains.",
      "Defined and executed 12-month product roadmaps in an agile framework.",
    ],
  },
  {
    company: "Hexagon AB",
    role: "Support Analyst",
    period: "Sep 2013 – Sep 2018",
    periodLabel: "SEP 2013 — SEP 2018",
    location: "Huntsville, Alabama",
    description:
      "Led support for mission-critical enterprise deployments across global customers.",
    achievements: [
      "Reduced engineering effort by 80% via SDK-driven automation scripts.",
      "Authored Knowledge Base documentation reducing resolution time by 25%.",
    ],
  },
];

const F = "var(--cat-font)";

export default function Experience() {
  return (
    <section id="experience" className="catalog-section" data-testid="section-experience">
      <div className="catalog-panel">
        <div className="catalog-section-header">
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
          <div key={index} data-testid={`card-experience-${index}`}>
            {index > 0 && <hr className="catalog-divider" />}
            <div className="catalog-entry-row__inner">
              {/* Index column — dates + location */}
              <div>
                <p
                  style={{
                    fontSize: "var(--cat-fs-eyebrow)",
                    letterSpacing: "var(--cat-ls-eyebrow)",
                    color: "var(--cat-text-tertiary)",
                    textTransform: "uppercase",
                    margin: 0,
                    fontWeight: 500,
                    fontFamily: F,
                    lineHeight: 1.5,
                  }}
                  data-testid={`text-period-${index}`}
                >
                  {exp.periodLabel}
                </p>
                <p
                  style={{
                    fontSize: "var(--cat-fs-eyebrow)",
                    letterSpacing: "var(--cat-ls-eyebrow)",
                    color: "var(--cat-text-tertiary)",
                    textTransform: "uppercase",
                    margin: "10px 0 0",
                    fontWeight: 500,
                    fontFamily: F,
                    lineHeight: 1.5,
                  }}
                  data-testid={`text-location-${index}`}
                >
                  {exp.location}
                </p>
              </div>

              {/* Content column */}
              <div>
                <p className="catalog-meta" style={{ marginBottom: "4px", fontFamily: F }}>Role</p>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    margin: "0 0 4px",
                    color: "var(--cat-text)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    fontFamily: F,
                  }}
                  data-testid={`text-role-${index}`}
                >
                  {exp.role}
                </h3>
                <p
                  style={{
                    fontSize: "var(--cat-fs-body)",
                    color: "var(--cat-text-secondary)",
                    margin: "0 0 14px",
                    fontFamily: "var(--cat-font-body)",
                  }}
                  data-testid={`text-company-${index}`}
                >
                  {exp.company}
                </p>
                <p
                  style={{
                    fontSize: "var(--cat-fs-body)",
                    lineHeight: 1.65,
                    color: "var(--cat-text)",
                    margin: "0 0 12px",
                    fontFamily: "var(--cat-font-body)",
                  }}
                  data-testid={`text-exp-desc-${index}`}
                >
                  {exp.description}
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {exp.achievements.map((item, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.6rem",
                        fontSize: "var(--cat-fs-body)",
                        lineHeight: 1.65,
                        color: "var(--cat-text-secondary)",
                        marginBottom: "6px",
                        fontFamily: "var(--cat-font-body)",
                      }}
                      data-testid={`text-achievement-${index}-${i}`}
                    >
                      <span style={{ color: "var(--cat-text-tertiary)", flexShrink: 0, marginTop: "0.15rem" }}>—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
