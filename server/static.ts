import express, { type Express, type Request, type Response } from "express";
import fs from "fs";
import path from "path";

/** Serve the built AutoSignal app under /autosignal (dev public/ or prod dist/). */
export function mountAutosignal(app: Express, autosignalPath: string) {
  if (!fs.existsSync(autosignalPath)) return;

  // Use originalUrl so we don't loop: Express's default non-strict routing
  // treats /autosignal and /autosignal/ as the same path for app.get().
  app.use((req, res, next) => {
    const pathOnly = req.originalUrl.split("?")[0];
    if (pathOnly === "/autosignal") {
      return res.redirect(301, "/autosignal/");
    }
    next();
  });
  app.use(
    "/autosignal",
    express.static(autosignalPath, { index: "index.html", redirect: false }),
  );
  app.use("/autosignal", (_req: Request, res: Response) => {
    res.sendFile(path.join(autosignalPath, "index.html"));
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  mountAutosignal(app, path.join(distPath, "autosignal"));

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
