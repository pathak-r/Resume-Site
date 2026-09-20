import { useEffect, useRef, useState } from "react";

/**
 * rohit.agent — interview chat revealed inside the work list.
 */

const INK = "var(--cat-ink)";
const MUTED = "var(--cat-text-secondary)";
const FAINT = "var(--cat-text-tertiary)";
const RULE = "var(--cat-rule)";
const UI = "var(--cat-font-body)";

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
  u100: { label: "Factory maintenance planning", anchor: "#card-u100" },
  jev: { label: "How Good is JEV", anchor: "#card-jev" },
};

const STARTER_CHIPS = [
  "what's your notice period?",
  "walk me through the copilot",
  "why enterprise AI?",
];

const CHIP_POOLS: string[][] = [
  ["are you open to relocation?", "when can you start?", "what roles are you targeting?"],
  ["what went wrong on the copilot?", "how did you build the Volve demo?", "what's How Good is JEV?"],
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

type InterviewAgentProps = {
  onPin?: () => void;
};

export default function InterviewAgent({ onPin }: InterviewAgentProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [chipSet, setChipSet] = useState<string[]>(STARTER_CHIPS);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const turnCount = useRef(0);

  useEffect(() => {
    const onFocus = () => {
      onPin?.();
      window.setTimeout(() => inputRef.current?.focus(), 80);
    };
    window.addEventListener("agent:focus", onFocus);
    return () => window.removeEventListener("agent:focus", onFocus);
  }, [onPin]);

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

    onPin?.();
    setError(null);
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

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(String(res.status) + (errBody?.error ? `: ${errBody.error}` : ""));
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");
      const decoder = new TextDecoder();
      let buffer = "";
      let content = "";
      let sources: string[] | undefined;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";
        for (const part of parts) {
          const line = part.split("\n").find((l) => l.startsWith("data: "));
          if (!line) continue;
          let evt: { type?: string; content?: string; sources?: string[]; done?: boolean };
          try {
            evt = JSON.parse(line.slice(6));
          } catch {
            continue;
          }
          if (evt.type === "meta" && evt.sources) sources = evt.sources;
          if (evt.type === "token" && evt.content) content += evt.content;
          if (evt.type === "done") {
            content = evt.content ?? content;
            sources = evt.sources ?? sources;
          }
          const done = evt.type === "done";
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant") {
              next[next.length - 1] = {
                ...last,
                content,
                sources,
                card: done ? extractCard(content) : last.card,
              };
            }
            return next;
          });
        }
      }
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
          ? "I'm popular today — rate limit reached. Email me instead: write@rohitpathak.com"
          : "Something went sideways. Try again, or email me: write@rohitpathak.com"
      );
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div data-testid="section-interview">
      <p
        style={{
          margin: "0 0 0.65rem",
          fontSize: "0.82rem",
          color: FAINT,
          fontFamily: UI,
        }}
        data-testid="text-agent-rag"
      >
        Live. Answers from my CV, case studies, and how I work.
      </p>

      {messages.length > 0 && (
        <div
          ref={scrollRef}
          style={{
            maxHeight: "min(42vh, 420px)",
            minHeight: "160px",
            overflowY: "auto",
            marginBottom: "1rem",
          }}
          data-testid="agent-conversation"
        >
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} style={{ display: "flex", justifyContent: "flex-end", margin: "0 0 12px" }}>
                <span
                  style={{
                    fontSize: "0.92rem",
                    color: INK,
                    background: "var(--cat-accent-soft)",
                    border: `1px solid ${RULE}`,
                    padding: "10px 14px",
                    maxWidth: "75%",
                    fontFamily: UI,
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
                      fontFamily: UI,
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
                            document.querySelector(CARD_LINKS[m.card!].anchor)?.scrollIntoView({ behavior: "smooth" });
                          }}
                          style={{
                            color: INK,
                            textDecoration: "none",
                            borderBottom: `1px solid ${INK}`,
                          }}
                        >
                          See {CARD_LINKS[m.card].label} below
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
                          background: FAINT,
                          opacity: o,
                        }}
                      />
                    ))}
                  </div>
                )}
                {m.sources && m.sources.length > 0 && m.content && (
                  <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                    {m.sources.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: "0.72rem",
                          color: FAINT,
                          border: `1px solid ${RULE}`,
                          padding: "0.15rem 0.45rem",
                          fontFamily: UI,
                        }}
                      >
                        {s}
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
          style={{ fontSize: "0.88rem", color: INK, fontFamily: UI, margin: "0 0 0.75rem" }}
          data-testid="text-agent-error"
        >
          {error}
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        style={{
          borderBottom: `1px solid ${RULE}`,
          padding: "0 0 0.65rem",
          display: "flex",
          alignItems: "center",
          gap: "0.65rem",
        }}
      >
        <span style={{ color: FAINT, fontSize: "1rem", flexShrink: 0 }}>›</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => onPin?.()}
          placeholder="Ask about work, availability, failures, how I build."
          maxLength={500}
          data-testid="input-agent"
          style={{
            flex: 1,
            minWidth: 0,
            background: "transparent",
            border: "none",
            outline: "none",
            color: INK,
            fontSize: "0.88rem",
            fontFamily: UI,
          }}
        />
        <button
          type="submit"
          disabled={streaming}
          data-testid="button-agent-send"
          className="quiet-link"
          style={{ opacity: streaming ? 0.5 : 1 }}
        >
          Send
        </button>
      </form>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.85rem" }}>
        {chipSet.map((chip) => (
          <button
            key={chip}
            onClick={() => send(chip)}
            disabled={streaming}
            data-testid={`chip-agent-${chip.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}
            style={{
              fontSize: "0.78rem",
              color: MUTED,
              background: "transparent",
              border: `1px solid ${RULE}`,
              padding: "0.28rem 0.5rem",
              fontFamily: UI,
              cursor: streaming ? "default" : "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = INK;
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

      <style>{`
        #interview input,
        #interview input::placeholder {
          font-family: ${UI};
        }
        #interview input::placeholder {
          color: ${FAINT};
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
