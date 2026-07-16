import { useEffect, useRef, useState } from "react";

/**
 * rohit.agent — the interview chat plate under the hero.
 * Collapsed: single input bar + starter chips.
 * Expanded: fixed-height conversation (scrolls internally), source chips,
 * card deep-links, contextual suggestion chips, SSE streaming from /api/agent/chat.
 */

const INK = "#2C2A24";
const CREAM = "#F0EBE0";
const CREAM_SOFT = "#C4C9B8";
const CREAM_FAINT = "#A3AA96";
const ACCENT = "#E8A060";
const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

type Msg = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  card?: string | null;
};

const CARD_LINKS: Record<string, { label: string; anchor: string }> = {
  copilot: { label: "Enterprise AI Copilot", anchor: "#card-copilot" },
  "nl-query": { label: "AI Agents & NL Querying", anchor: "#card-nl-query" },
  volve: { label: "Volve Field RAG Explorer", anchor: "#card-volve" },
  propscan: { label: "PropScan", anchor: "#card-propscan" },
};

const STARTER_CHIPS = [
  "what's your notice period?",
  "walk me through the copilot",
  "why enterprise AI?",
];

const CHIP_POOLS: string[][] = [
  ["are you open to relocation?", "when can you start?", "what roles are you targeting?"],
  ["what went wrong on the copilot?", "how does the Volve demo work?", "how hands-on are you technically?"],
  ["biggest product failure?", "how do you work with engineers?", "what's your product philosophy?"],
];

const CALENDLY = "https://calendly.com/pathak-a-rohit/30min";

