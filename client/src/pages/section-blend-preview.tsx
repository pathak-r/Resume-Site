import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { VolveFigure, PropScanFigure } from "@/components/figures/figures";

/**
 * Local design preview — not linked from the homepage.
 * Open: /section-blend-preview
 */

const F = "var(--cat-font)";
const FB = "var(--cat-font-body)";

const roles = [
  {
    period: "JAN 2023 — PRESENT",
    role: "Senior Product Manager",
    company: "Hexagon AB",
    line: "AI copilots & agents for capital-project engineering — 3× faster workflows, RAG deflecting 40% of support.",
  },
  {
    period: "SEP 2018 — DEC 2022",
    role: "Product Manager",
    company: "Hexagon AB",
    line: "AI MVPs across business units; Voice of the Customer award for productivity gains.",
  },
  {
    period: "SEP 2013 — SEP 2018",
    role: "Support Analyst",
    company: "Hexagon AB",
    line: "Mission-critical enterprise support; SDK automation cut engineering effort ~80%.",
  },
];

const projects = [
  {
    key: "apricot" as const,
    keyColor: "var(--key-apricot)",
    label: "Geo-Agentic AI · Live demo",
    title: "Volve Field RAG Explorer",
    line: "Agentic RAG over Equinor's Volve field — drilling reports, production data, natural-language well questions.",
    figure: <VolveFigure />,
    cta: { label: "Explore live demo", href: "/geo-agentic-int" },
  },
  {
    key: "lavender" as const,
    keyColor: "var(--key-lavender)",
    label: "Vision AI · TestFlight",
    title: "PropScan",
    line: "Vision-LLM defect detection for property inspections — annotated photos, defect register, site verdict.",
    figure: <PropScanFigure />,
    cta: null as { label: string; href: string } | null,
  },
];

function SectionLabel({
  option,
  title,
  blurb,
}: {
  option: string;
  title: string;
  blurb: string;
}) {
  return (
    <div style={{ marginBottom: "2rem", maxWidth: "640px" }}>
      <p
        style={{
          fontSize: "12px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--cat-text-tertiary)",
          fontWeight: 600,
          fontFamily: F,
          margin: "0 0 8px",
        }}
      >
        {option}
      </p>
      <h2
        style={{
          fontSize: "28px",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          margin: "0 0 8px",
          fontFamily: F,
          color: "var(--cat-text)",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: "15px",
          lineHeight: 1.6,
          color: "var(--cat-text-secondary)",
          margin: 0,
          fontFamily: FB,
        }}
      >
        {blurb}
      </p>
    </div>
  );
}

function CompactProjectCard({
  project,
}: {
  project: (typeof projects)[number];
}) {
  const body = (
    <div
      className={`key-card key-card--${project.key}`}
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <div style={{ marginBottom: "1rem" }}>{project.figure}</div>
      <p
        style={{
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: project.keyColor,
          fontWeight: 600,
          margin: "0 0 8px",
          fontFamily: F,
        }}
      >
        {project.label}
      </p>
      <h3
        style={{
          fontSize: "20px",
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: "-0.015em",
          color: "var(--cat-text)",
          margin: "0 0 8px",
          fontFamily: F,
        }}
      >
        {project.title}
      </h3>
      <p
        style={{
          fontSize: "14px",
          lineHeight: 1.6,
          color: "var(--cat-text)",
          margin: project.cta ? "0 0 14px" : 0,
          fontFamily: FB,
          flex: 1,
        }}
      >
        {project.line}
      </p>
      {project.cta && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--cat-bg)",
            background: project.keyColor,
            borderRadius: "9px",
            padding: "9px 16px",
            marginTop: "auto",
            fontFamily: F,
            alignSelf: "flex-start",
          }}
        >
          {project.cta.label}
          <ArrowRight size={14} strokeWidth={2} />
        </div>
      )}
    </div>
  );

  if (project.cta) {
    return (
      <Link
        href={project.cta.href}
        style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
      >
        {body}
      </Link>
    );
  }
  return body;
}

