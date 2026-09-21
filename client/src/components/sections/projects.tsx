import { useState, type PointerEvent, type ReactNode } from "react";
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

type ProjectCta = { label: string; href: string; external?: boolean };

type Project = {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  figure: ReactNode;
  cta?: ProjectCta;
};

const featuredJev: Project = {
  id: "card-jev",
  key: "jev",
  title: "JEV intent-routing benchmark",
  subtitle: "",
  description:
    "Since JEV returns typed probabilistic decisions instead of generating text, it avoids output-token generation costs and is naturally well suited to routing and other decision-heavy tasks. I put that to the test against strong LLM baselines commonly used for routing, including GPT-4.1 and GPT-5.6 Sol, across three intent-classification benchmarks: CLINC150, BANKING77, and HWU64.",
  tags: ["TypeSafe Jev", "GPT-4.1", "GPT-5.6 Sol", "CLINC150"],
  figure: <JevFigure />,
  cta: { label: "Try →", href: "/how-good-is-jev", external: true },
};

const projects: Project[] = [
  {
    id: "card-u100",
    key: "ochre",
    title: "Factory maintenance planner",
    subtitle: "Turns scattered plant records into a job pack.",
    description:
      "Pulls inspections, work orders, sensor history, drawings, and permits into a sourced maintenance job pack. Missing or conflicting evidence is flagged. The planner edits, locks, and exports.",
    tags: ["Azure OpenAI", "FastAPI", "React", "Plant data"],
    figure: <Unit100Figure />,
    cta: { label: "Try →", href: "/u100/", external: true },
  },
  {
    id: "card-structra",
    key: "lavender",
    title: "Structra",
    subtitle: "Construction defects, found in inspection photos.",
    description:
      "Take a photo on site. The app finds defects, marks them on the image, and builds a severity report you can hand off.",
    tags: ["Gemini 2.5 Flash", "Structured JSON", "React Native", "Supabase"],
    figure: <StructraFigure />,
    cta: {
      label: "App Store ↗",
      href: "https://apps.apple.com/us/app/structra-inspect/id6795109088",
      external: true,
    },
  },
  {
    id: "card-volve",
    key: "apricot",
    title: "Volve field assistant",
    subtitle: "Questions answered from an open oil-field dataset.",
    description: "Reads Equinor’s published Volve reports and production data to answer questions in plain English.",
    tags: ["FAISS", "OpenAI", "FastAPI", "React", "Python"],
    figure: <VolveFigure />,
    cta: { label: "Try →", href: "/geo-agentic-int" },
  },
  {
    id: "card-autosignal",
    key: "steel",
    title: "AutoSignal",
    subtitle: "Vehicle safety answers with the records behind them.",
    description:
      "Ask about a car in plain language. Answers draw on NHTSA bulletins, recalls, complaints, and investigations, with sources.",
    tags: ["NHTSA", "RAG", "FastAPI", "React", "Postgres"],
    figure: <AutoSignalFigure />,
    cta: { label: "Try →", href: "/autosignal/", external: true },
  },
  {
    id: "card-nl-query",
    key: "sky",
    title: "Natural-language plant queries",
    subtitle: "Ask the design model in ordinary sentences.",
    description:
      "Engineers query lines, equipment, and connections across thousands of plant-model tables using natural language.",
    tags: ["NL2SQL", "Enterprise search", "Decision support"],
    figure: <Smart3DFigure variant="compact" />,
  },
  {
    id: "card-copilot",
    key: "sage",
    title: "Enterprise AI Copilot",
    subtitle: "Natural-language agents for 3D engineering.",
    description:
      "I led the plan and build for agents that do 3D engineering work from natural language. Teams save hours each month, with coverage continuing to grow.",
    tags: ["LLM agents", "Product strategy", "3D engineering", "Automation"],
    figure: <CopilotFigure />,
  },
];

