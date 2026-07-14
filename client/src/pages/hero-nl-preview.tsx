import { Link } from "wouter";

/**
 * Superseded by /hero-wall-preview (now live on homepage).
 * Kept as a redirect helper so old bookmarks still land somewhere useful.
 */

const F = "var(--cat-font)";

export default function HeroNlPreview() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--cat-bg)",
        color: "var(--cat-text)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: F,
      }}
    >
      <div style={{ maxWidth: "420px", textAlign: "center" }}>
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--cat-text-tertiary)",
            fontWeight: 600,
            margin: "0 0 10px",
          }}
        >
          Preview retired
        </p>
        <p style={{ fontSize: "18px", fontWeight: 600, margin: "0 0 16px" }}>
          The wall hero is now on the homepage.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--cat-bg)",
              background: "var(--cat-text)",
              textDecoration: "none",
              borderRadius: "8px",
              padding: "8px 14px",
            }}
          >
            Go to homepage
          </Link>
          <Link
            href="/hero-wall-preview"
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--cat-text)",
              border: "1px solid var(--cat-rule-strong)",
              textDecoration: "none",
              borderRadius: "8px",
              padding: "8px 14px",
            }}
          >
            Wall preview
          </Link>
        </div>
      </div>
    </div>
  );
}
