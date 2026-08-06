import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Download, X } from "lucide-react";

const CV_PATH = "/Rohit_Pathak_Resume.pdf";
const CV_FILENAME = "Rohit_Pathak_Resume.pdf";

type CvPreviewButtonProps = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  "data-testid"?: string;
  onOpenChange?: (open: boolean) => void;
};

export default function CvPreviewButton({
  className,
  style,
  children,
  onOpenChange,
  "data-testid": testId,
}: CvPreviewButtonProps) {
  return (
    <DialogPrimitive.Root onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>
        <button type="button" className={className} style={style} data-testid={testId}>
          {children}
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-[60] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          style={{ background: "rgba(20, 20, 20, 0.55)" }}
        />
        <DialogPrimitive.Content
          className="fixed left-[50%] top-[50%] z-[61] flex w-[min(920px,calc(100vw-1.5rem))] translate-x-[-50%] translate-y-[-50%] flex-col overflow-hidden border outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          style={{
            background: "var(--cat-bg-card)",
            borderColor: "var(--cat-ink)",
            boxShadow: "6px 6px 0 var(--cat-ink)",
            height: "min(88vh, 980px)",
          }}
        >
          <div
            className="flex shrink-0 items-center justify-between gap-3 px-4 py-3"
            style={{ borderBottom: "1px solid var(--cat-ink)" }}
          >
            <div className="min-w-0">
              <DialogPrimitive.Title
                style={{
                  margin: 0,
                  fontFamily: "var(--cat-font-mono)",
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--cat-text)",
                }}
              >
                Curriculum Vitae
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">
                Preview of Rohit Pathak&apos;s resume PDF with download option.
              </DialogPrimitive.Description>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <a
                href={CV_PATH}
                download={CV_FILENAME}
                data-testid="button-cv-download"
                className="catalog-btn catalog-btn--primary"
                style={{
                  height: "auto",
                  padding: "0.55rem 0.85rem",
                  fontSize: "0.68rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: "var(--cat-font-mono)",
                  gap: "0.45rem",
                  textDecoration: "none",
                }}
              >
                <Download size={14} aria-hidden="true" strokeWidth={2} />
                Download
              </a>
              <DialogPrimitive.Close asChild>
                <button
                  type="button"
                  data-testid="button-cv-close"
                  aria-label="Close CV preview"
                  className="catalog-btn"
                  style={{
                    height: "auto",
                    padding: "0.55rem 0.65rem",
                    borderColor: "var(--cat-ink)",
                    borderRadius: 0,
                    color: "var(--cat-text)",
                  }}
                >
                  <X size={16} aria-hidden="true" strokeWidth={2} />
                </button>
              </DialogPrimitive.Close>
            </div>
          </div>

          <div className="relative min-h-0 flex-1" style={{ background: "var(--cat-bg)" }}>
            <iframe
              src={`${CV_PATH}#toolbar=0&navpanes=0`}
              title="Rohit Pathak CV"
              data-testid="iframe-cv-preview"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>

          <div
            className="flex shrink-0 items-center justify-between gap-3 px-4 py-2.5 sm:hidden"
            style={{ borderTop: "1px solid var(--cat-rule)" }}
          >
            <a
              href={CV_PATH}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-cv-open-tab"
              style={{
                fontFamily: "var(--cat-font-mono)",
                fontSize: "0.68rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--cat-text-tertiary)",
                textDecoration: "none",
              }}
            >
              Open in new tab
            </a>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
