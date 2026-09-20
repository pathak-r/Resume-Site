import { useState, type ReactNode } from "react";
import { Link } from "wouter";
import InterviewAgent from "@/components/agent/interview-agent";
import {
  CopilotFigure,
  Smart3DFigure,
  VolveFigure,
  StructraFigure,
  AutoSignalFigure,
  Unit100Figure,
  JevFigure,
} from "@/components/figures/figures";

type Project = {
  id: string;
  key: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  figure: ReactNode;
  cta?: { label: string; href: string; external?: boolean };
};

const projects: Project[] = [
  {
    id: "card-jev",
    key: "jev",
    title: "How Good is JEV",
    tagline: "Jev vs GPT-4.1 on the same intent questions.",
    description:
      "Jev is a fast model that picks an answer. It does not chat. This page puts it next to GPT-4.1. Both read the same sentence and choose one of 150 intents. You see the pick, the time, and the cost.",
    tags: ["TypeSafe Jev", "GPT-4.1", "CLINC150", "React"],
    figure: <JevFigure />,
    cta: { label: "Try", href: "/how-good-is-jev", external: true },
  },
  {
    id: "card-u100",
    key: "ochre",
    title: "Factory maintenance planning",
    tagline: "Turns scattered plant records into a job pack.",
    description:
      "Factories plan big maintenance windows years ahead. Every exchanger, pump, and vessel needs a job pack before anyone opens it. Planners still build those packs by hand, hunting inspections, old work orders, sensor history, drawings, and permits. This demo pulls those sources together, drafts the pack, and shows where every number came from. The model writes the explanation; hours, parts, and safety steps come from the records. Missing or conflicting evidence shows up as a flag, not a guess. The planner edits, locks, and exports.",
    tags: ["Azure OpenAI", "FastAPI", "React", "Plant data"],
    figure: <Unit100Figure />,
    cta: { label: "Try", href: "/u100/", external: true },
  },
  {
    id: "card-structra",
    key: "lavender",
    title: "Structra",
    tagline: "Finds defects in inspection photos.",
    description:
      "Take a photo on site. The app finds defects, boxes them on the image, and builds a severity report you can hand off.",
    tags: ["Gemini 2.5 Flash", "Structured JSON", "React Native", "Supabase"],
    figure: <StructraFigure />,
    cta: {
      label: "App Store",
      href: "https://apps.apple.com/us/app/structra-inspect/id6795109088",
      external: true,
    },
  },
  {
    id: "card-volve",
    key: "apricot",
    title: "Volve Field RAG Explorer",
    tagline: "Ask questions about an open oil field dataset.",
    description:
      "Equinor published the Volve field data. This demo reads the reports and production numbers, then answers questions in plain English.",
    tags: ["FAISS", "OpenAI", "FastAPI", "React", "Python"],
    figure: <VolveFigure />,
    cta: { label: "Try", href: "/geo-agentic-int" },
  },
  {
    id: "card-autosignal",
    key: "steel",
    title: "AutoSignal",
    tagline: "Vehicle safety answers from NHTSA records.",
    description:
      "Ask about a car in plain language. Answers come from technical service bulletins, recalls, complaints, and investigations — with sources.",
    tags: ["NHTSA", "RAG", "FastAPI", "React", "Postgres"],
    figure: <AutoSignalFigure />,
    cta: { label: "Try", href: "/autosignal/", external: true },
  },
  {
    id: "card-nl-query",
    key: "sky",
    title: "AI Agents & Natural Language Querying",
    tagline: "Ask the plant design model in plain English.",
    description:
      "The plant model lives in thousands of tables. Engineers used to write SQL. Now they ask for lines, equipment, and connections in ordinary sentences.",
    tags: ["NL2SQL", "Enterprise search", "Decision support"],
    figure: <Smart3DFigure variant="compact" />,
  },
  {
    id: "card-copilot",
    key: "sage",
    title: "Enterprise AI Copilot",
    tagline: "LLM agents for 3D engineering work.",
    description:
      "I led the plan and build for agents that do 3D engineering work from natural language. Teams save hours each month. Coverage is still growing.",
    tags: ["LLM agents", "Product strategy", "3D engineering", "Automation"],
    figure: <CopilotFigure />,
  },
];

function RowCta({ project }: { project: Project }) {
  if (!project.cta) return null;
  const className = "row-cta";

  if (project.cta.external) {
    const isHttp = project.cta.href.startsWith("http");
    return (
      <a
        href={project.cta.href}
        data-testid={`link-explore-${project.key}`}
        className={className}
        {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {project.cta.label} →
      </a>
    );
  }

  return (
    <Link href={project.cta.href} data-testid={`link-explore-${project.key}`} className={className}>
      {project.cta.label} →
    </Link>
  );
}

function AgentItem() {
  const [open, setOpen] = useState(false);

  return (
    <div
      id="interview"
      className={`project-item agent-item${open ? " is-open" : ""}`}
      data-testid="card-project-agent"
    >
      <div
        className="project-row"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        <span className="project-copy">
          <span className="agent-title" data-testid="text-project-title-agent">
            rohit.agent
          </span>
          <span className="project-desc">A screening call, without the call.</span>
        </span>
        <span className="project-live">live</span>
      </div>
      <div className="project-expand">
        <div className="project-expand-inner is-agent" onClick={(e) => e.stopPropagation()}>
          <InterviewAgent onPin={() => setOpen(true)} />
        </div>
      </div>
    </div>
  );
}

function ProjectItem({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <div id={project.id} className={`project-item${open ? " is-open" : ""}`} data-testid={`card-project-${project.key}`}>
      <div
        className="project-row"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        <span className="project-title" data-testid={`text-project-title-${project.key}`}>
          {project.title}
        </span>
        {project.cta && (
          <span onClick={(e) => e.stopPropagation()}>
            <RowCta project={project} />
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
            <div className="project-expand-tags">
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
    <>
      <section
        className="catalog-section"
        style={{ background: "transparent" }}
        data-testid="section-agent"
      >
        <div className="catalog-panel">
          <p className="work-label">Ask me</p>
          <div className="agent-list">
            <AgentItem />
          </div>
        </div>
      </section>

      <section id="work" className="catalog-section" style={{ background: "transparent" }} data-testid="section-work">
        <div className="catalog-panel">
          <p className="work-label">Work</p>
          <div className="project-list">
            {projects.map((project) => (
              <ProjectItem key={project.key} project={project} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
