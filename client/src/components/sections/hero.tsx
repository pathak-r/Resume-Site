import CvPreviewButton from "@/components/cv-preview";

export default function Hero() {
  return (
    <section className="rp-hero" data-testid="section-hero">
      <div>
        <h1 className="rp-hero-name" data-testid="text-hero-headline">
          Rohit Pathak
        </h1>
        <p className="rp-role">
          Technical PM building AI for capital projects.
        </p>
        <p className="rp-proof" data-testid="text-hero-eyebrow">
          10+ years across Hexagon AB and Nestlé.
        </p>
        <div className="rp-links">
          <CvPreviewButton data-testid="button-download-cv" className="rp-cv-trigger">
            CV
          </CvPreviewButton>
          <a
            href="https://www.linkedin.com/in/pathakrohit/"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="button-linkedin"
          >
            LinkedIn ↗
          </a>
        </div>
      </div>
      <img
        className="rp-portrait"
        src="/rohit-portrait-v5.jpg"
        alt="Rohit Pathak"
        width={150}
        height={183}
        data-testid="img-hero-portrait"
      />
    </section>
  );
}
