import type { Express } from "express";
import { createServer, type Server } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Proxy /api/geo/* → FastAPI server on port 8000
  // Express strips the mount prefix (/api/geo) before passing to the middleware,
  // so req.url arrives as e.g. "/health". We prepend "/api" to match FastAPI's routes.
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
