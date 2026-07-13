import { CopilotFigure, Smart3DFigure } from "@/components/figures/figures";

type Project = {
  key: "sage" | "sky" | "apricot" | "lavender";
  keyColor: string;
  label: string;
  title: string;
  tagline: string;
  paragraphs: string[];
  tags: string[];
  figure: React.ReactNode;
  wide?: boolean;
};

const projects: Project[] = [
  {
    key: "sage",
    keyColor: "var(--key-sage)",
    label: "Generative AI",
    title: "Enterprise AI Copilot System",
    tagline: "LLM-based agents for complex 3D engineering workflows.",
    paragraphs: [
      "Led the strategy and development of an LLM-based agentic system designed to automate complex 3D engineering workflows. The product transformed how global engineering teams operate, saving hundreds of hours monthly.",
    ],
    tags: ["LLM agents", "Product strategy", "3D engineering", "Automation"],
    figure: <CopilotFigure />,
  },
  {
    key: "sky",
    keyColor: "var(--key-sky)",
    label: "Data Intelligence",
    title: "AI Agents & Natural Language Querying",
    tagline: "Plain-language questions, answered by the plant design model.",
    paragraphs: [
      "Delivered enterprise-grade AI agents enabling natural-language queries against plant design data — engineers ask about lines, equipment, and connectivity in plain English and get precise, model-grounded answers, accelerating access to mission-critical design data.",
    ],
    tags: ["NL2SQL", "Enterprise search", "Decision support"],
    figure: <Smart3DFigure />,
    wide: true,
  },
];

function ProjectCard({ project }: { project: Project }) {
  const body = (
    <>
      <p
        style={{
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: project.keyColor,
          fontWeight: 600,
          fontFamily: "var(--cat-font)",
          margin: "0 0 10px",
        }}
      >
        {project.label}
      </p>
      <h2
        style={{
          fontSize: "28px",
          fontWeight: 600,
          margin: "0 0 6px",
          lineHeight: 1.2,
          color: "var(--cat-text)",
          letterSpacing: "-0.015em",
          fontFamily: "var(--cat-font)",
        }}
        data-testid={`text-project-title-${project.key}`}
      >
        {project.title}
      </h2>
      <p
        style={{
          fontSize: "15px",
          color: "var(--cat-text-secondary)",
          fontStyle: "italic",
          margin: "0 0 14px",
          fontFamily: "var(--cat-font-body)",
        }}
      >
        {project.tagline}
      </p>
      {project.paragraphs.map((p, i) => (
        <p
          key={i}
          style={{
            fontSize: "16px",
            lineHeight: 1.7,
            color: "var(--cat-text)",
            margin: "0 0 18px",
            fontFamily: "var(--cat-font-body)",
          }}
          data-testid={`text-project-desc-${project.key}-${i}`}
        >
          {p}
        </p>
      ))}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="key-tag"
            data-testid={`chip-tag-${tag.replace(/\s+/g, "-").toLowerCase()}`}
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );

  return (
    <div
      className={`key-card key-card--${project.key}`}
      data-testid={`card-project-${project.key}`}
      style={{ marginBottom: "1.25rem" }}
    >
      {project.wide ? (
        <div>
          <div style={{ marginBottom: "1.5rem" }}>{body}</div>
          {project.figure}
        </div>
      ) : (
        <div className="work-card-grid">
          <div>{project.figure}</div>
          <div>{body}</div>
        </div>
      )}
    </div>
  );
}

export default function FeaturedWork() {
  return (
    <section id="work" className="catalog-section" style={{ paddingTop: "1.5rem" }} data-testid="section-work">
      <div className="px-4">
        <div className="catalog-panel" style={{ maxWidth: "1040px" }}>
          <div className="catalog-section-header">
            <h2
              style={{
                fontSize: "13px",
                letterSpacing: "0.1em",
                color: "var(--cat-text-tertiary)",
                textTransform: "uppercase",
                margin: 0,
                fontWeight: 600,
                fontFamily: "var(--cat-font)",
              }}
              data-testid="heading-selected-work"
            >
              Selected Work
            </h2>
            <p
              style={{
                fontSize: "13px",
                letterSpacing: "0.1em",
                color: "var(--cat-text-tertiary)",
                textTransform: "uppercase",
                margin: 0,
                fontWeight: 600,
                fontFamily: "var(--cat-font)",
              }}
            >
              {String(projects.length).padStart(2, "0")} Projects
            </p>
          </div>

          {projects.map((project) => (
            <ProjectCard key={project.key} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
