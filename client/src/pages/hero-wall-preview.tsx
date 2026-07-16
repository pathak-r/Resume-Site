import { Link } from "wouter";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";

/**
 * Mirrors the live homepage hero + Selected Work.
 * Open: /hero-wall-preview
 */

const F = "var(--cat-font)";

export default function HeroWallPreview() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--cat-bg)",
        color: "var(--cat-text)",
      }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(92, 101, 83, 0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--cat-rule)",
          padding: "0.9rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: "1040px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--cat-text-tertiary)",
                margin: "0 0 2px",
                fontFamily: F,
                fontWeight: 600,
              }}
            >
              Matches live homepage
            </p>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 600,
                margin: 0,
                fontFamily: F,
              }}
            >
              Wall hero + Selected Work
            </p>
          </div>
          <Link
            href="/"
            style={{
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: F,
              color: "var(--cat-bg)",
              background: "var(--cat-text)",
              textDecoration: "none",
              borderRadius: "8px",
              padding: "8px 14px",
            }}
          >
            ← Homepage
          </Link>
        </div>
      </header>

      <main>
        <Hero />
        <Projects />
      </main>
    </div>
  );
}