function stripCardTokens(text: string): string {
  return text
    .replace(/\[\[card:[a-z-]+\]\]/g, "")
    .replace(/\[\[[^\]]*$/, "")
    .trimEnd();
}

function extractCard(text: string): string | null {
  const m = text.match(/\[\[card:([a-z-]+)\]\]/);
  return m ? m[1] : null;
}

export default function InterviewAgent() {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [chipSet, setChipSet] = useState<string[]>(STARTER_CHIPS);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const turnCount = useRef(0);

  useEffect(() => {
    const onFocus = () => inputRef.current?.focus();
    window.addEventListener("agent:focus", onFocus);
    return () => window.removeEventListener("agent:focus", onFocus);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  function nextChips() {
    const pool = CHIP_POOLS[turnCount.current % CHIP_POOLS.length];
    const chips = [...pool];
    if (turnCount.current >= 2) chips[2] = "set up a call with Rohit";
    setChipSet(chips);
  }

  async function send(text: string) {
    const question = text.trim();
    if (!question || streaming) return;

    if (question === "set up a call with Rohit") {
      window.open(CALENDLY, "_blank", "noopener");
      return;
    }

    setError(null);
    setExpanded(true);
    setInput("");
    turnCount.current += 1;

    const history = [...messages, { role: "user" as const, content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setStreaming(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) {
        const detail = await res.json().catch(() => null);
        throw new Error(detail?.message || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let full = "";
      let sources: string[] = [];

      const applyUpdate = (content: string, srcs: string[], done: boolean) => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant") {
            next[next.length - 1] = {
              ...last,
              content,
              sources: srcs.length ? srcs : last.sources,
              card: done ? extractCard(content) : last.card,
            };
          }
          return next;
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const evt of events) {
          const line = evt.split("\n").find((l) => l.startsWith("data: "));
          if (!line) continue;
          let payload: any;
          try {
            payload = JSON.parse(line.slice(6));
          } catch {
            continue;
          }
          if (payload.type === "delta") {
            full += payload.text;
            applyUpdate(full, sources, false);
          } else if (payload.type === "meta") {
            sources = payload.sources ?? [];
            applyUpdate(full, sources, false);
          } else if (payload.type === "error") {
            throw new Error(payload.message || "The agent hit a snag.");
          }
        }
      }

      applyUpdate(full, sources, true);
      nextChips();
    } catch (e: any) {
      setMessages((prev) => {
        const next = [...prev];
        if (next[next.length - 1]?.role === "assistant" && !next[next.length - 1].content) {
          next.pop();
        }
        return next;
      });
      setError(
        e?.message?.includes("429")
          ? "I'm popular today — rate limit reached. Email me instead: pathak.a.rohit@gmail.com"
          : "Something went sideways. Try again, or email me: pathak.a.rohit@gmail.com"
      );
    } finally {
      setStreaming(false);
    }
  }

  const inputBar = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send(input);
      }}
      style={{
        background: "rgba(240,235,224,0.06)",
        border: "1px solid rgba(240,235,224,0.18)",
        borderRadius: "8px",
        padding: "13px 16px",
        fontFamily: MONO,
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <span style={{ color: CREAM, fontSize: "15px", flexShrink: 0 }}>▸</span>
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => messages.length > 0 && setExpanded(true)}
        placeholder="ask me — work, notice period, anything"
        maxLength={500}
        data-testid="input-agent"
        style={{
          flex: 1,
          minWidth: 0,
          background: "transparent",
          border: "none",
          outline: "none",
          color: CREAM,
          fontSize: "15px",
          fontFamily: MONO,
        }}
      />
      <button
        type="submit"
        disabled={streaming}
        data-testid="button-agent-send"
        style={{
          background: "transparent",
          border: "none",
          color: ACCENT,
          fontSize: "14px",
          fontWeight: 600,
          fontFamily: MONO,
          cursor: streaming ? "default" : "pointer",
          opacity: streaming ? 0.5 : 1,
          flexShrink: 0,
        }}
      >
        ask →
      </button>
    </form>
  );

  const chips = (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
      {chipSet.map((chip) => (
        <button
          key={chip}
          onClick={() => send(chip)}
          disabled={streaming}
          data-testid={`chip-agent-${chip.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
          style={{
            fontSize: "13px",
            color: CREAM_SOFT,
            background: "transparent",
            border: "1px solid rgba(240,235,224,0.18)",
            borderRadius: "20px",
            padding: "6px 14px",
            fontFamily: MONO,
            cursor: streaming ? "default" : "pointer",
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = ACCENT;
            e.currentTarget.style.color = CREAM;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(240,235,224,0.18)";
            e.currentTarget.style.color = CREAM_SOFT;
          }}
        >
          {chip}
        </button>
      ))}
    </div>
  );

  return (
    <section
      id="interview"
      className="catalog-section"
      style={{ borderTop: "none", paddingTop: 0, paddingBottom: "1.5rem", scrollMarginTop: "72px" }}
      data-testid="section-interview"
    >
      <div className="catalog-panel">
        <div
          style={{
            background: INK,
            border: `1px solid ${ACCENT}`,
            borderRadius: "12px",
            padding: "20px 24px 22px",
          }}
        >
          {/* header */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: ACCENT,
                fontWeight: 600,
                fontFamily: MONO,
              }}
              data-testid="text-agent-status"
            >
              ● live — rohit.agent
            </span>
            <span
              className="agent-header-note"
              style={{
                fontSize: expanded ? "14px" : "13px",
                color: expanded ? CREAM_FAINT : CREAM,
                fontFamily: MONO,
                textAlign: "right",
                fontWeight: expanded ? 400 : 500,
                letterSpacing: expanded ? undefined : "0.02em",
                lineHeight: 1.35,
              }}
            >
              {expanded ? (
                <button
                  onClick={() => setExpanded(false)}
                  aria-label="Collapse chat"
                  data-testid="button-agent-collapse"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: CREAM_FAINT,
                    fontSize: "14px",
                    fontFamily: MONO,
                    cursor: "pointer",
                  }}
                >
                  —
                </button>
              ) : (
                "10+ yrs · Hexagon · Nestlé — or just ask"
              )}
            </span>
          </div>

          {/* standing greeting — the agent speaks first */}
          {messages.length === 0 && (
            <div style={{ margin: "4px 0 16px", maxWidth: "85%" }}>
              <p
                style={{
                  fontSize: "14px",
                  color: CREAM,
                  lineHeight: 1.65,
                  margin: 0,
                  background: "rgba(240,235,224,0.06)",
                  border: "1px solid rgba(240,235,224,0.14)",
                  borderRadius: "8px 8px 8px 2px",
                  padding: "12px 15px",
                  fontFamily: MONO,
                }}
                data-testid="text-agent-greeting"
              >
                I'm the AI version of Rohit — grounded in his CV, case studies and all
                that. Ask him: work, availability, failures, how he builds. All fair
                game.
              </p>
            </div>
          )}

          {/* conversation (expanded only) */}
          {expanded && messages.length > 0 && (
            <div
              ref={scrollRef}
              style={{
                maxHeight: "min(55vh, 520px)",
                overflowY: "auto",
                marginBottom: "12px",
                paddingRight: "4px",
              }}
              data-testid="agent-conversation"
            >
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} style={{ display: "flex", justifyContent: "flex-end", margin: "0 0 12px" }}>
                    <span
                      style={{
                        fontSize: "14px",
                        color: INK,
                        background: ACCENT,
                        borderRadius: "8px 8px 2px 8px",
                        padding: "8px 12px",
                        maxWidth: "75%",
                        fontFamily: MONO,
                        lineHeight: 1.5,
                      }}
                    >
                      {m.content}
                    </span>
                  </div>
                ) : (
                  <div key={i} style={{ margin: "0 0 14px", maxWidth: "85%" }}>
                    {(m.content || !streaming || i !== messages.length - 1) && m.content ? (
                      <p
                        style={{
                          fontSize: "14px",
                          color: CREAM,
                          lineHeight: 1.65,
                          margin: 0,
                          background: "rgba(240,235,224,0.06)",
                          border: "1px solid rgba(240,235,224,0.14)",
                          borderRadius: "8px 8px 8px 2px",
                          padding: "9px 12px",
                          fontFamily: MONO,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {stripCardTokens(m.content)}
                        {m.card && CARD_LINKS[m.card] && (
                          <>
                            {" "}
                            <a
                              href={CARD_LINKS[m.card].anchor}
                              onClick={(e) => {
                                e.preventDefault();
                                document
                                  .querySelector(CARD_LINKS[m.card!].anchor)
                                  ?.scrollIntoView({ behavior: "smooth" });
                              }}
                              style={{ color: ACCENT, textDecoration: "none" }}
                            >
                              ↳ see the {CARD_LINKS[m.card].label} card below
                            </a>
                          </>
                        )}
                      </p>
                    ) : (
                      <div style={{ display: "flex", gap: "5px", padding: "6px 2px" }}>
                        {[1, 0.5, 0.25].map((o, j) => (
                          <span
                            key={j}
                            style={{
                              width: "5px",
                              height: "5px",
                              borderRadius: "50%",
                              background: CREAM_FAINT,
                              opacity: o,
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {m.sources && m.sources.length > 0 && m.content && (
                      <div style={{ display: "flex", gap: "6px", marginTop: "6px", flexWrap: "wrap" }}>
                        {m.sources.map((s) => (
                          <span
                            key={s}
                            style={{
                              fontSize: "10px",
                              color: CREAM_FAINT,
                              border: "1px solid rgba(240,235,224,0.14)",
                              borderRadius: "20px",
                              padding: "2px 8px",
                              fontFamily: MONO,
                            }}
                          >
                            src: {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {error && (
            <p
              style={{
                fontSize: "12px",
                color: ACCENT,
                fontFamily: MONO,
                margin: "0 0 10px",
              }}
              data-testid="text-agent-error"
            >
              {error}
            </p>
          )}

          {inputBar}
          {chips}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .agent-header-note {
            font-size: 12px !important;
            max-width: 58%;
          }
        }
        #interview input::placeholder {
          color: ${CREAM_FAINT};
          opacity: 0.8;
        }
      `}</style>
    </section>
  );
}
