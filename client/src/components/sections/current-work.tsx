import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

type Project = {
  eyebrow: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  cta: { label: string; href: string } | null;
};

const projects: Project[] = [
  {
    eyebrow: "Geo-Agentic AI",
    title: "Volve Field RAG Explorer",
    tagline: "Agentic RAG for Equinor's open Volve oil field dataset.",
    description:
      "Daily drilling reports, production data, and well completion reports — structured and unstructured — ingested into an agentic RAG system. Visualises production trends and answers operator questions about well performance in natural language.",
    tags: ["FAISS", "OpenAI", "FastAPI", "React", "Recharts", "Python"],
    cta: { label: "Explore live demo", href: "/geo-agentic-int" },
  },
  {
    eyebrow: "Vision AI · TestFlight",
    title: "PropScan",
    tagline: "Vision-LLM defect detection for property inspections.",
    description:
      "Mobile inspection app using Gemini 2.5 Flash as a vision LLM to detect, classify, and localise construction defects from user-captured photos. Outputs annotated photos and an aggregated defect register with an overall site verdict.",
    tags: ["Gemini 2.5 Flash", "Structured JSON", "React Native", "Node.js", "Supabase", "PDFKit"],
    cta: null,
  },
];

function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);

  const card = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-testid={`card-current-${project.title.replace(/\s+/g, "-").toLowerCase()}`}
      style={{
        background: hovered && project.cta ? "rgba(242,239,232,0.04)" : "#252525",
        border: "0.5px solid rgba(242,239,232,0.15)",
        borderRadius: "8px",
        padding: "1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "0",
        transition: "background 0.15s ease",
        cursor: project.cta ? "pointer" : "default",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          fontSize: "11px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--cat-text-tertiary)",
          fontWeight: 500,
          margin: "0 0 14px",
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
          lineHeight: 1.5,
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
          flex: 1,
        }}
      >
        {project.description}
      </p>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: project.cta ? "18px" : "0" }}>
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
            gap: "6px",
            fontSize: "13px",
            fontWeight: 500,
            color: hovered ? "var(--cat-text)" : "var(--cat-accent)",
            transition: "color 0.15s ease",
            marginTop: "auto",
            paddingTop: "4px",
          }}
          data-testid={`link-explore-${project.title.replace(/\s+/g, "-").toLowerCase()}`}
        >
          {project.cta.label}
          <ArrowRight size={13} strokeWidth={2} />
        </div>
      )}
    </div>
  );

  if (project.cta) {
    return (
      <Link href={project.cta.href} style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}>
        {card}
      </Link>
    );
  }

  return card;
}

export default function CurrentWork() {
  return (
    <section className="catalog-section" data-testid="section-current-work">
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
            }}
          >
            02 Projects
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.25rem",
          }}
        >
          {projects.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
