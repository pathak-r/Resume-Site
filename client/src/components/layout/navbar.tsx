import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [location] = useLocation();
  const onHome = location === "/" || location === "/hello";

  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (!onHome) {
      window.location.href = `/${href}`;
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const links = (
    <>
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
    </>
  );

  if (onHome) {
    return <nav className="rp-nav">{links}</nav>;
  }

  return (
    <nav className="rp-nav rp-nav-global">
      <div className="rp-nav-global-inner">{links}</div>
    </nav>
  );
}
