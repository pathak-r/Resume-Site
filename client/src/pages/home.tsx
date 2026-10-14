import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import CvPreviewButton from "@/components/cv-preview";
import InterviewAgent from "@/components/agent/interview-agent";
import "./home-walk.css";

type CareerKey = "nestle" | "enterprise" | "hexagon";
type BuildKey = "jev" | "structra" | "planner" | "volve" | "autosignal";

const career = {
  nestle: {
    num: "01",
    name: "Nestlé",
    meta: "Process Engineer · 2 yrs",
    role: "Process Engineer · Nestlé (2 Years)",
    tags: "Plant operations · Process engineering · Root cause analysis",
    summary:
      "Worked directly on the factory floor managing physical equipment, piping loops, and manufacturing runs.",
    highlights: [
      "Hands-on experience with industrial reliability, process bottlenecks, and plant turnarounds.",
      "Built the physical engineering intuition that grounds my software product decisions today.",
    ],
  },
  enterprise: {
    num: "02",
    name: "Enterprise",
    meta: "Product & systems · 5 yrs",
    role: "Technical Product Support · Enterprise Systems (5 Years)",
    tags: "3D CAD schemas · Relational plant data · Enterprise architecture",
    summary:
      "Bridged complex 3D CAD schemas, relational databases, and global EPC engineering workflows.",
    highlights: [
      "Solved deep schema, 3D model, and data integration bottlenecks for mega capital projects.",
      "Translated mission-critical customer engineering requirements directly into product architecture.",
    ],
  },
  hexagon: {
    num: "03",
    name: "Hexagon",
    meta: "Senior AI PM · Now",
    role: "Senior AI Product Manager · Hexagon AB (Current)",
    tags: "0-to-1 AI strategy · LLM agents · Enterprise NL2SQL · 3D CAD",
    summary:
      "Leading 0-to-1 commercial AI products for capital project engineering and plant design.",
    highlights: [
      "3D Engineering AI Copilot: agents executing equipment isolation and turnaround plans from plain English.",
      "Natural-language plant queries across thousands of tables for lines, valves, and nozzles.",
    ],
  },
} as const;

const builds: {
  key: BuildKey;
  name: string;
  line: string;
  title: string;
  summary: string;
  metric: string;
  cta: string;
  href: string;
  external?: boolean;
}[] = [
  {
    key: "jev",
    name: "JEV Routing Benchmark",
    line: "180 ms · $0.0003",
    title: "JEV Intent-Routing Benchmark",
    summary:
      "Typed probabilistic routing tested against GPT-4.1 and GPT-5.6 Sol across CLINC150, BANKING77, and HWU64, without paying to generate output tokens.",
    metric: "180 ms · $0.0003 vs 1.4 s",
    cta: "Try live",
    href: "/how-good-is-jev",
  },
  {
    key: "structra",
    name: "Structra",
    line: "Site defect vision",
    title: "Structra",
    summary:
      "Take a photo on site. The app finds construction defects, boxes them on the source photo, and builds a severity report ready to hand off.",
    metric: "14 findings · 0.91 conf",
    cta: "App Store",
    href: "https://apps.apple.com/us/app/structra-inspect/id6795109088",
    external: true,
  },
  {
    key: "planner",
    name: "Maintenance Planner",
    line: "Turnaround job packs",
    title: "Factory Maintenance Planner",
    summary:
      "Pulls inspections, work orders, sensor history, drawings, and permits into a sourced job pack. Missing or conflicting evidence is flagged.",
    metric: "Facts from queries · prose from the model",
    cta: "Launch",
    href: "/u100/",
  },
  {
    key: "volve",
    name: "Volve Assistant",
    line: "Equinor Q&A",
    title: "Volve Field Assistant",
    summary:
      "Reads Equinor’s published Volve drilling reports and production data to answer reservoir and well questions in plain English, with citations.",
    metric: "7 chunks · 3 sources",
    cta: "Launch",
    href: "/geo-agentic-int",
  },
  {
    key: "autosignal",
    name: "AutoSignal",
    line: "NHTSA · grounded Q&A",
    title: "AutoSignal",
    summary:
      "Ask about a car in plain language. Answers draw on NHTSA bulletins, recalls, complaints, and investigations, with the source records.",
    metric: "3 sources · NHTSA",
    cta: "Launch",
    href: "/autosignal/",
  },
];

function focusAgent() {
  document.querySelector("#interview")?.scrollIntoView({ behavior: "smooth" });
  window.dispatchEvent(new CustomEvent("agent:focus"));
}

function leftTheBand(event: { relatedTarget: EventTarget | null; currentTarget: EventTarget }) {
  const next = event.relatedTarget;
  if (!(next instanceof Node)) return true;
  return !(event.currentTarget as Node).contains(next);
}

