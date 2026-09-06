import type { Express } from "express";
import { createServer, type Server } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import { handleAgentChat } from "./agent";

// In dev this is localhost:8000 (the Geo RAG API workflow).
// In production set GEO_RAG_API_URL to your Railway service URL, e.g.
//   https://geo-rag-api-production.up.railway.app
const GEO_RAG_UPSTREAM = (process.env.GEO_RAG_API_URL || "http://localhost:8000").replace(/\/$/, "");
const U100_UPSTREAM = (process.env.U100_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // POST /api/agent/chat — the interview agent (SSE streaming).
  app.post("/api/agent/chat", handleAgentChat);

  // POST /api/geo/chat — handled directly because express.json() has already
  // consumed the request body before the proxy middleware can forward it.
  app.post("/api/geo/chat", async (req, res) => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 300_000); // 5-min hard limit
      const upstream = await fetch(`${GEO_RAG_UPSTREAM}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const data = await upstream.json();
      res.status(upstream.status).json(data);
    } catch (e: any) {
      res.status(500).json({ detail: e.message ?? "Chat request failed" });
    }
  });

  // All other /api/geo/* requests are proxied to the FastAPI service.
  // Express strips the /api/geo mount prefix before passing to the middleware,
  // so we prepend /api/ to match FastAPI's routes.
  app.use(
    "/api/geo",
    createProxyMiddleware({
      target: GEO_RAG_UPSTREAM,
      changeOrigin: true,
      pathRewrite: { "^/": "/api/" },
    })
  );

  // Unit 100 FastAPI. express.json() already consumed the body, so forward
  // with fetch instead of http-proxy-middleware.
  app.use("/u100/api", async (req, res) => {
    const dest = `${U100_UPSTREAM}/api${req.url}`;
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      if (req.headers["content-type"]) {
        headers["Content-Type"] = String(req.headers["content-type"]);
      }
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 180_000);
      const upstream = await fetch(dest, {
        method: req.method,
        headers,
        body: ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body ?? {}),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const text = await upstream.text();
      const ct = upstream.headers.get("content-type");
      if (ct) res.setHeader("content-type", ct);
      res.status(upstream.status).send(text);
    } catch (e: any) {
      res.status(502).json({ detail: e.message ?? "Unit 100 API unavailable" });
    }
  });

  return httpServer;
}
