import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import {
  CopilotFigure,
  Smart3DFigure,
  VolveFigure,
  StructraFigure,
  AutoSignalFigure,
  Unit100Figure,
} from "@/components/figures/figures";

type Project = {
  id: string;
  key: "sage" | "sky" | "apricot" | "lavender" | "steel" | "ochre";
  label: string;
  badge?: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  figure: React.ReactNode;
  cta?: { label: string; href: string; external?: boolean };
};

const projects: Project[] = [
  {
    id: "card-u100",
    key: "ochre",
    label: "Industrial AI",
    badge: "Live demo",
    title: "Factory maintenance planning",
    tagline: "Helps a factory planner turn scattered records into a clear maintenance job pack.",
    description:
      "Factories plan big maintenance windows years ahead. Every exchanger, pump, and vessel needs a job pack before anyone opens it. Planners still build those packs by hand, hunting inspections, old work orders, sensor history, drawings, and permits. This demo pulls those sources together, drafts the pack, and shows where every number came from. The model writes the explanation; hours, parts, and safety steps come from the records. Missing or conflicting evidence shows up as a flag, not a guess. The planner edits, locks, and exports.",
    tags: ["Azure OpenAI", "FastAPI", "React", "Plant data"],
    figure: <Unit100Figure />,
    cta: {
      label: "Try the live demo",
      href: "/u100/",
      external: true,
    },
  },
  {
    id: "card-structra",
    key: "lavender",
    label: "Vision AI",
    badge: "App Store",
    title: "Structra",
    tagline: "Vision-based defect detection from inspection photos.",
    description:
      "Mobile inspection app that uses a vision LLM to find, classify, and localise defects in photos taken on site. Each finding is boxed on the source image and rolled into a severity-graded report.",
    tags: ["Gemini 2.5 Flash", "Structured JSON", "React Native", "Supabase"],
    figure: <StructraFigure />,
    cta: {
      label: "View on the App Store",
      href: "https://apps.apple.com/us/app/structra-inspect/id6795109088",
      external: true,
    },
  },
  {
    id: "card-volve",
    key: "apricot",
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
    id: "card-autosignal",
    key: "steel",
    label: "Vehicle Research AI",
    badge: "Live demo",
    title: "AutoSignal",
    tagline: "NHTSA-backed research — TSBs, recalls, and complaints in plain language.",
    description:
      "Ask natural-language questions about vehicle safety and reliability. AutoSignal grounds answers in NHTSA technical service bulletins, recalls, complaints, and investigations — a live research surface for buyers and operators.",
    tags: ["NHTSA", "RAG", "FastAPI", "React", "Postgres"],
    figure: <AutoSignalFigure />,
    cta: {
      label: "Explore live demo",
      href: "/autosignal/",
      external: true,
    },
  },
  {
    id: "card-nl-query",
    key: "sky",
    label: "Data Intelligence",
    title: "AI Agents & Natural Language Querying",
    tagline: "Plain-language questions, answered by the plant design model.",
    description:
      "Delivered enterprise-grade AI agents enabling natural-language queries against plant design data — engineers ask about lines, equipment, and connectivity in plain English and get precise, model-grounded answers, accelerating access to mission-critical design data.",
    tags: ["NL2SQL", "Enterprise search", "Decision support"],
    figure: <Smart3DFigure variant="compact" />,
  },
  {
    id: "card-copilot",
    key: "sage",
    label: "Generative AI",
    title: "Enterprise AI Copilot System",
    tagline: "LLM-based agents for complex 3D engineering workflows.",
    description:
      "Led the strategy and development of an LLM-based agentic system automating complex 3D engineering workflows — saving global engineering teams dozens of hours monthly, with a clear path to hundreds as coverage grows.",
    tags: ["LLM agents", "Product strategy", "3D engineering", "Automation"],
    figure: <CopilotFigure />,
  },
];

function ProjectCta({ project }: { project: Project }) {
  if (!project.cta) return null;
  const style = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.72rem",
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "var(--cat-on-accent)",
    background: "var(--cat-accent)",
    border: "1px solid var(--cat-ink)",
    boxShadow: "2px 2px 0 var(--cat-ink)",
    borderRadius: 0,
    padding: "0.65rem 0.9rem",
    textDecoration: "none",
    fontFamily: "var(--cat-font-mono)",
  };

  if (project.cta.external) {
    const isHttp = project.cta.href.startsWith("http");
    return (
      <a
        href={project.cta.href}
        data-testid={`link-explore-${project.key}`}
        style={style}
        {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {project.cta.label}
        <ArrowRight size={14} strokeWidth={2} />
      </a>
    );
  }

  return (
    <Link href={project.cta.href} data-testid={`link-explore-${project.key}`} style={style}>
      {project.cta.label}
      <ArrowRight size={14} strokeWidth={2} />
    </Link>
  );
}

function ProjectItem({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      id={project.id}
      className={`project-item${open ? " is-open" : ""}`}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      data-testid={`card-project-${project.key}`}
      onClick={() => setOpen((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((v) => !v);
        }
      }}
    >
      <div className="project-row">
        <div className="project-thumb" aria-hidden="true">
          {project.figure}
        </div>
        <span className="project-label">{project.label}</span>
        <span className="project-copy">
          <span className="project-title" data-testid={`text-project-title-${project.key}`}>
            {project.title}
            {project.badge && <span className="project-badge">{project.badge}</span>}
          </span>
          <span className="project-desc">{project.tagline}</span>
        </span>
        {project.badge === "Live demo" && (
          <span className="project-go" aria-hidden="true">
            →
          </span>
        )}
      </div>

      <div className="project-expand">
        <div className="project-expand-inner">
          <div className="project-expand-figure" aria-hidden="true">
            {project.figure}
          </div>
          <div className="project-expand-body">
            <p style={{ margin: 0 }} data-testid={`text-project-desc-${project.key}`}>
              {project.description}
            </p>
            <div className="project-expand-tags" onClick={(e) => e.stopPropagation()}>
              <ProjectCta project={project} />
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
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section
      id="work"
      className="catalog-section"
      style={{ background: "transparent" }}
      data-testid="section-work"
    >
      <div className="catalog-panel">
        <div className="project-list-intro">
          <p className="project-list-label" data-testid="text-work-label">
            Selected work
          </p>
          <h2 className="project-list-title" data-testid="text-work-title">
            Built for one hard job each.
          </h2>
          <p className="project-list-hint" data-testid="text-work-hint">
            Hover or tap any row for the full story.
          </p>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <ProjectItem key={project.key} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
