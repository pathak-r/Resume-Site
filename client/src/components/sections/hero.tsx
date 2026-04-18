import EntryRow from "@/components/catalog/entry-row";

export default function Hero() {
  return (
    <section
      className="catalog-section"
      style={{ paddingTop: "5rem", paddingBottom: "0" }}
      data-testid="section-hero"
    >
      <div className="px-4">
        <div className="catalog-panel">
          <EntryRow
            entryNumber="№ 01"
            numeral="00"
            label="Introduction"
            numeralSize={56}
          >
            <p className="catalog-meta" style={{ marginBottom: "10px" }} data-testid="text-hero-eyebrow">
              Filed under: senior pm · enterprise AI · abu dhabi
            </p>

            <h1 className="catalog-h1" data-testid="text-hero-headline">
              Senior product manager shipping AI into software people actually depend on.
            </h1>

            <p
              style={{
                fontSize: "var(--cat-fs-body)",
                lineHeight: "var(--cat-lh-body)",
                color: "var(--cat-text-secondary)",
                margin: "0 0 20px",
                maxWidth: "480px",
              }}
              data-testid="text-hero-body"
            >
              Ten plus years turning complex technical capabilities into products that
              solve real business problems. Currently focused on agentic AI and RAG
              systems inside enterprise SaaS.
            </p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a href="#work" className="catalog-btn catalog-btn--primary" data-testid="button-view-work">
                View selected work →
              </a>
              <a href="/Rohit_Pathak_Resume.pdf" download className="catalog-btn" data-testid="button-download-cv">
                Download CV
              </a>
              <a
                href="https://www.linkedin.com/in/pathakrohit/"
                target="_blank"
                rel="noopener noreferrer"
                className="catalog-btn"
                data-testid="button-linkedin"
              >
                LinkedIn
              </a>
            </div>
          </EntryRow>
        </div>
      </div>
    </section>
  );
}
