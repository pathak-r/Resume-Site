import type { Express } from "express";
import { createServer, type Server } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";

const FASTAPI_BASE = "http://localhost:8000/api";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // POST /api/geo/chat — handled directly because express.json() has already
  // consumed the request body before the proxy middleware can forward it.
  app.post("/api/geo/chat", async (req, res) => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 300_000); // 5-min hard limit
      const upstream = await fetch(`${FASTAPI_BASE}/chat`, {
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

  // All other /api/geo/* requests (GET) are proxied to FastAPI.
  // Express strips the mount prefix before passing to the middleware, so
  // req.url arrives as e.g. "/health" — we prepend "/api/" to match FastAPI routes.
  app.use(
    "/api/geo",
    createProxyMiddleware({
      target: "http://localhost:8000",
      changeOrigin: true,
      pathRewrite: { "^/": "/api/" },
    })
  );

  return httpServer;
}
