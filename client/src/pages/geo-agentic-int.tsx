import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { Send, AlertTriangle, BarChart2, MessageSquare, RefreshCw } from "lucide-react";
import Navbar from "@/components/layout/navbar";

const GEO_API = "/api/geo";

async function geoFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${GEO_API}${path}`, init);
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || res.statusText);
  }
  return res.json() as Promise<T>;
}

type Meta = {
  wells: string[];
  date_min: string;
  date_max: string;
  total_wells: number;
  production_rows: number;
  total_oil_sm3: number;
};

type ChatMessage = { role: "user" | "assistant"; content: string };

const WELL_COLORS = [
  "#a83028", "#005f99", "#0ac4fd", "#34d399", "#fbbf24", "#fb923c", "#a78bfa",
];

function fmt(n: number | null | undefined, decimals = 0): string {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

// ─── Dashboard Tab ───────────────────────────────────────────────────────────

function Dashboard({ well, start, end }: { well: string; start: string; end: string }) {
  const [fieldRows, setFieldRows] = useState<any[]>([]);
  const [summaryRows, setSummaryRows] = useState<any[]>([]);
  const [detailRows, setDetailRows] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);
    (async () => {
      try {
        if (well === "All Wells") {
          const q = new URLSearchParams({ start, end });
          const [fo, su] = await Promise.all([
            geoFetch<{ rows: any[] }>(`/production/field-oil-by-well?${q}`),
            geoFetch<{ rows: any[] }>(`/production/summary?${q}`),
          ]);
          if (!cancelled) {
            setFieldRows(fo.rows);
            setSummaryRows(su.rows);
            setDetailRows([]);
            setMetrics(null);
          }
        } else {
          const q = new URLSearchParams({ well, start, end });
          const d = await geoFetch<{ rows: any[]; metrics: any }>(`/production/well-detail?${q}`);
          if (!cancelled) {
            setFieldRows([]);
            setSummaryRows([]);
            setDetailRows(d.rows);
            setMetrics(d.metrics);
          }
        }
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Load failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [well, start, end]);

  // Pivot field rows for area chart
  const wells = [...new Set(fieldRows.map((r) => r.WELL_NAME))].sort();
  const pivoted = (() => {
    const dates = [...new Set(fieldRows.map((r) => r.DATEPRD))].sort();
    return dates.map((d) => {
      const pt: Record<string, any> = { date: d.slice(0, 10) };
      for (const w of wells) {
        const r = fieldRows.find((x) => x.DATEPRD === d && x.WELL_NAME === w);
        pt[w] = r?.BORE_OIL_VOL ?? 0;
      }
      return pt;
    });
  })();

  // Thin out points for performance (max 300 per series)
  const thin = (arr: any[], max = 300) => {
    if (arr.length <= max) return arr;
    const step = Math.ceil(arr.length / max);
    return arr.filter((_, i) => i % step === 0);
  };

  if (err) return <div style={{ color: "#a83028", padding: "1rem", fontSize: "0.9rem" }}>{err}</div>;

  return (
    <div className="space-y-8">
      {/* KPI row */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Oil (Sm³)", value: fmt(metrics.total_oil_sm3) },
            { label: "Avg Water Cut", value: `${fmt(metrics.avg_water_cut_pct, 1)}%` },
            { label: "Production Days", value: fmt(metrics.production_days) },
            { label: "Avg WHP (bar)", value: fmt(metrics.avg_whp, 1) },
          ].map((k) => (
            <div
              key={k.label}
              className="surface-lowest shadow-ambient rounded-2xl p-5"
              data-testid={`kpi-${k.label.replace(/\W+/g, "-").toLowerCase()}`}
            >
              <div className="label-meta mb-1" style={{ color: "#abadae" }}>{k.label}</div>
              <div className="font-bold text-xl" style={{ color: "var(--lf-on-surface)", letterSpacing: "-0.02em" }}>
                {k.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Field oil by well area chart */}
      {well === "All Wells" && pivoted.length > 0 && (
        <div className="surface-lowest shadow-ambient rounded-2xl p-6">
          <div className="label-meta mb-4" style={{ color: "var(--lf-primary)" }}>Daily Oil Production by Well (Sm³)</div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={thin(pivoted)} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eff1f2" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#abadae" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11, fill: "#abadae" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "none", borderRadius: "1rem", boxShadow: "0 8px 32px rgba(44,47,48,0.1)", fontSize: "0.8rem" }} />
              <Legend wrapperStyle={{ fontSize: "0.78rem", paddingTop: "1rem" }} />
              {wells.map((w, i) => (
                <Area key={w} type="monotone" dataKey={w} stackId="1"
                  stroke={WELL_COLORS[i % WELL_COLORS.length]}
                  fill={WELL_COLORS[i % WELL_COLORS.length]}
                  fillOpacity={0.18}
                  strokeWidth={1.5}
                  dot={false}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Well detail charts */}
      {well !== "All Wells" && detailRows.length > 0 && (() => {
        const chartData = thin(detailRows.map((r) => ({
          date: r.DATEPRD?.slice(0, 10),
          oil: r.BORE_OIL_VOL,
          water: r.BORE_WAT_VOL,
          wc: r.WATER_CUT_PCT,
          whp: r.AVG_WHP_P > 0 ? r.AVG_WHP_P : null,
        })));
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="surface-lowest shadow-ambient rounded-2xl p-6">
              <div className="label-meta mb-4" style={{ color: "var(--lf-primary)" }}>Oil & Water Production (Sm³)</div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eff1f2" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#abadae" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10, fill: "#abadae" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "#fff", border: "none", borderRadius: "1rem", boxShadow: "0 8px 32px rgba(44,47,48,0.1)", fontSize: "0.78rem" }} />
                  <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                  <Area type="monotone" dataKey="oil" stroke="#a83028" fill="#a83028" fillOpacity={0.15} strokeWidth={1.5} dot={false} name="Oil" />
                  <Area type="monotone" dataKey="water" stroke="#005f99" fill="#005f99" fillOpacity={0.12} strokeWidth={1.5} dot={false} name="Water" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="surface-lowest shadow-ambient rounded-2xl p-6">
              <div className="label-meta mb-4" style={{ color: "var(--lf-secondary)" }}>Water Cut % & WHP (bar)</div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eff1f2" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#abadae" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#abadae" }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#abadae" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "#fff", border: "none", borderRadius: "1rem", boxShadow: "0 8px 32px rgba(44,47,48,0.1)", fontSize: "0.78rem" }} />
                  <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                  <Line yAxisId="left" type="monotone" dataKey="wc" stroke="#0ac4fd" strokeWidth={1.5} dot={false} name="Water Cut %" />
                  <Line yAxisId="right" type="monotone" dataKey="whp" stroke="#fbbf24" strokeWidth={1.5} dot={false} name="WHP (bar)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })()}

      {/* Well summary table */}
      {summaryRows.length > 0 && (
        <div className="surface-lowest shadow-ambient rounded-2xl p-6 overflow-x-auto">
          <div className="label-meta mb-4" style={{ color: "var(--lf-tertiary)" }}>Well Summary</div>
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {Object.keys(summaryRows[0]).map((k) => (
                  <th key={k} className="text-left py-2 pr-6 label-meta" style={{ color: "#abadae", whiteSpace: "nowrap" }}>
                    {k.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summaryRows.map((row, i) => (
                <tr key={i} style={{ borderTop: "1px solid #eff1f2" }}>
                  {Object.values(row).map((v: any, j) => (
                    <td key={j} className="py-2.5 pr-6" style={{ color: "var(--lf-on-surface)", whiteSpace: "nowrap" }}>
                      {v === null || v === undefined ? "—" : typeof v === "number" ? fmt(v, 1) : String(v).slice(0, 10)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 py-8 justify-center" style={{ color: "#abadae" }}>
          <RefreshCw className="w-4 h-4 animate-spin" /> Loading data…
        </div>
      )}
    </div>
  );
}

// ─── Chat Tab ─────────────────────────────────────────────────────────────────

function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setErr(null);
    const prior = messages;
    const next: ChatMessage[] = [...prior, { role: "user", content: text }];
    setMessages(next);
    setBusy(true);
    try {
      const data = await geoFetch<{ response: string; sources: any[] }>("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: prior }),
      });
      setMessages([...next, { role: "assistant", content: data.response }]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Chat failed");
      setMessages(prior);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col" style={{ height: "60vh", minHeight: "400px" }}>
      <div
        className="flex-1 overflow-y-auto rounded-2xl p-6 mb-4 space-y-4"
        style={{ background: "var(--lf-surface-container-low, #eff1f2)" }}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <MessageSquare className="w-10 h-10" style={{ color: "#abadae" }} />
            <p className="label-meta" style={{ color: "#abadae" }}>Ask about production trends, anomalies, or well documents</p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {[
                "What anomalies were detected across all wells?",
                "Summarise oil production for well F-11 H",
                "What was the water cut trend for F-15 D?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="px-4 py-2 rounded-full surface-lowest shadow-ambient text-sm font-medium transition-all"
                  style={{ color: "var(--lf-on-surface)" }}
                  data-testid={`chat-suggestion-${q.slice(0, 10).replace(/\W/g, "")}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[80%] rounded-2xl px-5 py-3.5"
              style={{
                background: m.role === "user"
                  ? "linear-gradient(135deg, #a83028, #ff7668)"
                  : "#ffffff",
                color: m.role === "user" ? "#fff" : "var(--lf-on-surface)",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                boxShadow: m.role === "assistant" ? "0 2px 16px rgba(44,47,48,0.06)" : "none",
                whiteSpace: "pre-wrap",
              }}
              data-testid={`chat-message-${i}`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {busy && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-5 py-3.5 surface-lowest shadow-ambient flex items-center gap-2" style={{ fontSize: "0.85rem", color: "#abadae" }}>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Thinking…
            </div>
          </div>
        )}
        {err && <p className="text-sm" style={{ color: "#a83028" }}>{err}</p>}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Ask about the Volve field…"
          disabled={busy}
          rows={1}
          data-testid="input-chat"
          className="flex-1 resize-none rounded-full px-5 py-3 text-sm font-medium outline-none transition-all"
          style={{
            background: "var(--lf-surface-container-low, #eff1f2)",
            color: "var(--lf-on-surface)",
            border: "none",
          }}
          onFocus={e => e.currentTarget.style.background = "#ffffff"}
          onBlur={e => e.currentTarget.style.background = "var(--lf-surface-container-low, #eff1f2)"}
        />
        <button
          onClick={send}
          disabled={busy || !input.trim()}
          data-testid="button-send-chat"
          className="btn-primary-gradient w-11 h-11 flex items-center justify-center shrink-0 disabled:opacity-40"
          style={{ borderRadius: "9999px" }}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Anomalies Tab ────────────────────────────────────────────────────────────

