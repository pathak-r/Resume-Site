import { useEffect, useRef, useState } from "react";

/**
 * rohit.agent — the interview chat plate under the PM strip.
 * Collapsed: single input bar + starter chips.
 * Expanded: tall conversation (scrolls internally), source chips,
 * card deep-links, contextual suggestion chips, SSE streaming from /api/agent/chat.
 */

const INK = "#1F2421";
const PLATE = "#FFFEFA";
const MUTED = "#5E6660";
const FAINT = "#8A918A";
const RULE = "rgba(31, 36, 33, 0.12)";
const ACCENT = "#2F6F6A";
const ON_ACCENT = "#F4F2EC";
const MONO = '"IBM Plex Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace';
const SANS = '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

type Msg = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  card?: string | null;
};

const CARD_LINKS: Record<string, { label: string; anchor: string }> = {
  copilot: { label: "Enterprise AI Copilot", anchor: "#card-copilot" },
  autosignal: { label: "AutoSignal", anchor: "#card-autosignal" },
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
  ["what went wrong on the copilot?", "how did you build the Volve demo?", "how hands-on are you technically?"],
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
        background: "#F4F2EC",
        border: `1px solid ${RULE}`,
        borderRadius: "10px",
        padding: "18px 20px",
        fontFamily: MONO,
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <span style={{ color: ACCENT, fontSize: "16px", flexShrink: 0 }}>▸</span>
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => messages.length > 0 && setExpanded(true)}
        placeholder="Ask about work, availability, failures, how I build. All fair game."
        maxLength={500}
        data-testid="input-agent"
        style={{
          flex: 1,
          minWidth: 0,
          background: "transparent",
          border: "none",
          outline: "none",
          color: INK,
          fontSize: "16px",
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
          fontSize: "15px",
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
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "14px" }}>
      {chipSet.map((chip) => (
        <button
          key={chip}
          onClick={() => send(chip)}
          disabled={streaming}
          data-testid={`chip-agent-${chip.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
          style={{
            fontSize: "13px",
            color: MUTED,
            background: "transparent",
            border: `1px solid ${RULE}`,
            borderRadius: "8px",
            padding: "7px 14px",
            fontFamily: MONO,
            cursor: streaming ? "default" : "pointer",
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = ACCENT;
            e.currentTarget.style.color = INK;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = RULE;
            e.currentTarget.style.color = MUTED;
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
      style={{
        borderTop: "none",
        paddingTop: "0.5rem",
        paddingBottom: "1.5rem",
        scrollMarginTop: "72px",
      }}
      data-testid="section-interview"
    >
      <div className="catalog-panel" style={{ maxWidth: "1080px" }}>
        <div
          style={{
            background: PLATE,
            border: `1px solid ${RULE}`,
            borderRadius: "14px",
            padding: "28px 28px 26px",
            boxShadow: "0 1px 2px rgba(31,36,33,0.04), 0 12px 32px rgba(31,36,33,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                minWidth: 0,
              }}
            >
              <img
                src="/rohit-portrait-v2.jpg"
                alt="Rohit Pathak"
                width={56}
                height={56}
                data-testid="img-agent-portrait"
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  objectPosition: "center center",
                  flexShrink: 0,
                  border: `1px solid ${RULE}`,
                }}
              />
              <div style={{ minWidth: 0 }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    letterSpacing: "0.1em",
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
                  style={{
                    display: "block",
                    marginTop: "6px",
                    fontSize: "14px",
                    color: INK,
                    fontFamily: SANS,
                    fontWeight: 500,
                    lineHeight: 1.35,
                  }}
                  data-testid="text-agent-credentials"
                >
                  10+ years · Hexagon · Nestlé
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                flexShrink: 1,
                minWidth: 0,
              }}
            >
              {messages.length === 0 && (
                <span
                  className="agent-header-note"
                  style={{
                    fontSize: "13px",
                    color: FAINT,
                    fontFamily: SANS,
                    textAlign: "right",
                    fontWeight: 400,
                    lineHeight: 1.4,
                  }}
                  data-testid="text-agent-rag"
                >
                  RAG on my CV, case studies & more
                </span>
              )}
              {expanded && (
                <button
                  onClick={() => setExpanded(false)}
                  aria-label="Collapse chat"
                  data-testid="button-agent-collapse"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: FAINT,
                    fontSize: "16px",
                    fontFamily: MONO,
                    cursor: "pointer",
                    flexShrink: 0,
                    padding: 0,
                  }}
                >
                  —
                </button>
              )}
            </div>
          </div>

          {expanded && messages.length > 0 && (
            <div
              ref={scrollRef}
              style={{
                maxHeight: "min(48vh, 480px)",
                minHeight: "220px",
                overflowY: "auto",
                marginBottom: "16px",
                paddingRight: "4px",
              }}
              data-testid="agent-conversation"
            >
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} style={{ display: "flex", justifyContent: "flex-end", margin: "0 0 12px" }}>
                    <span
                      style={{
                        fontSize: "15px",
                        color: ON_ACCENT,
                        background: ACCENT,
                        borderRadius: "10px 10px 2px 10px",
                        padding: "10px 14px",
                        maxWidth: "75%",
                        fontFamily: SANS,
                        lineHeight: 1.5,
                      }}
                    >
                      {m.content}
                    </span>
                  </div>
                ) : (
                  <div key={i} style={{ margin: "0 0 14px", maxWidth: "88%" }}>
                    {(m.content || !streaming || i !== messages.length - 1) && m.content ? (
                      <p
                        style={{
                          fontSize: "15px",
                          color: INK,
                          lineHeight: 1.65,
                          margin: 0,
                          background: "#F4F2EC",
                          border: `1px solid ${RULE}`,
                          borderRadius: "10px 10px 10px 2px",
                          padding: "12px 14px",
                          fontFamily: SANS,
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
                              style={{ color: ACCENT, textDecoration: "none", fontWeight: 500 }}
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
                              background: FAINT,
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
                              fontSize: "11px",
                              color: FAINT,
                              border: `1px solid ${RULE}`,
                              borderRadius: "6px",
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
                fontSize: "13px",
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
            max-width: 48%;
          }
        }
        #interview input::placeholder {
          color: ${FAINT};
          opacity: 0.9;
        }
      `}</style>
    </section>
  );
}
