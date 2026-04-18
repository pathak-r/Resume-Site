import { ArrowRight, Download, Linkedin } from "lucide-react";
import EntryRow from "@/components/catalog/entry-row";

export default function Hero() {
  return (
    <section
      className="catalog-section"
      style={{ paddingTop: "6rem", paddingBottom: "2rem" }}
      data-testid="section-hero"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <EntryRow
          entryNumber="№ 01"
          numeral="00"
          label="Introduction"
          topRule={false}
        >
          <div
            className="catalog-eyebrow"
            style={{ marginBottom: "1.5rem", textTransform: "none", letterSpacing: "0.01em", fontSize: "14px", color: "var(--cat-text-secondary)" }}
            data-testid="text-hero-eyebrow"
          >
            Filed under: senior pm · enterprise AI · abu dhabi
          </div>

          <h1
            className="catalog-h1"
            style={{ marginBottom: "2rem" }}
            data-testid="text-hero-headline"
          >
            Senior product manager shipping AI into software people actually depend on.
          </h1>

          <p
            className="catalog-body"
            style={{ maxWidth: "62ch", marginBottom: "2.5rem" }}
            data-testid="text-hero-body"
          >
            Ten plus years turning complex technical capabilities into products that
            solve real business problems. Currently focused on agentic AI and RAG
            systems inside enterprise SaaS.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="catalog-btn catalog-btn--primary"
              data-testid="button-view-work"
            >
              View selected work <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </a>
            <a
              href="/Rohit_Pathak_Resume.pdf"
              download
              className="catalog-btn"
              data-testid="button-download-cv"
            >
              <Download className="w-4 h-4" strokeWidth={1.5} />
              Download CV
            </a>
            <a
              href="https://www.linkedin.com/in/pathakrohit/"
              target="_blank"
              rel="noopener noreferrer"
              className="catalog-btn"
              data-testid="button-linkedin"
            >
              <Linkedin className="w-4 h-4" strokeWidth={1.5} />
              LinkedIn
            </a>
          </div>
        </EntryRow>
      </div>
    </section>
  );
}
