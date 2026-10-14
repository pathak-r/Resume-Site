import { Fragment, useEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useLocation } from "wouter";
import CvPreviewButton from "@/components/cv-preview";
import InterviewAgent from "@/components/agent/interview-agent";
import "./home-walk.css";

type CareerKey = "nestle" | "hexagon" | "ai";
type BuildKey = "jev" | "planner" | "volve" | "structra";

const career = {
  nestle: {
    years: "2009–11",
    employer: "Nestlé",
    name: "Plant operations",
    meta: "Ran the plant floor",
    role: "Process Engineer · Nestlé (2 Years)",
    tags: "Plant operations · Process engineering · Root cause analysis",
    summary:
      "Worked directly on the factory floor managing physical equipment, piping loops, and manufacturing runs.",
    highlights: [
      "Hands-on experience with industrial reliability, process bottlenecks, and plant turnarounds.",
      "Built the physical engineering intuition that grounds my software product decisions today.",
    ],
  },
  hexagon: {
    years: "2013–25",
    employer: "Hexagon AB",
    name: "Industrial software",
    meta: "Built the software plants are designed in",
    role: "Support Analyst → Senior PM · Hexagon AB (12 Years)",
    tags: "3D CAD schemas · Relational plant data · Enterprise architecture",
    summary: "Bridged complex 3D CAD schemas, relational databases, and global EPC engineering workflows.",
    highlights: [
      "Solved deep schema, 3D model, and data integration bottlenecks for mega capital projects.",
      "Translated mission-critical customer engineering requirements directly into product architecture.",
      "Led the Smart 3D modernization to 64-bit .NET, making workflows up to 35% faster.",
    ],
  },
  ai: {
    years: "2023–25",
    employer: "Hexagon AB",
    name: "AI integration",
    meta: "Shipped agents into it: days → hours",
    role: "Senior Product Manager · Hexagon AB (2023–25)",
    tags: "0-to-1 AI strategy · LLM agents · Enterprise NL2SQL · 3D CAD",
    summary: "Led 0-to-1 commercial AI products for capital project engineering and plant design.",
    highlights: [
      "3D Engineering AI Copilot: agents executing equipment isolation and turnaround plans from plain English.",
      "Natural-language plant queries across thousands of tables for lines, valves, and nozzles.",
    ],
  },
} as const;