function Anomalies({ well }: { well: string }) {
  const [rows, setRows] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const q = new URLSearchParams();
    if (well && well !== "All Wells") q.set("well", well);
    geoFetch<{ rows: any[]; counts: Record<string, number> }>(`/anomalies?${q}`)
      .then((d) => { if (!cancelled) { setRows(d.rows); setCounts(d.counts); } })
      .catch((e) => { if (!cancelled) setErr(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [well]);

  const severityColor: Record<string, string> = {
    Critical: "#a83028", High: "#ff7668", Medium: "#fbbf24",
  };
  const cols = rows[0] ? Object.keys(rows[0]).filter(k => !["BORE_OIL_VOL","BORE_WAT_VOL","BORE_GAS_VOL","WATER_CUT_PCT","AVG_WHP_P","GOR"].includes(k)) : [];

  return (
    <div className="space-y-6">
      {/* Severity counts */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(counts).map(([sev, cnt]) => (
          <div key={sev} className="surface-lowest shadow-ambient rounded-2xl px-6 py-4 flex items-center gap-3" data-testid={`anomaly-count-${sev.toLowerCase()}`}>
            <AlertTriangle className="w-4 h-4" style={{ color: severityColor[sev] || "#abadae" }} />
            <div>
              <div className="label-meta" style={{ color: "#abadae" }}>{sev}</div>
              <div className="font-bold text-lg" style={{ color: "var(--lf-on-surface)", letterSpacing: "-0.02em" }}>{cnt}</div>
            </div>
          </div>
        ))}
        {Object.keys(counts).length === 0 && !loading && (
          <p className="text-sm" style={{ color: "#abadae" }}>No anomalies detected for the selected filter.</p>
        )}
      </div>

      {/* Table */}
      {rows.length > 0 && (
        <div className="surface-lowest shadow-ambient rounded-2xl p-6 overflow-x-auto">
          <div className="label-meta mb-4" style={{ color: "var(--lf-primary)" }}>Anomaly Records</div>
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {cols.map(k => (
                  <th key={k} className="text-left py-2 pr-6 label-meta" style={{ color: "#abadae", whiteSpace: "nowrap" }}>
                    {k.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 100).map((row, i) => (
                <tr key={i} style={{ borderTop: "1px solid #eff1f2" }} data-testid={`anomaly-row-${i}`}>
                  {cols.map((k, j) => (
                    <td key={j} className="py-2.5 pr-6" style={{
                      color: k === "SEVERITY" ? (severityColor[row[k]] || "var(--lf-on-surface)") : "var(--lf-on-surface)",
                      fontWeight: k === "SEVERITY" ? 700 : 400,
                      whiteSpace: "nowrap",
                    }}>
                      {row[k] === null || row[k] === undefined ? "—" : typeof row[k] === "number" ? fmt(row[k], 2) : String(row[k]).slice(0, 20)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 py-4" style={{ color: "#abadae" }}>
          <RefreshCw className="w-4 h-4 animate-spin" /> Loading anomalies…
        </div>
      )}
      {err && <p className="text-sm" style={{ color: "#a83028" }}>{err}</p>}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

type Tab = "dashboard" | "chat" | "anomalies";

export default function GeoAgenticInt() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [statusMsg, setStatusMsg] = useState("");
  const [meta, setMeta] = useState<Meta | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [well, setWell] = useState("All Wells");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const h = await geoFetch<{ ok: boolean; error: string | null }>("/health");
      if (!h.ok) {
        setStatus("error");
        setStatusMsg(h.error || "Backend data not loaded");
        return;
      }
      const m = await geoFetch<Meta>("/meta");
      setMeta(m);
      setStart((s) => s || m.date_min);
      setEnd((e) => e || m.date_max);
      setStatus("ok");
    } catch (e) {
      setStatus("error");
      setStatusMsg(e instanceof Error ? e.message : "Cannot reach API");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart2 },
    { id: "chat", label: "AI Chat", icon: MessageSquare },
    { id: "anomalies", label: "Anomalies", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen surface-base">
      <Navbar />

      {/* Page header */}
      <div
        className="surface-low"
        style={{ paddingTop: "7rem", paddingBottom: "2rem" }}
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="label-meta block mb-3" style={{ color: "var(--lf-primary)" }}>
              Geo-Agentic Intelligence
            </span>
            <h1
              className="font-bold mb-2"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.02em", color: "var(--lf-on-surface)" }}
              data-testid="heading-geo-page"
            >
              Volve Field RAG Explorer
            </h1>
            <p style={{ fontSize: "1rem", color: "#6b7071", maxWidth: "560px", lineHeight: 1.6 }}>
              Production analytics, anomaly detection, and AI-powered Q&A over the Equinor Volve dataset.
            </p>

            {/* Well + Date filters */}
            {meta && (
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <select
                  value={well}
                  onChange={(e) => setWell(e.target.value)}
                  data-testid="select-well"
                  className="rounded-full px-4 py-2 text-sm font-medium outline-none"
                  style={{ background: "#ffffff", color: "var(--lf-on-surface)", border: "none", boxShadow: "0 2px 12px rgba(44,47,48,0.07)" }}
                >
                  <option value="All Wells">All Wells</option>
                  {meta.wells.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={start}
                  min={meta.date_min}
                  max={meta.date_max}
                  onChange={(e) => setStart(e.target.value)}
                  data-testid="input-date-start"
                  className="rounded-full px-4 py-2 text-sm font-medium outline-none"
                  style={{ background: "#ffffff", color: "var(--lf-on-surface)", border: "none", boxShadow: "0 2px 12px rgba(44,47,48,0.07)" }}
                />
                <input
                  type="date"
                  value={end}
                  min={meta.date_min}
                  max={meta.date_max}
                  onChange={(e) => setEnd(e.target.value)}
                  data-testid="input-date-end"
                  className="rounded-full px-4 py-2 text-sm font-medium outline-none"
                  style={{ background: "#ffffff", color: "var(--lf-on-surface)", border: "none", boxShadow: "0 2px 12px rgba(44,47,48,0.07)" }}
                />

                {/* Meta chips */}
                <div className="flex gap-2 ml-2">
                  <span className="chip-teal">{meta.total_wells} Wells</span>
                  <span className="chip-teal">{fmt(meta.total_oil_sm3)} Sm³ Total</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 max-w-6xl py-8">

        {/* Status states */}
        {status === "loading" && (
          <div className="flex items-center justify-center py-24 gap-3" style={{ color: "#abadae" }}>
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Connecting to backend API…</span>
          </div>
        )}

        {status === "error" && (
          <div className="surface-lowest shadow-ambient rounded-2xl p-8 max-w-xl">
            <div className="label-meta mb-2" style={{ color: "#a83028" }}>Backend Unavailable</div>
            <p className="text-sm mb-4" style={{ color: "#6b7071" }}>{statusMsg}</p>
            <button
              onClick={load}
              data-testid="button-retry"
              className="btn-primary-gradient px-6 py-2.5 text-sm font-semibold flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        )}

        {status === "ok" && (
          <>
            {/* Tab nav */}
            <div className="flex gap-2 mb-8">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  data-testid={`tab-${id}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                  style={{
                    background: tab === id ? "linear-gradient(135deg, #a83028, #ff7668)" : "#ffffff",
                    color: tab === id ? "#ffffff" : "var(--lf-on-surface)",
                    boxShadow: "0 2px 12px rgba(44,47,48,0.07)",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {tab === "dashboard" && <Dashboard well={well} start={start} end={end} />}
              {tab === "chat" && <Chat />}
              {tab === "anomalies" && <Anomalies well={well} />}
            </motion.div>
          </>
        )}
      </div>

      <footer className="py-8 text-center" style={{ color: "#abadae", fontSize: "0.8rem" }}>
        Volve dataset — Equinor open data · Geo-Agentic RAG
      </footer>
    </div>
  );
}
