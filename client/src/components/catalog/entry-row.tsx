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
            className="catalog-eyebrow"
            style={{ marginBottom: "1.5rem" }}
          >
            Entry {entryNumber}
          </div>
          <div
            style={{
              fontSize: "var(--cat-fs-numeral)",
              fontWeight: 500,
              lineHeight: 1,
              color: "var(--cat-text)",
              marginBottom: "1.25rem",
              letterSpacing: "-0.025em",
            }}
          >
            {numeral}
          </div>
          <div className="catalog-eyebrow">{label}</div>
        </div>
        <div className="catalog-entry-row__content">{children}</div>
      </div>
    </div>
  );
}
