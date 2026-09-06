import express, { type Express, type Request, type Response } from "express";
import fs from "fs";
import path from "path";

/** Serve a built SPA under /prefix (dev public/ or prod dist/). */
export function mountSubApp(app: Express, prefix: string, dir: string) {
  if (!fs.existsSync(dir)) return;

  const base = `/${prefix.replace(/^\/|\/$/g, "")}`;
  app.use((req, res, next) => {
    const pathOnly = req.originalUrl.split("?")[0];
    if (pathOnly === base) {
      return res.redirect(301, `${base}/`);
    }
    next();
  });
  app.use(base, express.static(dir, { index: "index.html", redirect: false }));
  app.use(base, (_req: Request, res: Response) => {
    res.sendFile(path.join(dir, "index.html"));
  });
}

/** Serve the built AutoSignal app under /autosignal (dev public/ or prod dist/). */
export function mountAutosignal(app: Express, autosignalPath: string) {
  mountSubApp(app, "autosignal", autosignalPath);
}

export function mountU100(app: Express, u100Path: string) {
  mountSubApp(app, "u100", u100Path);
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  mountAutosignal(app, path.join(distPath, "autosignal"));
  mountU100(app, path.join(distPath, "u100"));

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