export default function Home() {
  const [location] = useLocation();
  const [careerKey, setCareerKey] = useState<CareerKey | null>(null);
  const [careerPinned, setCareerPinned] = useState(false);
  const [buildKey, setBuildKey] = useState<BuildKey | null>(null);
  const [buildPinned, setBuildPinned] = useState(false);

  useEffect(() => {
    if (location === "/hello" || window.location.hash === "#interview") {
      const id = window.setTimeout(focusAgent, 50);
      return () => window.clearTimeout(id);
    }
  }, [location]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setCareerPinned(false);
      setCareerKey(null);
      setBuildPinned(false);
      setBuildKey(null);
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (careerPinned && !target.closest("#career-band")) {
        setCareerPinned(false);
        setCareerKey(null);
      }
      if (buildPinned && !target.closest("#builds-band")) {
        setBuildPinned(false);
        setBuildKey(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [careerPinned, buildPinned]);

  const careerStage = careerKey ? career[careerKey] : null;
  const build = builds.find((item) => item.key === buildKey) ?? null;

  return (
    <div className="walk">
      <div className="walk-page">
        <header className="walk-top">
          <div className="walk-identity">
            <img
              className="walk-portrait"
              src="/rohit-portrait-v5.jpg"
              alt="Rohit Pathak"
              width={128}
              height={156}
            />
            <h1>Rohit Pathak</h1>
            <p className="walk-meta">Abu Dhabi, UAE · 10+ years exp</p>
            <p className="walk-positioning">
              Technical PM leading enterprise AI for capital projects and building working systems{" "}
              <span style={{ whiteSpace: "nowrap" }}>hands-on</span>.
            </p>
            <div className="walk-links">
              <CvPreviewButton data-testid="button-download-cv">CV / Contact</CvPreviewButton>
              <a href="https://www.linkedin.com/in/pathakrohit/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>

          <section className="walk-agent" id="interview" aria-label="rohit.agent">
            <div className="walk-agent-head">
              <div className="walk-agent-name">
                <span className="walk-dot" /> rohit.agent
              </div>
              <span className="walk-agent-note">A screening call, without the call</span>
            </div>
            <InterviewAgent variant="card" />
          </section>
        </header>

        <section
          className="walk-band"
          id="career-band"
          onMouseOver={(event) => {
            const button = (event.target as Element).closest?.("[data-career]");
            if (!button || careerPinned) return;
            setCareerKey(button.getAttribute("data-career") as CareerKey);
          }}
          onMouseOut={(event) => {
            if (careerPinned || !leftTheBand(event)) return;
            setCareerKey(null);
          }}
        >
          <h2 className="walk-label">Career</h2>
          <div className="walk-ribbon">
            {(Object.keys(career) as CareerKey[]).map((key) => {
              const stage = career[key];
              return (
                <button
                  key={key}
                  id={`career-${key}`}
                  type="button"
                  className={`walk-chev${careerKey === key ? " is-on" : ""}`}
                  data-career={key}
                  onClick={() => {
                    if (careerPinned && careerKey === key) {
                      setCareerPinned(false);
                      setCareerKey(null);
                    } else {
                      setCareerPinned(true);
                      setCareerKey(key);
                    }
                  }}
                >
                  <span className="walk-chev-in">
                    <span className="walk-num">{stage.num}</span>
                    <span className="walk-chev-name">{stage.name}</span>
                    <span className="walk-chev-meta">{stage.meta}</span>
                  </span>
                </button>
              );
            })}
          </div>
          {careerStage && (
            <div className="walk-note">
              <div className="walk-note-head">
                <h3>{careerStage.role}</h3>
                <button
                  type="button"
                  className="walk-note-close"
                  aria-label="Close"
                  onClick={() => {
                    setCareerPinned(false);
                    setCareerKey(null);
                  }}
                >
                  ×
                </button>
              </div>
              <p className="walk-note-tags">{careerStage.tags}</p>
              <p>{careerStage.summary}</p>
              <ul>
                {careerStage.highlights.map((line) => (
                  <li key={line}>
                    <span>▸</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section
          className="walk-band"
          id="builds-band"
          onMouseOver={(event) => {
            const button = (event.target as Element).closest?.("[data-build]");
            if (!button || buildPinned) return;
            setBuildKey(button.getAttribute("data-build") as BuildKey);
          }}
          onMouseOut={(event) => {
            if (buildPinned || !leftTheBand(event)) return;
            setBuildKey(null);
          }}
        >
          <h2 className="walk-label">Hands-on systems</h2>
          <div className="walk-systems">
            {builds.map((item) => (
              <button
                key={item.key}
                id={`build-${item.key}`}
                type="button"
                className={`walk-build${buildKey === item.key ? " is-on" : ""}`}
                data-build={item.key}
                onClick={() => {
                  if (buildPinned && buildKey === item.key) {
                    setBuildPinned(false);
                    setBuildKey(null);
                  } else {
                    setBuildPinned(true);
                    setBuildKey(item.key);
                  }
                }}
              >
                <span className="walk-build-name">{item.name}</span>
                <span className="walk-build-line">{item.line}</span>
              </button>
            ))}
          </div>
          {build && (
            <div className="walk-note" id="build-note">
              <div className="walk-note-head">
                <h3>{build.title}</h3>
                <button
                  type="button"
                  className="walk-note-close"
                  aria-label="Close"
                  onClick={() => {
                    setBuildPinned(false);
                    setBuildKey(null);
                  }}
                >
                  ×
                </button>
              </div>
              <p>{build.summary}</p>
              <p className="walk-note-metric">{build.metric}</p>
              <a
                className="walk-action"
                href={build.href}
                {...(build.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {build.cta}
              </a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