function TrajectoryList() {
  return (
    <div>
      {roles.map((r, i) => (
        <div key={r.period}>
          {i > 0 && <hr className="catalog-divider" />}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(140px, 180px) 1fr",
              gap: "1.5rem",
              padding: "1.25rem 0",
            }}
            className="blend-role-row"
          >
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--cat-text-tertiary)",
                fontWeight: 500,
                fontFamily: F,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {r.period}
            </p>
            <div>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  margin: "0 0 4px",
                  fontFamily: F,
                  color: "var(--cat-text)",
                  letterSpacing: "-0.015em",
                }}
              >
                {r.role}
                <span style={{ fontWeight: 500, color: "var(--cat-text-secondary)" }}>
                  {" "}
                  · {r.company}
                </span>
              </p>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.55,
                  color: "var(--cat-text)",
                  margin: 0,
                  fontFamily: FB,
                }}
              >
                {r.line}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Option A — Now (projects + figures) then trajectory one-liners */
function OptionNowTrajectory() {
  return (
    <section className="catalog-section" style={{ borderTop: "1px solid var(--cat-rule)" }}>
      <div className="catalog-panel" style={{ maxWidth: "1040px" }}>
        <SectionLabel
          option="Option A"
          title="Now + Trajectory"
          blurb="Current builds with full figures on top. Career compressed to one effective line per role below."
        />

        <div className="catalog-section-header" style={{ marginBottom: "1.25rem" }}>
          <p
            style={{
              fontSize: "13px",
              letterSpacing: "0.1em",
              color: "var(--cat-text-tertiary)",
              textTransform: "uppercase",
              margin: 0,
              fontWeight: 600,
              fontFamily: F,
            }}
          >
            Now
          </p>
          <p
            style={{
              fontSize: "13px",
              letterSpacing: "0.1em",
              color: "var(--cat-text-tertiary)",
              textTransform: "uppercase",
              margin: 0,
              fontWeight: 600,
              fontFamily: F,
            }}
          >
            02 Projects
          </p>
        </div>

        <div className="two-up-grid" style={{ marginBottom: "2.5rem" }}>
          {projects.map((p) => (
            <CompactProjectCard key={p.title} project={p} />
          ))}
        </div>

        <div className="catalog-section-header" style={{ marginBottom: "0.5rem" }}>
          <p
            style={{
              fontSize: "13px",
              letterSpacing: "0.1em",
              color: "var(--cat-text-tertiary)",
              textTransform: "uppercase",
              margin: 0,
              fontWeight: 600,
              fontFamily: F,
            }}
          >
            Trajectory
          </p>
          <p
            style={{
              fontSize: "13px",
              letterSpacing: "0.1em",
              color: "var(--cat-text-tertiary)",
              textTransform: "uppercase",
              margin: 0,
              fontWeight: 600,
              fontFamily: F,
            }}
          >
            Hexagon · 2013 — Present
          </p>
        </div>

        <TrajectoryList />
      </div>
    </section>
  );
}

