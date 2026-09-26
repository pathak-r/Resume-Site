import { Link } from "wouter";

export default function Navbar() {
  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.location.href = `/${href}`;
  };

  return (
    <nav className="rp-nav rp-nav-global">
      <div className="rp-nav-global-inner">
        <Link href="/" className="rp-brand" data-testid="link-logo">
          Rohit Pathak
        </Link>
        <div className="rp-navlinks">
          <a href="#work" data-testid="nav-link-work" onClick={(e) => goTo(e, "#work")}>
            Work
          </a>
          <a href="#contact" data-testid="nav-link-contact" onClick={(e) => goTo(e, "#contact")}>
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
