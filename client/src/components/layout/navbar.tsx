import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const D = {
  bg:        "rgba(92, 101, 83, 0.9)",
  bgSolid:   "#5C6553",
  primary:   "#F0EBE0",
  secondary: "#C4C9B8",
  accent:    "#E8A060",
  border:    "rgba(240, 235, 224, 0.18)",
  font:      '"Bricolage Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono:      "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string, focusAgent = false) => {
    e.preventDefault();
    const onHome = location === "/" || location === "/hello";
    if (!onHome) {
      window.location.href = `/${href}`;
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      if (focusAgent) window.dispatchEvent(new CustomEvent("agent:focus"));
      setIsOpen(false);
    }
  };

  return (
    <nav
      className="fixed top-0 w-full z-50"
      style={{
        background: D.bg,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${D.border}`,
        fontFamily: D.font,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <div
        className="mx-auto px-8 flex items-baseline justify-between py-4"
        style={{ maxWidth: "1200px" }}
      >
        <Link
          href="/"
          style={{ color: D.primary, fontSize: "18px", fontWeight: 600, letterSpacing: "-0.01em", textDecoration: "none" }}
          data-testid="link-logo"
        >
          rohit pathak
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-baseline gap-8">
          <a
            href="#interview"
            data-testid="nav-link-ask"
            onClick={(e) => goTo(e, "#interview", true)}
            style={{
              color: D.accent,
              fontSize: "14px",
              fontFamily: D.mono,
              textDecoration: "none",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            ▸ ask me
          </a>
          <a
            href="#contact"
            data-testid="nav-link-contact"
            onClick={(e) => goTo(e, "#contact")}
            style={{ color: D.secondary, fontSize: "16px", textDecoration: "none", transition: "color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = D.primary)}
            onMouseLeave={e => (e.currentTarget.style.color = D.secondary)}
          >
            Contact
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
          style={{ color: D.primary }}
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-mobile-menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden absolute top-full left-0 w-full px-8 py-6 flex flex-col gap-4"
          style={{ background: D.bgSolid, borderBottom: `1px solid ${D.border}` }}
        >
          <a
            href="#interview"
            onClick={(e) => goTo(e, "#interview", true)}
            style={{ color: D.accent, fontSize: "15px", fontFamily: D.mono, textDecoration: "none" }}
          >
            ▸ ask me
          </a>
          <a
            href="#contact"
            onClick={(e) => goTo(e, "#contact")}
            style={{ color: D.secondary, fontSize: "16px", textDecoration: "none" }}
          >
            Contact
          </a>
          <a
            href="/Rohit_Pathak_Resume.pdf"
            download
            data-testid="button-resume-download-mobile"
            style={{
              marginTop: "0.5rem",
              fontSize: "15px",
              fontWeight: 500,
              padding: "10px 18px",
              borderRadius: "10px",
              border: `1px solid ${D.primary}`,
              color: D.bgSolid,
              background: D.primary,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Download CV
          </a>
        </div>
      )}
    </nav>
  );
}
