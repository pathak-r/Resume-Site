import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import {
  CopilotFigure,
  Smart3DFigure,
  VolveFigure,
  PropScanFigure,
} from "@/components/figures/figures";

const F = "var(--cat-font)";
const FB = "var(--cat-font-body)";

type Project = {
  id: string;
  key: "sage" | "sky" | "apricot" | "lavender";
  keyColor: string;
  label: string;
  badge?: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  figure: React.ReactNode;
  cta?: { label: string; href: string };
};

const projects: Project[] = [
  {
    id: "card-copilot",
    key: "sage",
    keyColor: "var(--key-sage)",
    label: "Generative AI",
    title: "Enterprise AI Copilot System",
    tagline: "LLM-based agents for complex 3D engineering workflows.",
    description:
      "Led the strategy and development of an LLM-based agentic system automating complex 3D engineering workflows — saving global engineering teams dozens of hours monthly, with a clear path to hundreds as coverage grows.",
    tags: ["LLM agents", "Product strategy", "3D engineering", "Automation"],
    figure: <CopilotFigure />,
  },
  {
    id: "card-volve",
    key: "apricot",
    keyColor: "var(--key-apricot)",
    label: "Geo-Agentic AI",
    badge: "Live demo",
    title: "Volve Field RAG Explorer",
    tagline: "Agentic RAG for Equinor's open Volve oil field dataset.",
    description:
      "Daily drilling reports, production data, and well completion reports — structured and unstructured — ingested into an agentic RAG system. Visualises production trends and answers operator questions about well performance in natural language.",
    tags: ["FAISS", "OpenAI", "FastAPI", "React", "Python"],
    figure: <VolveFigure />,
    cta: { label: "Explore live demo", href: "/geo-agentic-int" },
  },
  {
    id: "card-nl-query",
    key: "sky",
    keyColor: "var(--key-sky)",
    label: "Data Intelligence",
    title: "AI Agents & Natural Language Querying",
    tagline: "Plain-language questions, answered by the plant design model.",
    description:
      "Delivered enterprise-grade AI agents enabling natural-language queries against plant design data — engineers ask about lines, equipment, and connectivity in plain English and get precise, model-grounded answers, accelerating access to mission-critical design data.",
    tags: ["NL2SQL", "Enterprise search", "Decision support"],
    figure: <Smart3DFigure variant="compact" />,
  },
  {
    id: "card-propscan",
    key: "lavender",
    keyColor: "var(--key-lavender)",
    label: "Vision AI",
    badge: "TestFlight",
    title: "PropScan",
    tagline: "Vision-LLM defect detection for property inspections.",
    description:
      "Mobile inspection app using Gemini 2.5 Flash as a vision LLM to detect, classify, and localise construction defects from user-captured photos. Outputs annotated photos and an aggregated defect register with an overall site verdict.",
    tags: ["Gemini 2.5 Flash", "Structured JSON", "React Native", "Supabase"],
    figure: <PropScanFigure />,
  },
];

function ProjectCard({ project, flip }: { project: Project; flip: boolean }) {
  const text = (
    <div>
      <p
        style={{
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: project.keyColor,
          fontWeight: 600,
          margin: "0 0 10px",
          fontFamily: F,
        }}
      >
        {project.label}
        {project.badge && (
          <span
            style={{
              marginLeft: "8px",
              background: project.keyColor,
              color: "var(--cat-on-accent)",
              borderRadius: "4px",
              padding: "2px 8px",
              fontSize: "10px",
              letterSpacing: "0.08em",
            }}
          >
            {project.badge}
          </span>
        )}
      </p>

      <h2
        style={{
          fontSize: "26px",
          fontWeight: 600,
          margin: "0 0 6px",
          lineHeight: 1.2,
          color: "var(--cat-text)",
          letterSpacing: "-0.015em",
          fontFamily: F,
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
          margin: "0 0 12px",
          lineHeight: 1.55,
          fontFamily: FB,
        }}
      >
        {project.tagline}
      </p>

      <p
        style={{
          fontSize: "15px",
          lineHeight: 1.7,
          color: "var(--cat-text)",
          margin: "0 0 16px",
          fontFamily: FB,
        }}
        data-testid={`text-project-desc-${project.key}`}
      >
        {project.description}
      </p>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
        {project.cta && (
          <Link
            href={project.cta.href}
            data-testid={`link-explore-${project.key}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--cat-on-accent)",
              background: project.keyColor,
              borderRadius: "9px",
              padding: "9px 16px",
              textDecoration: "none",
              fontFamily: F,
              letterSpacing: "0.01em",
            }}
          >
            {project.cta.label}
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        )}
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="key-tag"
            data-testid={`chip-tag-${project.key}-${tag.replace(/\s+/g, "-").toLowerCase()}`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  const figure = <div>{project.figure}</div>;

  return (
    <div
      id={project.id}
      className={`key-card key-card--${project.key}`}
      style={{ marginBottom: "1.25rem", scrollMarginTop: "80px" }}
      data-testid={`card-project-${project.key}`}
    >
      <div className={flip ? "project-card-grid project-card-grid--flip" : "project-card-grid"}>
        {figure}
        {text}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="work" className="catalog-section" style={{ borderTop: "none", paddingTop: "1.5rem" }} data-testid="section-work">
      <div className="catalog-panel">
        {projects.map((project, i) => (
          <ProjectCard key={project.key} project={project} flip={i % 2 === 1} />
        ))}
      </div>

      <style>{`
        .project-card-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 2rem;
          align-items: center;
        }
        .project-card-grid--flip > :first-child { order: 2; }
        .project-card-grid--flip > :last-child { order: 1; }
        @media (max-width: 767px) {
          .project-card-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          .project-card-grid--flip > :first-child { order: 1; }
          .project-card-grid--flip > :last-child { order: 2; }
        }
      `}</style>
    </section>
  );
}
