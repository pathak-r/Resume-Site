import { Link } from "wouter";

export default function NotFound() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ background: "var(--cat-bg)", color: "var(--cat-text)" }}
    >
      <div style={{ maxWidth: "28rem", padding: "1.5rem" }}>
        <h1
          style={{
            fontFamily: "var(--cat-font)",
            fontSize: "2rem",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: "0 0 0.75rem",
          }}
        >
          Page not found
        </h1>
        <p style={{ color: "var(--cat-text-secondary)", margin: "0 0 1.25rem" }}>
          That address is not on this site.
        </p>
        <Link href="/" className="quiet-link">
          Back home
        </Link>
      </div>
    </div>
  );
}
