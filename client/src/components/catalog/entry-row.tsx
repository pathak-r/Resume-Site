import { ReactNode } from "react";

interface EntryRowProps {
  entryNumber: string;
  numeral: string;
  label: string;
  subLabel?: string;
  subLabelColor?: string;
  numeralSize?: number;
  children: ReactNode;
  className?: string;
}

export default function EntryRow({
  entryNumber,
  numeral,
  label,
  subLabel,
  subLabelColor,
  numeralSize = 72,
  children,
  className = "",
}: EntryRowProps) {
  return (
    <div className={className}>
      <div className="catalog-entry-row__inner">
        <div>
          <p
            style={{
              fontSize: "var(--cat-fs-eyebrow)",
              letterSpacing: "var(--cat-ls-eyebrow)",
              textTransform: "uppercase",
              color: "var(--cat-text-tertiary)",
              fontWeight: 500,
              margin: "0 0 8px",
            }}
          >
            Entry {entryNumber}
          </p>
          <p
            style={{
              fontSize: `${numeralSize}px`,
              fontWeight: 500,
              lineHeight: 1,
              color: "var(--cat-text)",
              margin: 0,
              letterSpacing: "-0.03em",
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
          {subLabel && (
            <p
              style={{
                fontSize: "var(--cat-fs-eyebrow)",
                letterSpacing: "var(--cat-ls-eyebrow)",
                textTransform: "uppercase",
                color: subLabelColor || "var(--cat-accent)",
                fontWeight: 500,
                margin: "2px 0 0",
              }}
            >
              {subLabel}
            </p>
          )}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
