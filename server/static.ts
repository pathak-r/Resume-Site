import express, { type Express, type Request, type Response } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // AutoSignal (separate Vite app) lives under /autosignal — serve before portfolio SPA.
  const autosignalPath = path.join(distPath, "autosignal");
  if (fs.existsSync(autosignalPath)) {
    app.get("/autosignal", (_req, res) => {
      res.redirect(301, "/autosignal/");
    });
    app.use(
      "/autosignal",
      express.static(autosignalPath, { index: "index.html", fallthrough: true }),
    );
    app.use("/autosignal", (_req: Request, res: Response) => {
      res.sendFile(path.join(autosignalPath, "index.html"));
    });
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