const builds: {
  key: BuildKey;
  name: string;
  tag: string;
  line: string;
  kicker: string;
  summary: string;
  flow: string[];
  stack: string;
  cta: string;
  href: string;
  external?: boolean;
}[] = [
  {
    key: "jev",
    name: "How good is Jev?",
    tag: "Benchmark · 3 datasets",
    line: "Jev routes requests 7.7× faster and 40× cheaper than GPT-4.1.",
    kicker: "Intent routing benchmark",
    summary:
      "An interactive benchmark that puts Jev’s typed routing up against GPT models on three public intent datasets, request by request.",
    flow: ["User request", "Jev vs GPT", "Latency and cost"],
    stack: "CLINC150 · BANKING77 · HWU64",
    cta: "Run benchmark",
    href: "/how-good-is-jev",
  },
  {
    key: "planner",
    name: "Factory Maintenance Planner",
    tag: "Turnaround planning",
    line: "Turns work orders, sensor history and drawings into a shutdown work package.",
    kicker: "Turnaround planning",
    summary:
      "Reconciles maintenance records, historian data and drawings, flags gaps in the scope, and drafts a work package where every line links back to its source.",
    flow: ["SAP PM, PI, drawings", "Reconcile and flag gaps", "Work package"],
    stack: "Azure OpenAI · FastAPI · React",
    cta: "Try it live",
    href: "/u100/#/scope",
  },
  {
    key: "volve",
    name: "Operational Data Agent",
    tag: "Equinor Volve",
    line: "Answers questions on 9 years of oil field data, with sources.",
    kicker: "Multi-source RAG",
    summary:
      "Searches time-series, reports and logs across 7 assets of Equinor’s public Volve field, spots anomalies, and cites the exact passages it used.",
    flow: ["Field data, 9 years", "Search and detect", "Cited answer"],
    stack: "FAISS · BM25 · OpenAI · FastAPI",
    cta: "Try it live",
    href: "/geo-agentic-int",
  },
  {
    key: "structra",
    name: "Construction Defect Inspector",
    tag: "Structra · iOS",
    line: "Photo in, marked-up defects and a report out. On the App Store.",
    kicker: "Vision model on mobile",
    summary:
      "Take a photo on site. The app boxes each defect, skips low-confidence calls, and builds a defect register ready to hand off.",
    flow: ["Site photo", "Vision model", "Defect register"],
    stack: "Gemini 2.5 Flash · React Native · Supabase",
    cta: "App Store",
    href: "https://apps.apple.com/us/app/structra-inspect/id6795109088",
    external: true,
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

function launchProps(external?: boolean) {
  return external ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

export default function Home() {
  const [location] = useLocation();
  const [careerKey, setCareerKey] = useState<CareerKey | null>(null);
  const [careerPinned, setCareerPinned] = useState(false);
  const [buildKey, setBuildKey] = useState<BuildKey | null>(null);
  const [buildPinned, setBuildPinned] = useState(false);
  const [singleColumn, setSingleColumn] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 720px)");
    const apply = () => setSingleColumn(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (location === "/hello" || window.location.hash === "#interview") {
      const id = window.setTimeout(focusAgent, 50);
      return () => window.clearTimeout(id);
    }
  }, [location]);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setCareerPinned(false);
      setCareerKey(null);
      setBuildPinned(false);
      setBuildKey(null);
    };
    const onClick = (event: globalThis.MouseEvent) => {
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
  const activeBuildIndex = builds.findIndex((item) => item.key === buildKey);
  const detailAfter =
    activeBuildIndex < 0
      ? -1
      : singleColumn
        ? activeBuildIndex
        : Math.min(activeBuildIndex + (activeBuildIndex % 2 === 0 ? 1 : 0), builds.length - 1);

  function toggleCareer(key: CareerKey) {
    if (careerPinned && careerKey === key) {
      setCareerPinned(false);
      setCareerKey(null);
    } else {
      setCareerPinned(true);
      setCareerKey(key);
    }
  }

  function toggleBuild(key: BuildKey) {
    if (buildPinned && buildKey === key) {
      setBuildPinned(false);
      setBuildKey(null);
    } else {
      setBuildPinned(true);
      setBuildKey(key);
    }
  }

  return (
    <div className="walk">
      <div className="walk-page">
        <header className="walk-top">
          <div className="walk-identity">
            <img
              className="walk-portrait"
              src="/rohit-portrait-v5.jpg"
              alt="Rohit Pathak"
              width={200}
            />
            <div className="walk-copy">
              <h1>Rohit Pathak</h1>
              <p className="walk-meta">Forward-deployed PM · Abu Dhabi · 12+ years</p>
              <p className="walk-positioning">
                Technical PM leading enterprise AI for capital projects and building working systems{" "}
                <span style={{ whiteSpace: "nowrap" }}>hands-on</span>.
              </p>
              <div className="walk-links">
                <CvPreviewButton data-testid="button-download-cv">View CV</CvPreviewButton>
                <a href="https://www.linkedin.com/in/pathakrohit/" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <section className="walk-agent" id="interview" aria-label="rohit.agent">
            <div className="walk-agent-head">
              <div className="walk-agent-name">
                <span className="walk-dot" /> rohit.agent
              </div>
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
          <h2 className="walk-label">
            Career<span className="walk-aside">Hover for detail</span>
          </h2>
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
                  onClick={() => toggleCareer(key)}
                >
                  <span className="walk-chev-in">
                    <span className="walk-num">
                      {stage.years}
                      <span className="walk-employer"> · {stage.employer}</span>
                    </span>
                    <span className="walk-chev-name">{stage.name}</span>
                    <span className="walk-chev-meta">{stage.meta}</span>
                  </span>
                </button>
              );
            })}
          </div>
          {careerStage && (
            <div className="walk-note" key={careerKey}>
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
                    <span className="walk-bullet" />
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
            const card = (event.target as Element).closest?.("[data-build]");
            if (!card || buildPinned) return;
            setBuildKey(card.getAttribute("data-build") as BuildKey);
          }}
          onMouseOut={(event) => {
            if (buildPinned || !leftTheBand(event)) return;
            setBuildKey(null);
          }}
        >
          <h2 className="walk-label">
            Selected work<span className="walk-aside">Live demos</span>
          </h2>
          <div className="walk-systems">
            {builds.map((item, index) => (
              <Fragment key={item.key}>
                <div
                  id={`build-${item.key}`}
                  role="button"
                  tabIndex={0}
                  className={`walk-build${buildKey === item.key ? " is-on" : ""}`}
                  data-build={item.key}
                  aria-label={`${item.name}: show details`}
                  onClick={(event) => {
                    if ((event.target as Element).closest("[data-launch]")) return;
                    toggleBuild(item.key);
                  }}
                  onKeyDown={(event: ReactKeyboardEvent<HTMLDivElement>) => {
                    if ((event.target as Element).closest("[data-launch]")) return;
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    toggleBuild(item.key);
                  }}
                >
                  <span className="walk-build-name">{item.name}</span>
                  <a className="walk-try" data-launch href={item.href} {...launchProps(item.external)}>
                    {item.cta} ↗
                  </a>
                  <span className="walk-build-line">{item.line}</span>
                  <span className="walk-build-tag">{item.tag}</span>
                </div>
                {build && index === detailAfter && (
                  <div className="walk-note walk-build-note" id="build-note" key={build.key}>
                    <div className="walk-detail">
                      <div>
                        <div className="walk-kicker">{build.kicker}</div>
                        <h3>{build.name}</h3>
                        <p>{build.summary}</p>
                        <div className="walk-flow">
                          {build.flow.map((step, stepIndex) => (
                            <span key={step} style={{ display: "contents" }}>
                              {stepIndex > 0 && <span className="walk-arr">→</span>}
                              <span className="walk-step">{step}</span>
                            </span>
                          ))}
                        </div>
                        <div className="walk-stack">{build.stack}</div>
                        <a className="walk-action" data-launch href={build.href} {...launchProps(build.external)}>
                          {build.cta} ↗
                        </a>
                      </div>
                      <div>
                        <div className="walk-detail-close">
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
                        <BuildVisual id={build.key} />
                      </div>
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </section>

        <p className="walk-contact">
          <span className="walk-contact-label">Contact</span>
          <a className="walk-contact-link" href="mailto:write@rohitpathak.com">
            write@rohitpathak.com
          </a>
        </p>
      </div>
    </div>
  );
}

function BuildVisual({ id }: { id: BuildKey }) {
  if (id === "jev") {
    return (
      <div className="walk-visual">
        <div className="walk-visual-cap">Result · 150 intents</div>
        <div className="walk-bar-label">
          <span>Jev</span>
          <span className="walk-good">180 ms · $0.0003</span>
        </div>
        <div className="walk-track">
          <div className="walk-fill" style={{ width: "13%" }} />
        </div>
        <div className="walk-bar-label walk-quiet" style={{ marginTop: 12 }}>
          <span>GPT-4.1</span>
          <span>1.4 s · $0.0120</span>
        </div>
        <div className="walk-track">
          <div className="walk-fill walk-fill-dim" style={{ width: "100%" }} />
        </div>
      </div>
    );
  }

  if (id === "planner") {
    return (
      <div className="walk-visual walk-mono">
        <div className="walk-visual-cap">Sample run</div>
        <div className="walk-prompt">draft TA-2027 package for E-101</div>
        <div>
          <span className="walk-pill">INS-0499</span>
          <span className="walk-pill">WO 40000304</span>
          <span className="walk-pill">100-PRC-001</span>
        </div>
      </div>
    );
  }

  if (id === "volve") {
    return (
      <div className="walk-visual walk-mono">
        <div className="walk-visual-cap">Sample run</div>
        <div className="walk-prompt">why is water cut rising in F-12?</div>
        <div className="walk-cite walk-visual-row">
          <span className="walk-quiet">15/9-F-12 DDR · 2007-06-19</span>
          <span className="walk-good">7 passages · 3 sources</span>
        </div>
      </div>
    );
  }

  return (
    <div className="walk-visual">
      <div className="walk-visual-cap">Sample run</div>
      <div className="walk-defect">
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div className="walk-mark">CRACK</div>
          <div>
            <div className="walk-mono">Crack · wall</div>
            <div className="walk-quiet" style={{ marginTop: 2 }}>
              14 findings boxed on the photos
            </div>
          </div>
        </div>
        <div className="walk-mono" style={{ textAlign: "right" }}>
          conf 0.91
          <br />
          <span className="walk-quiet">moderate</span>
        </div>
      </div>
    </div>
  );
}
