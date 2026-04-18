import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  ScatterChart, Scatter, ZAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceArea,
} from "recharts";
import { Send, AlertTriangle, BarChart2, MessageSquare, RefreshCw, GitCompare, ArrowLeftRight } from "lucide-react";
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
  producer_wells: string[];
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

// ─── Well Detail Charts (separate component to avoid IIFE sizing bugs) ───────

const CHART_AXIS = { tick: { fontSize: 10, fill: "#7A7771" }, tickLine: false as const, axisLine: false as const };
const CHART_GRID = { strokeDasharray: "3 3", stroke: "rgba(242,239,232,0.08)" };
const CHART_TOOLTIP = { contentStyle: { background: "#1C1C1C", border: "0.5px solid rgba(242,239,232,0.15)", borderRadius: "10px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", fontSize: "0.78rem", color: "#F2EFE8" } };

function ChartCard({ title, color, height = 220, children }: { title: string; color: string; height?: number; children: React.ReactElement }) {
  return (
    <div className="surface-lowest shadow-ambient rounded-2xl p-6">
      <div className="label-meta mb-4">{title}</div>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function WellDetailCharts({ rows }: { rows: any[] }) {
  const data = rows.map((r) => ({
    date: String(r.DATEPRD ?? "").slice(0, 10),
    oil: r.BORE_OIL_VOL ?? 0,
    water: r.BORE_WAT_VOL ?? 0,
    wc: r.WATER_CUT_PCT ?? 0,
    whp: r.AVG_WHP_P > 0 ? r.AVG_WHP_P : null,
  }));

  return (
    <div className="flex flex-col gap-5">
      <ChartCard title="Oil & Water Production (Sm³)" color="#a83028">
        <LineChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
          <CartesianGrid {...CHART_GRID} />
          <XAxis dataKey="date" interval="preserveStartEnd" {...CHART_AXIS} />
          <YAxis {...CHART_AXIS} />
          <Tooltip {...CHART_TOOLTIP} />
          <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
          <Line type="monotone" dataKey="oil" stroke="#a83028" strokeWidth={1.5} dot={false} name="Oil (Sm³)" />
          <Line type="monotone" dataKey="water" stroke="#005f99" strokeWidth={1.5} dot={false} name="Water (Sm³)" />
        </LineChart>
      </ChartCard>

      <ChartCard title="Water Cut %" color="#0ac4fd">
        <LineChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
          <CartesianGrid {...CHART_GRID} />
          <XAxis dataKey="date" interval="preserveStartEnd" {...CHART_AXIS} />
          <YAxis {...CHART_AXIS} />
          <Tooltip {...CHART_TOOLTIP} />
          <Line type="monotone" dataKey="wc" stroke="#0ac4fd" strokeWidth={1.5} dot={false} name="WC %" />
        </LineChart>
      </ChartCard>

      <ChartCard title="Wellhead Pressure (bar)" color="#fbbf24">
        <LineChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
          <CartesianGrid {...CHART_GRID} />
          <XAxis dataKey="date" interval="preserveStartEnd" {...CHART_AXIS} />
          <YAxis {...CHART_AXIS} />
          <Tooltip {...CHART_TOOLTIP} />
          <Line type="monotone" dataKey="whp" stroke="#fbbf24" strokeWidth={1.5} dot={false} name="WHP (bar)" connectNulls />
        </LineChart>
      </ChartCard>
    </div>
  );
}

// ─── Dashboard Tab ───────────────────────────────────────────────────────────

function Dashboard({ well, start, end }: { well: string; start: string; end: string }) {
  const [fieldRows, setFieldRows] = useState<any[]>([]);
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
          const fo = await geoFetch<{ rows: any[] }>(`/production/field-oil-by-well?${q}`);
          if (!cancelled) {
            setFieldRows(fo.rows);
            setDetailRows([]);
            setMetrics(null);
          }
        } else {
          const q = new URLSearchParams({ well, start, end });
          const d = await geoFetch<{ rows: any[]; metrics: any }>(`/production/well-detail?${q}`);
          if (!cancelled) {
            setFieldRows([]);
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
      {/* Well title for single-well view */}
      {well !== "All Wells" && (
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--lf-on-surface)", letterSpacing: "-0.02em" }}>
            Well: {well}
          </h2>
        </div>
      )}

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
              <div className="label-meta mb-1" style={{ color: "#7A7771" }}>{k.label}</div>
              <div className="font-bold text-xl" style={{ color: "#F2EFE8", letterSpacing: "-0.02em" }}>
                {k.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Field oil by well area chart */}
      {well === "All Wells" && pivoted.length > 0 && (
        <div className="surface-lowest shadow-ambient rounded-2xl p-6">
          <div className="label-meta mb-4">Daily Oil Production by Well (Sm³)</div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={thin(pivoted)} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(242,239,232,0.08)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#7A7771" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11, fill: "#7A7771" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#1C1C1C", border: "0.5px solid rgba(242,239,232,0.15)", borderRadius: "10px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", fontSize: "0.8rem", color: "#F2EFE8" }} />
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
      {well !== "All Wells" && detailRows.length > 0 && (
        <WellDetailCharts rows={thin(detailRows)} />
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
        style={{ background: "#0F0F0F" }}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <MessageSquare className="w-10 h-10" style={{ color: "#7A7771" }} />
            <p className="label-meta" style={{ color: "#7A7771" }}>Ask about production trends, anomalies, or well documents</p>
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
                  style={{ color: "#F2EFE8", border: "0.5px solid rgba(242,239,232,0.25)" }}
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
                  : "#252525",
                color: m.role === "user" ? "#fff" : "#F2EFE8",
                fontSize: "0.9rem",
                lineHeight: 1.6,
                boxShadow: m.role === "assistant" ? "0 2px 16px rgba(0,0,0,0.4)" : "none",
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
            <div className="rounded-2xl px-5 py-3.5 surface-lowest shadow-ambient flex items-center gap-2" style={{ fontSize: "0.85rem", color: "#7A7771" }}>
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
            background: "#252525",
            color: "#F2EFE8",
            border: "0.5px solid rgba(242,239,232,0.15)",
          }}
          onFocus={e => e.currentTarget.style.background = "#2C2C2C"}
          onBlur={e => e.currentTarget.style.background = "#252525"}
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
      .then((d) => { if (!cancelled) { setRows(d.rows); setCounts(d.counts ?? {}); } })
      .catch((e) => { if (!cancelled) setErr(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [well]);

  const severityColor: Record<string, string> = {
    Critical: "#a83028", High: "#ff7668", Medium: "#fbbf24",
  };

  // Compute bar chart data: count by anomaly type
  const typeBars = Object.entries(
    rows.reduce<Record<string, number>>((acc, row) => {
      const t = String(row.ANOMALY_TYPE ?? "?");
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Scatter timeline data — ts must be numeric for recharts ScatterChart x-axis
  const scatterData = rows.map((row) => {
    const dateStr = String(row.DATEPRD ?? "").slice(0, 10);
    return {
      x: dateStr,
      ts: new Date(dateStr).getTime(),
      y: Number(row.VALUE ?? 0),
      z: String(row.ANOMALY_TYPE ?? ""),
      well: String(row.WELL_NAME ?? ""),
    };
  });

  const cols = ["DATEPRD", "WELL_NAME", "ANOMALY_TYPE", "METRIC", "VALUE", "SEVERITY"].filter(k =>
    rows[0] && k in rows[0]
  );

  return (
    <div className="space-y-6">
      {/* Severity count cards */}
      <div className="grid grid-cols-3 gap-4">
        {["Critical", "High", "Medium"].map((sev) => (
          <div
            key={sev}
            className="surface-lowest shadow-ambient rounded-2xl p-6"
            style={{ borderTop: `3px solid ${severityColor[sev]}` }}
            data-testid={`anomaly-count-${sev.toLowerCase()}`}
          >
            <div className="flex items-start justify-between mb-3">
              <AlertTriangle className="w-7 h-7" style={{ color: severityColor[sev] }} />
              {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ color: "#7A7771" }} />}
            </div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7A7771" }}>{sev}</div>
            <div className="text-5xl font-bold" style={{ color: "#F2EFE8", letterSpacing: "-0.03em", lineHeight: 1 }}>
              {counts[sev] ?? 0}
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart: by anomaly type */}
      {typeBars.length > 0 && (
        <ChartCard title="Anomalies by Type" color="#0ac4fd" height={260}>
          <BarChart data={typeBars} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 130 }}>
            <CartesianGrid {...CHART_GRID} horizontal={false} />
            <XAxis type="number" {...CHART_AXIS} />
            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: "#6b7071" }} tickLine={false} axisLine={false} />
            <Tooltip {...CHART_TOOLTIP} />
            <Bar dataKey="value" fill="#0ac4fd" radius={[0, 6, 6, 0]} name="Count" />
          </BarChart>
        </ChartCard>
      )}

      {/* Scatter: timeline using numeric timestamps on x-axis */}
      {scatterData.length > 0 && (
        <ChartCard title="Anomaly Timeline" color="#a83028" height={320}>
          <ScatterChart margin={{ top: 4, right: 16, bottom: 48, left: 8 }}>
            <CartesianGrid {...CHART_GRID} />
            <XAxis
              dataKey="ts"
              type="number"
              domain={["auto", "auto"]}
              scale="time"
              tickFormatter={(v) => new Date(v).toISOString().slice(0, 7)}
              {...CHART_AXIS}
              angle={-35}
              textAnchor="end"
              height={60}
              name="Date"
            />
            <YAxis dataKey="y" name="Value" {...CHART_AXIS} />
            <ZAxis dataKey="z" name="Type" range={[40, 40]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) =>
                active && payload?.[0] ? (
                  <div style={{ background: "#1C1C1C", border: "0.5px solid rgba(242,239,232,0.15)", borderRadius: "10px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", fontSize: "0.78rem", padding: "0.5rem 0.75rem" }}>
                    <div style={{ fontWeight: 600, color: "#F2EFE8", marginBottom: 2 }}>{payload[0].payload.well}</div>
                    <div style={{ color: "#A8A49B", fontSize: "0.75rem" }}>{payload[0].payload.z}</div>
                    <div style={{ color: "#F2EFE8", fontSize: "0.8rem" }}>{payload[0].payload.x} · {Number(payload[0].payload.y).toFixed(1)}</div>
                  </div>
                ) : null
              }
            />
            <Scatter data={scatterData} fill="#a83028" fillOpacity={0.65} />
          </ScatterChart>
        </ChartCard>
      )}

      {/* Table in scrollable frame */}
      {rows.length > 0 && (
        <div className="surface-lowest shadow-ambient rounded-2xl p-6">
          <div className="label-meta mb-4">Anomaly Records
            <span className="ml-2 font-normal" style={{ color: "var(--cat-text-tertiary)", textTransform: "none", letterSpacing: 0 }}>({rows.length} total)</span>
          </div>
          <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "380px" }}>
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead style={{ position: "sticky", top: 0, background: "#252525", zIndex: 1 }}>
                <tr>
                  {cols.map(k => (
                    <th key={k} className="text-left py-2 pr-6 label-meta" style={{ color: "#7A7771", whiteSpace: "nowrap" }}>
                      {k.replace(/_/g, " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(242,239,232,0.08)" }} data-testid={`anomaly-row-${i}`}>
                    {cols.map((k, j) => (
                      <td key={j} className="py-2 pr-6" style={{
                        color: k === "SEVERITY" ? (severityColor[row[k]] || "#F2EFE8") : "#F2EFE8",
                        fontWeight: k === "SEVERITY" ? 700 : 400,
                        whiteSpace: "nowrap",
                      }}>
                        {row[k] === null || row[k] === undefined ? "—" : typeof row[k] === "number" ? fmt(row[k], 2) : String(row[k]).slice(0, 24)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {rows.length === 0 && !loading && (
        <p className="text-sm" style={{ color: "#7A7771" }}>No anomalies detected for the selected filter.</p>
      )}
      {err && <p className="text-sm" style={{ color: "#a83028" }}>{err}</p>}
    </div>
  );
}

// ─── Well Comparison Tab ──────────────────────────────────────────────────────

type ComparisonData = {
  well_a: { name: string; series: any[]; metrics: any; decline: any };
  well_b: { name: string; series: any[]; metrics: any; decline: any };
  divergence: { day_start: number; day_end: number; d_oil: number; d_wc: number; metrics: string[] }[];
};

const COL_A = "#a83028";
const COL_B = "#0ac4fd";

function WellComparison({ producerWells }: { producerWells: string[] }) {
  const [wellA, setWellA] = useState(producerWells[0] ?? "");
  const [wellB, setWellB] = useState(producerWells[1] ?? "");
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    if (!wellA || !wellB || wellA === wellB) return;
    let cancelled = false;
    setLoading(true);
    setErr(null);
    setData(null);
    setAiInsight(null);
    const q = new URLSearchParams({ well_a: wellA, well_b: wellB });
    geoFetch<ComparisonData>(`/comparison?${q}`)
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setErr(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [wellA, wellB]);

  function swap() {
    setWellA(wellB);
    setWellB(wellA);
  }

  async function askAI() {
    if (!data) return;
    setLoadingAI(true);
    setAiInsight(null);
    const div = data.divergence;
    const divSummary = div.length > 0
      ? `Their production diverges significantly in ${div.length} period(s), most notably around day ${div[0].day_start}–${div[0].day_end} (oil diff: ${div[0].d_oil.toFixed(0)} Sm³/day, WC diff: ${div[0].d_wc.toFixed(1)}%).`
      : "No strong statistical divergence was detected.";
    const prompt = `Compare wells ${wellA} and ${wellB} from the Volve field. ${wellA} produced ${fmt(data.well_a.metrics.total_oil_sm3)} Sm³ over ${data.well_a.metrics.production_days} days (decline rate ${data.well_a.decline?.D_annual_pct?.toFixed(1) ?? "?"}%/yr, avg WC ${fmt(data.well_a.metrics.avg_water_cut_pct, 1)}%). ${wellB} produced ${fmt(data.well_b.metrics.total_oil_sm3)} Sm³ over ${data.well_b.metrics.production_days} days (decline rate ${data.well_b.decline?.D_annual_pct?.toFixed(1) ?? "?"}%/yr, avg WC ${fmt(data.well_b.metrics.avg_water_cut_pct, 1)}%). ${divSummary} Using their drilling and completion reports, explain the key reasons for any differences in their production performance.`;
    try {
      const res = await geoFetch<{ response: string }>("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, history: [] }),
      });
      setAiInsight(res.response);
    } catch (e) {
      setAiInsight("Could not reach the AI agent. Please try again.");
    } finally {
      setLoadingAI(false);
    }
  }

  // Merge both series onto a shared day x-axis
  const mergedOil = React.useMemo(() => {
    if (!data) return [];
    const mapA = new Map((data.well_a.series || []).map((r: any) => [r.day, r]));
    const mapB = new Map((data.well_b.series || []).map((r: any) => [r.day, r]));
    const trendA = new Map((data.well_a.decline?.trend || []).map((r: any) => [r.day, r.q_trend]));
    const trendB = new Map((data.well_b.decline?.trend || []).map((r: any) => [r.day, r.q_trend]));
    const allDays = Array.from(new Set([...mapA.keys(), ...mapB.keys(), ...trendA.keys(), ...trendB.keys()])).sort((a, b) => a - b);
    return allDays.map((day) => ({
      day,
      oil_a: mapA.get(day)?.oil ?? null,
      oil_b: mapB.get(day)?.oil ?? null,
      trend_a: trendA.get(day) ?? null,
      trend_b: trendB.get(day) ?? null,
    }));
  }, [data]);

  const mergedWC = React.useMemo(() => {
    if (!data) return [];
    const mapA = new Map((data.well_a.series || []).map((r: any) => [r.day, r.wc]));
    const mapB = new Map((data.well_b.series || []).map((r: any) => [r.day, r.wc]));
    const allDays = Array.from(new Set([...mapA.keys(), ...mapB.keys()])).sort((a, b) => a - b);
    return allDays.map((day) => ({ day, wc_a: mapA.get(day) ?? null, wc_b: mapB.get(day) ?? null }));
  }, [data]);

  const mergedWHP = React.useMemo(() => {
    if (!data) return [];
    const mapA = new Map((data.well_a.series || []).map((r: any) => [r.day, r.whp]));
    const mapB = new Map((data.well_b.series || []).map((r: any) => [r.day, r.whp]));
    const allDays = Array.from(new Set([...mapA.keys(), ...mapB.keys()])).sort((a, b) => a - b);
    return allDays.map((day) => ({ day, whp_a: mapA.get(day) ?? null, whp_b: mapB.get(day) ?? null }));
  }, [data]);

  const oilDivergence = data?.divergence.filter((d) => d.metrics.includes("oil")) ?? [];
  const wcDivergence = data?.divergence.filter((d) => d.metrics.includes("wc")) ?? [];

  const kpiRows = [
    { label: "Total Oil (Sm³)", a: fmt(data?.well_a.metrics.total_oil_sm3), b: fmt(data?.well_b.metrics.total_oil_sm3), numeric: true, aVal: data?.well_a.metrics.total_oil_sm3, bVal: data?.well_b.metrics.total_oil_sm3 },
    { label: "Production Days", a: fmt(data?.well_a.metrics.production_days), b: fmt(data?.well_b.metrics.production_days), numeric: true, aVal: data?.well_a.metrics.production_days, bVal: data?.well_b.metrics.production_days },
    { label: "Avg Water Cut", a: data ? `${fmt(data.well_a.metrics.avg_water_cut_pct, 1)}%` : "—", b: data ? `${fmt(data.well_b.metrics.avg_water_cut_pct, 1)}%` : "—", numeric: true, aVal: data?.well_a.metrics.avg_water_cut_pct, bVal: data?.well_b.metrics.avg_water_cut_pct, lowerIsBetter: true },
    { label: "Avg WHP (bar)", a: fmt(data?.well_a.metrics.avg_whp, 1), b: fmt(data?.well_b.metrics.avg_whp, 1), numeric: false },
    { label: "Decline Rate (%/yr)", a: data?.well_a.decline ? `${data.well_a.decline.D_annual_pct.toFixed(1)}%` : "—", b: data?.well_b.decline ? `${data.well_b.decline.D_annual_pct.toFixed(1)}%` : "—", numeric: true, aVal: data?.well_a.decline?.D_annual_pct, bVal: data?.well_b.decline?.D_annual_pct, lowerIsBetter: true },
    { label: "Initial Rate qi (Sm³/d)", a: fmt(data?.well_a.decline?.qi, 0), b: fmt(data?.well_b.decline?.qi, 0), numeric: false },
  ];

  return (
    <div className="space-y-6">
      {/* Well pickers */}
      <div className="surface-lowest shadow-ambient rounded-2xl p-6">
        <div className="label-meta mb-4">Select Wells to Compare</div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Well A */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: COL_A }} />
            <select
              value={wellA}
              onChange={(e) => setWellA(e.target.value)}
              data-testid="select-well-a"
              className="rounded-full px-4 py-2 text-sm font-semibold outline-none"
              style={{ background: `${COL_A}18`, color: COL_A, border: `1.5px solid ${COL_A}` }}
            >
              {producerWells.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          {/* Swap */}
          <button
            onClick={swap}
            data-testid="button-swap-wells"
            title="Swap wells"
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
            style={{ background: "#252525", color: "#7A7771" }}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          {/* Well B */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: COL_B }} />
            <select
              value={wellB}
              onChange={(e) => setWellB(e.target.value)}
              data-testid="select-well-b"
              className="rounded-full px-4 py-2 text-sm font-semibold outline-none"
              style={{ background: `${COL_B}18`, color: COL_B, border: `1.5px solid ${COL_B}` }}
            >
              {producerWells.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          {loading && <RefreshCw className="w-4 h-4 animate-spin ml-2" style={{ color: "#7A7771" }} />}

          {data && data.divergence.length > 0 && (
            <span className="chip-teal ml-2">{data.divergence.length} divergence period{data.divergence.length > 1 ? "s" : ""} flagged</span>
          )}
        </div>
        {wellA === wellB && (
          <p className="text-xs mt-3" style={{ color: "#7A7771" }}>Select two different wells to compare.</p>
        )}
        {err && <p className="text-xs mt-3" style={{ color: "#a83028" }}>{err}</p>}
      </div>

      {/* Ask AI panel — always visible once wells are selected */}
      {wellA !== wellB && (
        <div className="surface-lowest shadow-ambient rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="label-meta mb-1">AI Explanation</div>
              <p className="text-sm" style={{ color: "#A8A49B" }}>
                Ask the AI to explain why these wells perform differently, drawing from their drilling and completion reports.
              </p>
            </div>
            <button
              onClick={askAI}
              disabled={loadingAI}
              data-testid="button-ask-ai-comparison"
              className="btn-primary-gradient px-5 py-2.5 text-sm font-semibold flex items-center gap-2 shrink-0 disabled:opacity-50"
              style={{ borderRadius: "9999px" }}
            >
              {loadingAI ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loadingAI ? "Analysing…" : "Ask AI"}
            </button>
          </div>
          {aiInsight && (
            <div
              className="mt-5 rounded-2xl px-5 py-4 text-sm"
              style={{ background: "#252525", color: "#F2EFE8", lineHeight: 1.7, whiteSpace: "pre-wrap" }}
              data-testid="comparison-ai-insight"
            >
              {aiInsight}
            </div>
          )}
        </div>
      )}

      {data && (
        <>
          {/* KPI comparison table */}
          <div className="surface-lowest shadow-ambient rounded-2xl p-6 overflow-x-auto">
            <div className="label-meta mb-4">Key Metrics Comparison</div>
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th className="text-left py-2 pr-8 label-meta" style={{ color: "#7A7771" }}>Metric</th>
                  <th className="text-right py-2 pr-8 font-semibold" style={{ color: COL_A }}>{wellA}</th>
                  <th className="text-right py-2 font-semibold" style={{ color: COL_B }}>{wellB}</th>
                </tr>
              </thead>
              <tbody>
                {kpiRows.map((row) => {
                  const aWins = row.numeric && row.aVal != null && row.bVal != null && (row.lowerIsBetter ? row.aVal < row.bVal : row.aVal > row.bVal);
                  const bWins = row.numeric && row.aVal != null && row.bVal != null && (row.lowerIsBetter ? row.bVal < row.aVal : row.bVal > row.aVal);
                  return (
                    <tr key={row.label} style={{ borderTop: "1px solid rgba(242,239,232,0.08)" }}>
                      <td className="py-2.5 pr-8 label-meta" style={{ color: "#7A7771" }}>{row.label}</td>
                      <td className="py-2.5 pr-8 text-right font-semibold" style={{ color: aWins ? COL_A : "#F2EFE8" }}>{row.a}</td>
                      <td className="py-2.5 text-right font-semibold" style={{ color: bWins ? COL_B : "#F2EFE8" }}>{row.b}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Oil production chart with decline curves */}
          {mergedOil.length > 0 && (
            <ChartCard title="Oil Production vs Days on Production (Sm³/day)" color={COL_A} height={280}>
              <LineChart data={mergedOil} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
                <CartesianGrid {...CHART_GRID} />
                <XAxis dataKey="day" {...CHART_AXIS} label={{ value: "Days since first production", position: "insideBottom", offset: -2, fontSize: 10, fill: "#7A7771" }} />
                <YAxis {...CHART_AXIS} />
                <Tooltip {...CHART_TOOLTIP} labelFormatter={(v) => `Day ${v}`} />
                <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                {oilDivergence.map((d, i) => (
                  <ReferenceArea key={i} x1={d.day_start} x2={d.day_end} fill="#fbbf2422" stroke="#fbbf24" strokeOpacity={0.3} />
                ))}
                <Line type="monotone" dataKey="oil_a" stroke={COL_A} strokeWidth={1.5} dot={false} name={`${wellA} Oil`} connectNulls />
                <Line type="monotone" dataKey="oil_b" stroke={COL_B} strokeWidth={1.5} dot={false} name={`${wellB} Oil`} connectNulls />
                <Line type="monotone" dataKey="trend_a" stroke={COL_A} strokeWidth={1} strokeDasharray="6 3" dot={false} name={`${wellA} Decline`} connectNulls />
                <Line type="monotone" dataKey="trend_b" stroke={COL_B} strokeWidth={1} strokeDasharray="6 3" dot={false} name={`${wellB} Decline`} connectNulls />
              </LineChart>
            </ChartCard>
          )}

          {/* Water cut chart */}
          {mergedWC.length > 0 && (
            <ChartCard title="Water Cut % Trajectory" color="#6b7071" height={240}>
              <LineChart data={mergedWC} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
                <CartesianGrid {...CHART_GRID} />
                <XAxis dataKey="day" {...CHART_AXIS} label={{ value: "Days since first production", position: "insideBottom", offset: -2, fontSize: 10, fill: "#7A7771" }} />
                <YAxis {...CHART_AXIS} domain={[0, 100]} />
                <Tooltip {...CHART_TOOLTIP} labelFormatter={(v) => `Day ${v}`} />
                <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                {wcDivergence.map((d, i) => (
                  <ReferenceArea key={i} x1={d.day_start} x2={d.day_end} fill="#a8302822" stroke="#a83028" strokeOpacity={0.3} />
                ))}
                <Line type="monotone" dataKey="wc_a" stroke={COL_A} strokeWidth={1.5} dot={false} name={`${wellA} WC%`} connectNulls />
                <Line type="monotone" dataKey="wc_b" stroke={COL_B} strokeWidth={1.5} dot={false} name={`${wellB} WC%`} connectNulls />
              </LineChart>
            </ChartCard>
          )}

          {/* WHP chart */}
          {mergedWHP.length > 0 && (
            <ChartCard title="Wellhead Pressure (bar)" color="#fbbf24" height={220}>
              <LineChart data={mergedWHP} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
                <CartesianGrid {...CHART_GRID} />
                <XAxis dataKey="day" {...CHART_AXIS} label={{ value: "Days since first production", position: "insideBottom", offset: -2, fontSize: 10, fill: "#7A7771" }} />
                <YAxis {...CHART_AXIS} />
                <Tooltip {...CHART_TOOLTIP} labelFormatter={(v) => `Day ${v}`} />
                <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                <Line type="monotone" dataKey="whp_a" stroke={COL_A} strokeWidth={1.5} dot={false} name={`${wellA} WHP`} connectNulls />
                <Line type="monotone" dataKey="whp_b" stroke={COL_B} strokeWidth={1.5} dot={false} name={`${wellB} WHP`} connectNulls />
              </LineChart>
            </ChartCard>
          )}

          {/* Divergence summary */}
          {data.divergence.length > 0 && (
            <div className="surface-lowest shadow-ambient rounded-2xl p-6">
              <div className="label-meta mb-3">
                Flagged Divergence Periods
                <span className="ml-2 font-normal" style={{ color: "var(--cat-text-tertiary)", textTransform: "none", letterSpacing: 0 }}>(shaded bands on charts above)</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {data.divergence.map((d, i) => (
                  <div key={i} className="flex items-center gap-4 py-2" style={{ borderTop: i > 0 ? "1px solid rgba(242,239,232,0.08)" : "none" }}>
                    <span className="text-xs font-semibold rounded-full px-3 py-1" style={{ background: "#fbbf2418", color: "#fbbf24" }}>
                      Day {d.day_start}–{d.day_end}
                    </span>
                    <span className="text-sm" style={{ color: "#A8A49B" }}>
                      {d.metrics.includes("oil") && <span className="mr-3">Oil Δ: <strong style={{ color: "#F2EFE8" }}>{d.d_oil > 0 ? "+" : ""}{d.d_oil.toFixed(0)} Sm³/d</strong></span>}
                      {d.metrics.includes("wc") && <span>WC Δ: <strong style={{ color: "#F2EFE8" }}>{d.d_wc > 0 ? "+" : ""}{d.d_wc.toFixed(1)}%</strong></span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

type Tab = "dashboard" | "chat" | "anomalies" | "comparison";

export default function GeoAgenticInt() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [statusMsg, setStatusMsg] = useState("");
  const [meta, setMeta] = useState<Meta | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [well, setWell] = useState("All Wells");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [retryCount, setRetryCount] = useState(0);
  const [warmingUp, setWarmingUp] = useState(false);

  const load = useCallback(async (attempt = 0) => {
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
      setWarmingUp(false);
      setStatus("ok");
    } catch (e) {
      // The Python backend can take up to ~3 minutes to start in production
      // (loading FAISS index + LLM packages). Keep retrying silently.
      if (attempt < 24) {
        setWarmingUp(true);
        setStatus("loading");
        setRetryCount(attempt + 1);
        setTimeout(() => load(attempt + 1), 10_000); // retry every 10s
      } else {
        setWarmingUp(false);
        setStatus("error");
        setStatusMsg(e instanceof Error ? e.message : "Cannot reach API");
      }
    }
  }, []);

  useEffect(() => { load(0); }, [load]);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "dashboard", label: "Production Dashboard", icon: BarChart2 },
    { id: "comparison", label: "Well Comparison", icon: GitCompare },
    { id: "chat", label: "AI Assistant", icon: MessageSquare },
    { id: "anomalies", label: "Anomaly Detection", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--cat-bg)" }}>
      <Navbar />

      {/* Page header — catalog panel */}
      <section className="catalog-section" style={{ paddingTop: "5.5rem" }} data-testid="section-geo-header">
        <div className="px-4">
          <div className="catalog-panel" style={{ maxWidth: "1120px", padding: "2.5rem" }}>
            <div className="catalog-entry-row">
              <div className="catalog-entry-row__inner">
                {/* Index column */}
                <div>
                  <p style={{
                    fontSize: "var(--cat-fs-eyebrow)",
                    letterSpacing: "var(--cat-ls-eyebrow)",
                    textTransform: "uppercase",
                    color: "var(--cat-text-tertiary)",
                    fontWeight: 500,
                    margin: "0 0 0.75rem",
                  }}>
                    Project № 01
                  </p>
                  <p style={{
                    fontSize: "72px",
                    fontWeight: 500,
                    lineHeight: 1,
                    color: "var(--cat-text)",
                    margin: 0,
                    letterSpacing: "-0.03em",
                  }}>
                    01
                  </p>
                  <p style={{
                    fontSize: "var(--cat-fs-eyebrow)",
                    letterSpacing: "var(--cat-ls-eyebrow)",
                    textTransform: "uppercase",
                    color: "var(--cat-text-tertiary)",
                    fontWeight: 500,
                    margin: "0.75rem 0 0",
                  }}>
                    Geo-Agentic AI
                  </p>
                </div>

                {/* Content column */}
                <div>
                  <p style={{
                    fontSize: "var(--cat-fs-body-sm)",
                    color: "var(--cat-text-secondary)",
                    margin: "0 0 0.5rem",
                  }}>
                    Filed under: agentic RAG · production analytics · Equinor Volve
                  </p>

                  <h1
                    style={{
                      fontSize: "var(--cat-fs-h1)",
                      fontWeight: 500,
                      lineHeight: 1.15,
                      letterSpacing: "-0.02em",
                      color: "var(--cat-text)",
                      margin: "0 0 1rem",
                    }}
                    data-testid="heading-geo-page"
                  >
                    Volve Field RAG Explorer
                  </h1>

                  <p style={{
                    fontSize: "var(--cat-fs-body)",
                    lineHeight: "var(--cat-lh-body)",
                    color: "var(--cat-text-secondary)",
                    margin: "0 0 1rem",
                  }}>
                    Daily drilling reports, production data, and well completion reports — both structured and unstructured — collected from Equinor's Volve field, the most comprehensive open subsurface dataset ever released from the Norwegian Continental Shelf, ingested into an agentic RAG system.
                  </p>

                  <p style={{
                    fontSize: "var(--cat-fs-body)",
                    lineHeight: "var(--cat-lh-body)",
                    color: "var(--cat-text-secondary)",
                    margin: "0 0 0.5rem",
                  }}>
                    Visualizes production trends and anomalies, and answers questions like:
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.25rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    {[
                      "Why is this well's water cut rising?",
                      "What's the decline rate for well F-1 C over the last 12 months?",
                      "What drilling problems in F-12 could explain current production behavior?",
                    ].map((q) => (
                      <li key={q} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", fontSize: "var(--cat-fs-body-sm)", color: "var(--cat-text-secondary)", lineHeight: 1.6 }}>
                        <span style={{ color: "var(--cat-text-tertiary)", marginTop: "0.1rem", flexShrink: 0 }}>—</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content — aligned to catalog panel width */}
      <div className="px-4 py-8" style={{ maxWidth: "1120px", margin: "0 auto" }}>

        {/* Status states */}
        {status === "loading" && (
          <div className="flex items-center justify-center py-24 gap-3" style={{ color: "#7A7771" }}>
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Connecting to backend API…</span>
          </div>
        )}

        {status === "error" && (
          <div className="surface-lowest shadow-ambient rounded-2xl p-8 max-w-xl">
            <div className="label-meta mb-2" style={{ color: "#a83028" }}>Backend unavailable</div>
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
            {/* Filter bar — sits with the data it controls */}
            {meta && (
              <div
                className="flex flex-wrap items-center gap-2 mb-6"
                data-testid="filter-bar"
              >
                <span style={{
                  fontSize: "var(--cat-fs-eyebrow)",
                  letterSpacing: "var(--cat-ls-eyebrow)",
                  textTransform: "uppercase",
                  color: "var(--cat-text-tertiary)",
                  fontWeight: 500,
                  marginRight: "0.25rem",
                }}>
                  Filters
                </span>
                {(() => {
                  const filterControlStyle: React.CSSProperties = {
                    fontSize: "var(--cat-fs-tag)",
                    height: "32px",
                    padding: "0 10px",
                    borderRadius: "var(--cat-radius)",
                    border: "var(--cat-rule-width) solid var(--cat-rule)",
                    background: "var(--cat-bg-card)",
                    color: "var(--cat-text)",
                    fontWeight: 500,
                    fontFamily: "var(--cat-font)",
                    outline: "none",
                    boxSizing: "border-box",
                    lineHeight: 1,
                    minWidth: "150px",
                  };
                  return (
                    <>
                      <select
                        value={well}
                        onChange={(e) => setWell(e.target.value)}
                        data-testid="select-well"
                        style={{ ...filterControlStyle, cursor: "pointer", appearance: "auto" }}
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
                        style={filterControlStyle}
                      />
                      <input
                        type="date"
                        value={end}
                        min={meta.date_min}
                        max={meta.date_max}
                        onChange={(e) => setEnd(e.target.value)}
                        data-testid="input-date-end"
                        style={filterControlStyle}
                      />
                    </>
                  );
                })()}
                <span className="catalog-tag" style={{ marginLeft: "0.5rem" }}>{meta.total_wells} wells</span>
                <span className="catalog-tag">{fmt(meta.total_oil_sm3)} Sm³ total</span>
              </div>
            )}

            {/* Tab nav — catalog style */}
            <div className="flex flex-wrap gap-2 mb-8" style={{ borderBottom: "var(--cat-rule-width) solid var(--cat-rule)", paddingBottom: "1rem" }}>
              {tabs.map(({ id, label, icon: Icon }) => {
                const active = tab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    data-testid={`tab-${id}`}
                    className="catalog-btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      borderColor: active ? "var(--cat-text)" : "var(--cat-rule)",
                      color: active ? "var(--cat-text)" : "var(--cat-text-secondary)",
                      background: "transparent",
                      fontWeight: active ? 600 : 500,
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div key={tab}>
              {tab === "dashboard" && <Dashboard well={well} start={start} end={end} />}
              {tab === "chat" && <Chat />}
              {tab === "anomalies" && <Anomalies well={well} />}
              {tab === "comparison" && <WellComparison producerWells={meta?.producer_wells ?? meta?.wells ?? []} />}
            </div>
          </>
        )}
      </div>

      <footer className="py-8 text-center" style={{ color: "var(--cat-text-tertiary)", fontSize: "var(--cat-fs-eyebrow)", letterSpacing: "var(--cat-ls-eyebrow)", textTransform: "uppercase" }}>
        Volve dataset · Equinor open data · Geo-Agentic RAG
      </footer>

    </div>
  );
}
