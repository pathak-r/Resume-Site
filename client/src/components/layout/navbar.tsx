import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import CvPreviewButton from "@/components/cv-preview";

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
    <nav className="fixed top-0 w-full z-50 glass-nav" style={{ borderBottom: "1px solid var(--cat-rule)" }}>
      <div
        className="mx-auto px-6 flex items-center justify-between py-4"
        style={{ maxWidth: "var(--cat-panel-max)" }}
      >
        <Link
          href="/"
          style={{
            color: "var(--cat-text)",
            fontSize: "1.05rem",
            fontWeight: 500,
            letterSpacing: 0,
            textDecoration: "none",
            fontFamily: "var(--cat-font)",
          }}
          data-testid="link-logo"
        >
          Rohit Pathak
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <a href="#work" data-testid="nav-link-work" onClick={(e) => goTo(e, "#work")} className="nav-link">
            Work
          </a>
          <a href="#contact" data-testid="nav-link-contact" onClick={(e) => goTo(e, "#contact")} className="nav-link">
            Contact
          </a>
          <a
            href="#interview"
            data-testid="nav-link-ask"
            onClick={(e) => goTo(e, "#interview", true)}
            className="nav-link"
          >
            Ask me
          </a>
        </div>

        <button
          className="md:hidden p-2"
          style={{ color: "var(--cat-text)" }}
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-mobile-menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div
          className="md:hidden absolute top-full left-0 w-full px-6 py-6 flex flex-col gap-4"
          style={{ background: "var(--cat-bg)", borderBottom: "1px solid var(--cat-rule)" }}
        >
          <a href="#work" onClick={(e) => goTo(e, "#work")} className="nav-link">
            Work
          </a>
          <a href="#contact" onClick={(e) => goTo(e, "#contact")} className="nav-link">
            Contact
          </a>
          <a href="#interview" onClick={(e) => goTo(e, "#interview", true)} className="nav-link">
            Ask me
          </a>
          <CvPreviewButton data-testid="button-resume-download-mobile" className="quiet-link" style={{ alignSelf: "flex-start" }}>
            CV
          </CvPreviewButton>
        </div>
      )}

      <style>{`
        .nav-link {
          font-family: var(--cat-font-body);
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: 0;
          text-decoration: none;
          color: var(--cat-text-secondary);
        }
        .nav-link:hover {
          color: var(--cat-text);
        }
      `}</style>
    </nav>
  );
}
