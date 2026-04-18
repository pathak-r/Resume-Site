import { ReactNode } from "react";

interface EntryRowProps {
  entryNumber: string;
  numeral: string;
  label: string;
  children: ReactNode;
  topRule?: boolean;
  className?: string;
}

export default function EntryRow({
  entryNumber,
  numeral,
  label,
  children,
  topRule = true,
  className = "",
}: EntryRowProps) {
  return (
    <div
      className={`catalog-entry-row ${className}`}
      style={{
        borderTop: topRule ? `var(--cat-rule-width) solid var(--cat-rule)` : "none",
      }}
    >
      <div className="catalog-entry-row__inner">
        <div className="catalog-entry-row__index">
          <div
            style={{
              fontSize: "var(--cat-fs-eyebrow)",
              letterSpacing: "var(--cat-ls-eyebrow)",
              textTransform: "uppercase",
              color: "var(--cat-text-tertiary)",
              fontWeight: 500,
            }}
          >
            {entryNumber}
          </div>
          <div
            style={{
              fontSize: "var(--cat-fs-numeral)",
              fontWeight: 500,
              lineHeight: 1,
              color: "var(--cat-text)",
              marginTop: "0.5rem",
              marginBottom: "0.75rem",
              letterSpacing: "-0.02em",
            }}
          >
            {numeral}
          </div>
          <div
            style={{
              fontSize: "var(--cat-fs-eyebrow)",
              letterSpacing: "var(--cat-ls-eyebrow)",
              textTransform: "uppercase",
              color: "var(--cat-text-tertiary)",
              fontWeight: 500,
            }}
          >
            {label}
          </div>
        </div>
        <div className="catalog-entry-row__content">{children}</div>
      </div>
    </div>
  );
}
