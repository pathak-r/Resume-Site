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
  topRule = false,
  className = "",
}: EntryRowProps) {
  return (
    <div
      className={className}
      style={{
        borderTop: topRule ? `var(--cat-rule-width) solid var(--cat-rule)` : "none",
      }}
    >
      <div className="catalog-entry-row__inner">
        <div>
          <p
            style={{
              fontSize: "var(--cat-fs-eyebrow)",
              letterSpacing: "var(--cat-ls-eyebrow)",
              textTransform: "uppercase",
              color: "var(--cat-text-tertiary)",
              fontWeight: 500,
              margin: 0,
            }}
          >
            Entry {entryNumber}
          </p>
          <p
            style={{
              fontSize: "var(--cat-fs-numeral)",
              fontWeight: 500,
              lineHeight: 1,
              color: "var(--cat-text)",
              margin: "8px 0 0",
              letterSpacing: "-0.02em",
            }}
          >
            {numeral}
          </p>
          <p
            style={{
              fontSize: "var(--cat-fs-eyebrow)",
              letterSpacing: "var(--cat-ls-eyebrow)",
              textTransform: "uppercase",
              color: "var(--cat-text-tertiary)",
              fontWeight: 500,
              margin: "10px 0 0",
            }}
          >
            {label}
          </p>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
