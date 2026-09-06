import { useEffect, useRef, useState } from "react";

/**
 * rohit.agent — the interview chat plate under the PM strip.
 * Collapsed: single input bar + starter chips.
 * Expanded: tall conversation (scrolls internally), source chips,
 * card deep-links, contextual suggestion chips, SSE streaming from /api/agent/chat.
 */

const INK = "var(--cat-ink)";
const PLATE = "rgba(20, 20, 20, 0.03)";
const MUTED = "var(--cat-text-secondary)";
const FAINT = "var(--cat-text-tertiary)";
const RULE = "var(--cat-rule)";
const ACCENT = "var(--cat-accent)";
const ON_ACCENT = "var(--cat-on-accent)";
const MONO = "var(--cat-font-mono)";
const SANS = "var(--cat-font)";

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
  structra: { label: "Structra", anchor: "#card-structra" },
  propscan: { label: "Structra", anchor: "#card-structra" },
  u100: { label: "Unit 100", anchor: "#card-u100" },
};

const STARTER_CHIPS = [
  "what's your notice period?",
  "walk me through the copilot",
  "why enterprise AI?",
];

const CHIP_POOLS: string[][] = [
  ["are you open to relocation?", "when can you start?", "what roles are you targeting?"],
  ["what went wrong on the copilot?", "how did you build the Volve demo?", "what's AutoSignal?"],
  ["how hands-on are you technically?", "did you run evals on AutoSignal?", "what's Structra?"],
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
        background: "transparent",
        borderBottom: `1px solid ${RULE}`,
        borderRadius: 0,
        padding: "0 0 0.75rem",
        fontFamily: MONO,
        display: "flex",
        alignItems: "center",
        gap: "0.65rem",
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
          fontSize: "0.95rem",
          fontFamily: MONO,
        }}
      />
      <button
        type="submit"
        disabled={streaming}
        data-testid="button-agent-send"
        style={{
          background: INK,
          border: "none",
          color: "#f4f1ea",
          fontSize: "0.65rem",
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontFamily: MONO,
          cursor: streaming ? "default" : "pointer",
          opacity: streaming ? 0.5 : 1,
          flexShrink: 0,
          padding: "0.55rem 0.75rem",
        }}
      >
        Send
      </button>
    </form>
  );

  const chips = (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.15rem" }}>
      {chipSet.map((chip) => (
        <button
          key={chip}
          onClick={() => send(chip)}
          disabled={streaming}
          data-testid={`chip-agent-${chip.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.04em",
            color: MUTED,
            background: "transparent",
            border: `1px solid ${RULE}`,
            borderRadius: 0,
            padding: "0.4rem 0.65rem",
            fontFamily: MONO,
            cursor: streaming ? "default" : "pointer",
            transition: "border-color 0.15s, color 0.15s, background 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = INK;
            e.currentTarget.style.color = INK;
            e.currentTarget.style.background = "var(--cat-accent-soft)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = RULE;
            e.currentTarget.style.color = MUTED;
            e.currentTarget.style.background = "transparent";
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
        background: "transparent",
        paddingTop: "2.25rem",
        paddingBottom: "1.5rem",
        scrollMarginTop: "72px",
      }}
      data-testid="section-interview"
    >
      <div className="catalog-panel">
        <p
          style={{
            margin: "0 0 0.45rem",
            fontFamily: MONO,
            fontSize: "0.65rem",
            fontWeight: 500,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: FAINT,
          }}
        >
          Interview agent
        </p>
        <h2
          style={{
            margin: "0 0 1.35rem",
            fontSize: "clamp(1.35rem, 2.8vw, 1.75rem)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: INK,
            fontFamily: SANS,
            maxWidth: "20ch",
          }}
        >
          Ask me anything.
        </h2>
        <div
          style={{
            background: PLATE,
            border: `1px solid ${INK}`,
            borderRadius: 0,
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "12px",
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
                src="/rohit-portrait-v3.jpg"
                alt="Rohit Pathak"
                width={48}
                height={48}
                data-testid="img-agent-portrait"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: 0,
                  objectFit: "cover",
                  objectPosition: "center center",
                  flexShrink: 0,
                  border: `1px solid ${INK}`,
                }}
              />
              <div style={{ minWidth: 0 }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.7rem",
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
                {messages.length === 0 && (
                  <span
                    style={{
                      display: "block",
                      marginTop: "6px",
                      fontSize: "0.78rem",
                      color: FAINT,
                      fontFamily: MONO,
                      fontWeight: 400,
                      lineHeight: 1.4,
                    }}
                    data-testid="text-agent-rag"
                  >
                    RAG on my CV, case studies & more
                  </span>
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                flexShrink: 0,
                minWidth: 0,
              }}
            >
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
                paddingRight: "4px",
              }}
              data-testid="agent-conversation"
            >
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} style={{ display: "flex", justifyContent: "flex-end", margin: "0 0 12px" }}>
                    <span
                      style={{
                        fontSize: "0.95rem",
                        color: ON_ACCENT,
                        background: ACCENT,
                        border: `1px solid ${INK}`,
                        borderRadius: 0,
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
                          fontSize: "0.95rem",
                          color: INK,
                          lineHeight: 1.65,
                          margin: 0,
                          background: "transparent",
                          border: `1px solid ${RULE}`,
                          borderRadius: 0,
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
                              style={{
                                color: ACCENT,
                                textDecoration: "none",
                                fontWeight: 600,
                                borderBottom: `1px solid ${ACCENT}`,
                              }}
                            >
                              ↳ see {CARD_LINKS[m.card].label} below
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
                              borderRadius: 0,
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
                              fontSize: "0.62rem",
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              color: FAINT,
                              border: `1px solid ${RULE}`,
                              borderRadius: 0,
                              padding: "0.2rem 0.45rem",
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
                fontSize: "0.78rem",
                color: ACCENT,
                fontFamily: MONO,
                margin: 0,
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
        #interview input::placeholder {
          color: ${FAINT};
          opacity: 0.9;
        }
      `}</style>
    </section>
  );
}
