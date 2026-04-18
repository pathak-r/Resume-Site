import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const Hi = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: "var(--cat-text)", fontWeight: 600 }}>{children}</span>
);

type Project = {
  eyebrow: React.ReactNode;
  eyebrowBright?: boolean;
  title: string;
  tagline: React.ReactNode;
  description: React.ReactNode;
  tags: string[];
  cta: { label: string; href: string } | null;
};

const projects: Project[] = [
  {
    eyebrow: "Geo-Agentic AI",
    title: "Volve Field RAG Explorer",
    tagline: <><Hi>Agentic RAG</Hi> for Equinor's open Volve oil field dataset.</>,
    description: (
      <>
        Daily drilling reports, production data, and well completion reports —
        structured and unstructured — ingested into an agentic RAG system.
        Visualises production trends and answers operator questions about well
        performance in <Hi>natural language</Hi>.
      </>
    ),
    tags: ["FAISS", "OpenAI", "FastAPI", "React", "Recharts", "Python"],
    cta: { label: "Explore live demo", href: "/geo-agentic-int" },
  },
  {
    eyebrow: (
      <>
        <Hi>Vision AI</Hi>
        <span style={{ color: "var(--cat-text-tertiary)" }}> · </span>
        <Hi>TestFlight</Hi>
      </>
    ),
    title: "PropScan",
    tagline: <><Hi>Vision-LLM</Hi> defect detection for property inspections.</>,
    description: (
      <>
        Mobile inspection app using Gemini 2.5 Flash as a vision LLM to detect,
        classify, and localise construction defects from user-captured photos.
        Outputs annotated photos and an aggregated defect register with an overall
        site verdict.
      </>
    ),
    tags: ["Gemini 2.5 Flash", "Structured JSON", "React Native", "Node.js", "Supabase", "PDFKit"],
    cta: null,
  },
];

function ProjectCol({ project, isRight }: { project: Project; isRight: boolean }) {
  const inner = (
    <div
      style={{
        padding: isRight ? "0 0 0 2.5rem" : "0 2.5rem 0 0",
        borderLeft: isRight ? "0.5px solid var(--cat-rule)" : "none",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      data-testid={`col-current-${project.title.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <p
        style={{
          fontSize: "11px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--cat-text-tertiary)",
          fontWeight: 500,
          margin: "0 0 14px",
          fontFamily: "var(--cat-font)",
        }}
      >
        {project.eyebrow}
      </p>

      <h3
        style={{
          fontSize: "22px",
          fontWeight: 600,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
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
          fontSize: "13px",
          color: "var(--cat-text-secondary)",
          fontStyle: "italic",
          margin: "0 0 14px",
          lineHeight: 1.55,
          fontFamily: "var(--cat-font)",
        }}
      >
        {project.tagline}
      </p>

      <p
        style={{
          fontSize: "14px",
          lineHeight: 1.7,
          color: "var(--cat-text-secondary)",
          margin: "0 0 18px",
          fontFamily: "var(--cat-font)",
        }}
      >
        {project.description}
      </p>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: project.cta ? "20px" : "0" }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="catalog-tag"
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
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--cat-accent)",
            background: "transparent",
            border: "0.5px solid rgba(76,201,160,0.45)",
            borderRadius: "8px",
            padding: "10px 18px",
            marginTop: "20px",
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
        style={{ textDecoration: "none", color: "inherit", display: "block" }}
      >
        {inner}
      </Link>
    );
  }

  return inner;
}

export default function CurrentWork() {
  return (
    <section className="catalog-section" data-testid="section-current-work">
      <div className="catalog-panel">
        <div className="catalog-section-header">
          <p
            style={{
              fontSize: "14px",
              letterSpacing: "0.06em",
              color: "var(--cat-text-secondary)",
              textTransform: "uppercase",
              margin: 0,
              fontWeight: 500,
              fontFamily: "var(--cat-font)",
            }}
            data-testid="heading-current-work"
          >
            What I'm Currently Working On
          </p>
          <p
            style={{
              fontSize: "var(--cat-fs-eyebrow)",
              letterSpacing: "var(--cat-ls-eyebrow)",
              color: "var(--cat-text-tertiary)",
              textTransform: "uppercase",
              margin: 0,
              fontWeight: 500,
              fontFamily: "var(--cat-font)",
            }}
          >
            02 Projects
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0",
            alignItems: "start",
          }}
        >
          {projects.map((p, i) => (
            <ProjectCol key={p.title} project={p} isRight={i === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
