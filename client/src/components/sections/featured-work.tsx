import { Link } from "wouter";
import EntryRow from "@/components/catalog/entry-row";

type Project = {
  entryNumber: string;
  numeral: string;
  label: string;
  subLabel?: string;
  title: string;
  tagline?: string;
  paragraphs: string[];
  tags: string[];
  href?: string;
  external?: boolean;
};

const projects: Project[] = [
  {
    entryNumber: "№ 01",
    numeral: "01",
    label: "Generative AI",
    title: "Enterprise AI Copilot System",
    tagline: "LLM-based agents for complex 3D engineering workflows.",
    paragraphs: [
      "Led the strategy and development of an LLM-based agentic system designed to automate complex 3D engineering workflows. The product transformed how global engineering teams operate, saving hundreds of hours monthly.",
    ],
    tags: ["LLM agents", "Product strategy", "3D engineering", "Automation"],
  },
  {
    entryNumber: "№ 02",
    numeral: "02",
    label: "Data Intelligence",
    title: "AI Agents & Natural Language Querying",
    tagline: "Natural-language access to mission-critical enterprise data.",
    paragraphs: [
      "Delivered enterprise-grade AI agents enabling natural-language queries on complex databases, significantly improving access to mission-critical data and accelerating cross-functional decision-making.",
    ],
    tags: ["NL2SQL", "Data accessibility", "Enterprise search", "Decision support"],
  },
];

function ProjectBody({ project, index }: { project: Project; index: number }) {
  return (
    <>
      <p className="catalog-meta" style={{ marginBottom: "4px" }}>Project</p>
      <h2
        style={{
          fontSize: "var(--cat-fs-h2-project)",
          fontWeight: 600,
          margin: "0 0 6px",
          lineHeight: 1.15,
          color: "var(--cat-text)",
          letterSpacing: "-0.025em",
        }}
        data-testid={`text-project-title-${index}`}
      >
        {project.title}
      </h2>
      {project.tagline && (
        <p
          style={{
            fontSize: "14px",
            color: "var(--cat-text-secondary)",
            fontStyle: "italic",
            margin: "0 0 16px",
          }}
        >
          {project.tagline}
        </p>
      )}
      {project.paragraphs.map((p, i) => (
        <p
          key={i}
          style={{
            fontSize: "14px",
            lineHeight: 1.7,
            color: i === 0 ? "var(--cat-text)" : "var(--cat-text-secondary)",
            margin: i === project.paragraphs.length - 1 ? "0 0 18px" : "0 0 14px",
          }}
          data-testid={`text-project-desc-${index}-${i}`}
        >
          {p}
        </p>
      ))}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="catalog-tag"
            data-testid={`chip-tag-${tag.replace(/\s+/g, "-").toLowerCase()}`}
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}

export default function FeaturedWork() {
  return (
    <section id="work" className="catalog-section" style={{ paddingTop: "1.5rem" }} data-testid="section-work">
      <div className="px-4">
        <div className="catalog-panel">
          <div className="catalog-section-header">
            <h2
              style={{
                fontSize: "var(--cat-fs-eyebrow)",
                letterSpacing: "var(--cat-ls-eyebrow)",
                color: "var(--cat-text-tertiary)",
                textTransform: "uppercase",
                margin: 0,
                fontWeight: 500,
              }}
              data-testid="heading-selected-work"
            >
              Selected Work
            </h2>
            <p
              style={{
                fontSize: "var(--cat-fs-eyebrow)",
                letterSpacing: "var(--cat-ls-eyebrow)",
                color: "var(--cat-text-tertiary)",
                textTransform: "uppercase",
                margin: 0,
                fontWeight: 500,
              }}
            >
              {String(projects.length).padStart(2, "0")} Entries
            </p>
          </div>

          {projects.map((project, index) => (
            <div key={project.entryNumber} data-testid={`card-project-${index}`}>
              {index > 0 && <hr className="catalog-divider" />}
              <EntryRow
                entryNumber={project.entryNumber}
                numeral={project.numeral}
                label={project.label}
                subLabel={project.subLabel}
              >
                {project.href ? (
                  project.external ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      <ProjectBody project={project} index={index} />
                    </a>
                  ) : (
                    <Link
                      href={project.href}
                      style={{ color: "inherit", textDecoration: "none", display: "block" }}
                    >
                      <ProjectBody project={project} index={index} />
                    </Link>
                  )
                ) : (
                  <ProjectBody project={project} index={index} />
                )}
              </EntryRow>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