function isFinePointer(event: PointerEvent) {
  if (event.pointerType === "touch") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function TagLine({ project }: { project: Project }) {
  return (
    <p className="rp-tech">
      {project.tags.map((tag, index) => (
        <span key={tag}>
          {index > 0 ? " · " : ""}
          <span data-testid={`chip-tag-${project.key}-${tag.replace(/\s+/g, "-").toLowerCase()}`}>{tag}</span>
        </span>
      ))}
    </p>
  );
}

function RowCta({ project }: { project: Project }) {
  if (!project.cta) return null;

  if (project.cta.external) {
    const isHttp = project.cta.href.startsWith("http");
    return (
      <a
        href={project.cta.href}
        data-testid={`link-explore-${project.key}`}
        className="rp-try"
        {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {project.cta.label}
      </a>
    );
  }

  return (
    <Link href={project.cta.href} data-testid={`link-explore-${project.key}`} className="rp-try">
      {project.cta.label}
    </Link>
  );
}

function AgentStrip() {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocusWithin, setKeyboardFocusWithin] = useState(false);
  const expanded = pinned || hovered || keyboardFocusWithin;
  const panelId = "panel-agent";

  const ask = () => {
    setPinned(true);
    document.querySelector("#interview")?.scrollIntoView({ behavior: "smooth" });
    window.dispatchEvent(new CustomEvent("agent:focus"));
  };

  return (
    <div
      id="interview"
      className={`rp-agent-block${expanded ? " is-expanded" : ""}`}
      data-testid="section-agent"
      onPointerEnter={(event) => {
        if (isFinePointer(event)) setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if ((event.target as HTMLElement).matches(":focus-visible")) {
          setKeyboardFocusWithin(true);
        }
      }}
      onBlurCapture={(event) => {
        const next = event.relatedTarget as Node | null;
        if (!event.currentTarget.contains(next)) setKeyboardFocusWithin(false);
      }}
    >
      <div className="rp-agent" data-testid="card-project-agent">
        <button
          type="button"
          className="rp-agent-trigger"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setPinned((value) => !value)}
        >
          <span className="rp-agent-copy">
            <span className="rp-agent-name" data-testid="text-project-title-agent">
              rohit.agent
            </span>
            <span className="rp-agent-desc">A screening call, without the call.</span>
          </span>
        </button>
        <button type="button" className="rp-agent-ask" onClick={ask}>
          Type a question
        </button>
      </div>
      <div className="rp-disclosure" id={panelId} {...(!expanded ? { inert: true } : {})}>
        <div className="rp-disclosure-clip">
          <div className="rp-agent-panel">
            <InterviewAgent onPin={() => setPinned(true)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectItem({ project }: { project: Project }) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocusWithin, setKeyboardFocusWithin] = useState(false);
  const expanded = pinned || hovered || keyboardFocusWithin;
  const panelId = `panel-${project.key}`;

  return (
    <article
      id={project.id}
      className={`rp-project${expanded ? " is-expanded" : ""}`}
      data-testid={`card-project-${project.key}`}
      onPointerEnter={(event) => {
        if (isFinePointer(event)) setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if ((event.target as HTMLElement).matches(":focus-visible")) {
          setKeyboardFocusWithin(true);
        }
      }}
      onBlurCapture={(event) => {
        const next = event.relatedTarget as Node | null;
        if (!event.currentTarget.contains(next)) setKeyboardFocusWithin(false);
      }}
    >
      <div className="rp-project-header">
        <button
          type="button"
          className="rp-project-trigger"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setPinned((value) => !value)}
        >
          <span className="rp-row-title" data-testid={`text-project-title-${project.key}`}>
            {project.title}
          </span>
          <span className="rp-row-sub">{project.subtitle}</span>
        </button>
        <RowCta project={project} />
      </div>
      <div className="rp-disclosure" id={panelId} {...(!expanded ? { inert: true } : {})}>
        <div className="rp-disclosure-clip">
          <div className="rp-expanded-grid">
            <div className="rp-expanded-figure" aria-hidden="true">
              {project.figure}
            </div>
            <div className="rp-expanded-copy">
              <p data-testid={`text-project-desc-${project.key}`}>{project.description}</p>
              <TagLine project={project} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <>
      <AgentStrip />
      <section id="work" className="rp-work" data-testid="section-work">
        <p className="rp-section-label">Selected work</p>
        <article id={featuredJev.id} className="rp-feature" data-testid={`card-project-${featuredJev.key}`}>
          <div className="rp-feature-content">
            <div>
              <h2 data-testid={`text-project-title-${featuredJev.key}`}>{featuredJev.title}</h2>
              <p data-testid={`text-project-desc-${featuredJev.key}`}>{featuredJev.description}</p>
              <TagLine project={featuredJev} />
              <RowCta project={featuredJev} />
            </div>
            <div className="rp-art" aria-hidden="true">
              {featuredJev.figure}
            </div>
          </div>
        </article>
        {projects.map((project) => (
          <ProjectItem key={project.key} project={project} />
        ))}
      </section>
    </>
  );
}
