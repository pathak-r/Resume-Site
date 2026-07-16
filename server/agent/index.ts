/**
 * rohit.agent — /api/agent/chat
 * Embeds the visitor's question, retrieves top-k corpus chunks by cosine similarity,
 * streams a grounded answer from OpenAI via SSE, and logs the exchange.
 */

import type { Request, Response } from "express";
import { createHash } from "crypto";
import { readFileSync } from "fs";
import path from "path";
import { buildSystemPrompt } from "./system-prompt";

const EMBEDDING_MODEL = "text-embedding-3-small";
const CHAT_MODEL = process.env.AGENT_MODEL || "gpt-4o-mini";
const TOP_K = 6;
const MAX_QUESTION_CHARS = 500;
const MAX_HISTORY_MESSAGES = 12;
const MAX_CONVERSATION_MESSAGES = 40;
const MAX_OUTPUT_TOKENS = 400;

// --- rate limiting (in-memory; per-IP hourly + global daily) ---
const RATE_LIMIT_PER_HOUR = 50;
const GLOBAL_LIMIT_PER_DAY = 500;
const ipBuckets = new Map<string, { count: number; resetAt: number }>();
let globalBucket = { count: 0, resetAt: Date.now() + 86_400_000 };

function rateLimited(ip: string): boolean {
  const now = Date.now();
  if (now > globalBucket.resetAt) globalBucket = { count: 0, resetAt: now + 86_400_000 };
  if (globalBucket.count >= GLOBAL_LIMIT_PER_DAY) return true;

  const bucket = ipBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    ipBuckets.set(ip, { count: 1, resetAt: now + 3_600_000 });
    globalBucket.count++;
    return false;
  }
  if (bucket.count >= RATE_LIMIT_PER_HOUR) return true;
  bucket.count++;
  globalBucket.count++;
  if (ipBuckets.size > 5000) ipBuckets.clear(); // crude memory guard
  return false;
}

// --- corpus index (loaded lazily, cached) ---
type Chunk = { source: string; heading: string; text: string; embedding: number[] };
let corpusChunks: Chunk[] | null | undefined;

function loadCorpus(): Chunk[] | null {
  if (corpusChunks !== undefined) return corpusChunks;
  const candidates = [
    path.join(process.cwd(), "server/agent/corpus-index.json"),
    path.join(process.cwd(), "corpus-index.json"),
  ];
  for (const p of candidates) {
    try {
      const data = JSON.parse(readFileSync(p, "utf-8"));
      corpusChunks = data.chunks as Chunk[];
      return corpusChunks;
    } catch {
      /* try next */
    }
  }
  corpusChunks = null;
  return null;
}

function cosine(a: number[], b: number[]): number {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

async function embedQuery(text: string, apiKey: string): Promise<number[]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
  });
  if (!res.ok) throw new Error(`embedding failed (${res.status})`);
  return (await res.json()).data[0].embedding;
}

// --- chat log (best-effort; absent DATABASE_URL is fine) ---
async function logExchange(ipHash: string, question: string, answer: string, sources: string[]) {
  if (!process.env.DATABASE_URL) return;
  try {
    const { drizzle } = await import("drizzle-orm/node-postgres");
    const pg = await import("pg");
    const { agentChatLogs } = await import("@shared/schema");
    const pool = new pg.default.Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
    const db = drizzle(pool);
    await db.insert(agentChatLogs).values({
      ipHash,
      question,
      answer,
      sources: JSON.stringify(sources),
      model: CHAT_MODEL,
    });
    await pool.end();
  } catch (e) {
    console.error("[agent] chat log failed:", (e as Error).message);
  }
}

function sse(res: Response, payload: unknown) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

export async function handleAgentChat(req: Request, res: Response) {
  const apiKey = process.env.OPENAI_API_KEY;
  const corpus = loadCorpus();
  if (!apiKey || !corpus) {
    res.status(503).json({ message: "The agent isn't configured yet — email pathak.a.rohit@gmail.com instead." });
    return;
  }

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
  if (rateLimited(ip)) {
    res.status(429).json({ message: "Rate limit reached (429). Email me instead: pathak.a.rohit@gmail.com" });
    return;
  }

  const messages = Array.isArray(req.body?.messages) ? req.body.messages : null;
  const lastMsg = messages?.[messages.length - 1];
  if (
    !messages ||
    messages.length === 0 ||
    messages.length > MAX_CONVERSATION_MESSAGES ||
    lastMsg?.role !== "user" ||
    typeof lastMsg?.content !== "string" ||
    !lastMsg.content.trim() ||
    lastMsg.content.length > MAX_QUESTION_CHARS
  ) {
    res.status(400).json({ message: "Invalid request." });
    return;
  }

  const question: string = lastMsg.content.trim();

  try {
    // Retrieval
    const queryEmbedding = await embedQuery(question, apiKey);
    const ranked = corpus
      .map((c) => ({ chunk: c, score: cosine(queryEmbedding, c.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, TOP_K);

    const sources = Array.from(new Set(ranked.map((r) => r.chunk.source)));
    const context = ranked
      .map((r) => `[source: ${r.chunk.source} — ${r.chunk.heading}]\n${r.chunk.text}`)
      .join("\n\n---\n\n");

    // Compose chat
    const history = messages
      .slice(-MAX_HISTORY_MESSAGES)
      .filter((m: any) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));

    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: CHAT_MODEL,
        stream: true,
        temperature: 0.4,
        max_tokens: MAX_OUTPUT_TOKENS,
        messages: [{ role: "system", content: buildSystemPrompt(context) }, ...history],
      }),
    });

    if (!upstream.ok || !upstream.body) {
      throw new Error(`upstream ${upstream.status}: ${await upstream.text()}`);
    }

    // SSE out
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    sse(res, { type: "meta", sources });

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let answer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";
      for (const evt of events) {
        const line = evt.split("\n").find((l) => l.startsWith("data: "));
        if (!line) continue;
        const data = line.slice(6);
        if (data === "[DONE]") continue;
        try {
          const delta = JSON.parse(data).choices?.[0]?.delta?.content;
          if (delta) {
            answer += delta;
            sse(res, { type: "delta", text: delta });
          }
        } catch {
          /* skip malformed frame */
        }
      }
    }

    sse(res, { type: "done" });
    res.end();

    const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 32);
    void logExchange(ipHash, question, answer, sources);
  } catch (e) {
    console.error("[agent] chat failed:", (e as Error).message);
    if (res.headersSent) {
      sse(res, { type: "error", message: "The agent hit a snag — try again." });
      res.end();
    } else {
      res.status(500).json({ message: "The agent hit a snag — try again, or email pathak.a.rohit@gmail.com." });
    }
  }
}
