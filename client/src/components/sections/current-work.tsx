import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { VolveFigure, PropScanFigure } from "@/components/figures/figures";

type Project = {
  key: "sage" | "sky" | "apricot" | "lavender";
  keyColor: string;
  label: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  figure: React.ReactNode;
  cta: { label: string; href: string } | null;
};

const projects: Project[] = [
  {
    key: "apricot",
    keyColor: "var(--key-apricot)",
    label: "Geo-Agentic AI · Live demo",
    title: "Volve Field RAG Explorer",
    tagline: "Agentic RAG for Equinor's open Volve oil field dataset.",
    description:
      "Daily drilling reports, production data, and well completion reports, structured and unstructured, ingested into an agentic RAG system. Visualises production trends and answers operator questions about well performance in natural language.",
    tags: ["FAISS", "OpenAI", "FastAPI", "React", "Recharts", "Python"],
    figure: <VolveFigure />,
    cta: { label: "Explore live demo", href: "/geo-agentic-int" },
  },
  {
    key: "lavender",
    keyColor: "var(--key-lavender)",
    label: "Vision AI · TestFlight",
    title: "PropScan",
    tagline: "Vision-LLM defect detection for property inspections.",
    description:
      "Mobile inspection app using Gemini 2.5 Flash as a vision LLM to detect, classify, and localise construction defects from user-captured photos. Outputs annotated photos and an aggregated defect register with an overall site verdict.",
    tags: ["Gemini 2.5 Flash", "Structured JSON", "React Native", "Node.js", "Supabase"],
    figure: <PropScanFigure />,
    cta: null,
  },
];

function ProjectCard({ project }: { project: Project }) {
  const inner = (
    <div
      className={`key-card key-card--${project.key}`}
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
      data-testid={`col-current-${project.title.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <div style={{ marginBottom: "1.25rem" }}>{project.figure}</div>

      <p
        style={{
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: project.keyColor,
          fontWeight: 600,
          margin: "0 0 10px",
          fontFamily: "var(--cat-font)",
        }}
      >
        {project.label}
      </p>

      <h3
        style={{
          fontSize: "22px",
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: "-0.015em",
          color: "var(--cat-text)",
          margin: "0 0 6px",
          fontFamily: "var(--cat-font)",
        }}
        data-testid={`heading-current-${project.title.replace(/\s+/g, "-").toLowerCase()}`}
      >
        {project.title}
      </h3>

      <p
        style={{
          fontSize: "14px",
          color: "var(--cat-text-secondary)",
          fontStyle: "italic",
          margin: "0 0 12px",
          lineHeight: 1.55,
          fontFamily: "var(--cat-font-body)",
        }}
      >
        {project.tagline}
      </p>

      <p
        style={{
          fontSize: "15px",
          lineHeight: 1.7,
          color: "var(--cat-text)",
          margin: "0 0 18px",
          fontFamily: "var(--cat-font-body)",
        }}
      >
        {project.description}
      </p>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: project.cta ? "18px" : 0 }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="key-tag"
            data-testid={`chip-tag-current-${tag.replace(/\s+/g, "-").toLowerCase()}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {project.cta && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--cat-on-accent)",
            background: project.keyColor,
            border: "none",
            borderRadius: "9px",
            padding: "10px 18px",
            marginTop: "auto",
            fontFamily: "var(--cat-font)",
            letterSpacing: "0.01em",
            alignSelf: "flex-start",
          }}
          data-testid={`link-explore-${project.title.replace(/\s+/g, "-").toLowerCase()}`}
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
        {inner}
      </Link>
    );
  }

  return inner;
}

export default function CurrentWork() {
  return (
    <section className="catalog-section" data-testid="section-current-work" style={{ borderTop: "none" }}>
      <div className="catalog-panel" style={{ maxWidth: "1040px" }}>
        <div className="catalog-section-header">
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
            data-testid="heading-current-work"
          >
            What I'm Currently Working On
          </p>
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
            02 Projects
          </p>
        </div>

        <div className="two-up-grid">
          {projects.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