/** Option B — vertical spine: Now (with figures) → roles */
function OptionTimelineSpine() {
  const nodes = [
    {
      kind: "now" as const,
      period: "NOW",
      title: "Building in public",
      subtitle: "Personal products alongside the day job",
    },
    ...roles.map((r) => ({
      kind: "role" as const,
      period: r.period,
      title: r.role,
      subtitle: r.company,
      line: r.line,
    })),
  ];

  return (
    <section className="catalog-section" style={{ borderTop: "1px solid var(--cat-rule)" }}>
      <div className="catalog-panel" style={{ maxWidth: "1040px" }}>
        <SectionLabel
          option="Option B"
          title="Timeline spine"
          blurb="One vertical path. Now sits at the top with the same project figures; roles follow as spine entries."
        />

        <div style={{ position: "relative", paddingLeft: "1.75rem" }}>
          {/* spine line */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "5px",
              top: "8px",
              bottom: "8px",
              width: "1px",
              background: "var(--cat-rule-strong)",
            }}
          />

          {nodes.map((node, i) => (
            <div
              key={node.period + i}
              style={{
                position: "relative",
                marginBottom: i === nodes.length - 1 ? 0 : "2rem",
              }}
            >
              {/* dot */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  left: "-1.75rem",
                  top: "6px",
                  width: "11px",
                  height: "11px",
                  borderRadius: "50%",
                  background:
                    node.kind === "now" ? "var(--key-apricot)" : "var(--cat-bg)",
                  border: `2px solid ${
                    node.kind === "now" ? "var(--key-apricot)" : "var(--cat-text)"
                  }`,
                  boxSizing: "border-box",
                }}
              />

              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--cat-text-tertiary)",
                  fontWeight: 600,
                  fontFamily: F,
                  margin: "0 0 6px",
                }}
              >
                {node.period}
              </p>
              <h3
                style={{
                  fontSize: node.kind === "now" ? "22px" : "18px",
                  fontWeight: 600,
                  margin: "0 0 4px",
                  fontFamily: F,
                  letterSpacing: "-0.015em",
                  color: "var(--cat-text)",
                }}
              >
                {node.title}
                {node.kind === "role" && (
                  <span style={{ fontWeight: 500, color: "var(--cat-text-secondary)" }}>
                    {" "}
                    · {node.subtitle}
                  </span>
                )}
              </h3>

              {node.kind === "now" ? (
                <>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--cat-text-secondary)",
                      margin: "0 0 1.25rem",
                      fontFamily: FB,
                    }}
                  >
                    {node.subtitle}
                  </p>
                  <div className="two-up-grid">
                    {projects.map((p) => (
                      <CompactProjectCard key={p.title} project={p} />
                    ))}
                  </div>
                </>
              ) : (
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.55,
                    color: "var(--cat-text)",
                    margin: 0,
                    fontFamily: FB,
                    maxWidth: "640px",
                  }}
                >
                  {"line" in node ? node.line : null}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SectionBlendPreview() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--cat-bg)",
        color: "var(--cat-text)",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(92, 101, 83, 0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--cat-rule)",
          padding: "0.9rem 2rem",
        }}
      >

        <div
          style={{
            maxWidth: "1040px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--cat-text-tertiary)",
                margin: "0 0 2px",
                fontFamily: F,
                fontWeight: 600,
              }}
            >
              Design preview · not on homepage
            </p>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 600,
                margin: 0,
                fontFamily: F,
              }}
            >
              Experience × Current work — two layouts
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <a
              href="#option-a"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: F,
                color: "var(--cat-text)",
                textDecoration: "none",
                border: "1px solid var(--cat-rule-strong)",
                borderRadius: "8px",
                padding: "8px 14px",
              }}
            >
              Option A
            </a>
            <a
              href="#option-b"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: F,
                color: "var(--cat-text)",
                textDecoration: "none",
                border: "1px solid var(--cat-rule-strong)",
                borderRadius: "8px",
                padding: "8px 14px",
              }}
            >
              Option B
            </a>
            <Link
              href="/"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: F,
                color: "var(--cat-bg)",
                background: "var(--cat-text)",
                textDecoration: "none",
                borderRadius: "8px",
                padding: "8px 14px",
              }}
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </header>

      <main>
        <div id="option-a">
          <OptionNowTrajectory />
        </div>
        <div id="option-b">
          <OptionTimelineSpine />
        </div>
      </main>

      <footer
        style={{
          padding: "2rem",
          textAlign: "center",
          fontSize: "12px",
          color: "var(--cat-text-tertiary)",
          fontFamily: F,
          borderTop: "1px solid var(--cat-rule)",
        }}
      >
        Preview only · Volve & PropScan figures reused from the live site · homepage unchanged
      </footer>

      <style>{`
        @media (max-width: 640px) {
          .blend-role-row {
            grid-template-columns: 1fr !important;
            gap: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
