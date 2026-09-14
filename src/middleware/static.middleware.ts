import fs from "node:fs";
import path from "node:path";
import express, {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import { CONFIG } from "@/config/constants.js";

const viewsPath = path.resolve(process.cwd(), "views");

function sendCompressed(
  res: Response,
  filePath: string,
  contentType: string,
  enc: unknown,
): boolean {
  if (CONFIG.NODE_ENV !== "production") return false;
  const encStr = typeof enc === "string" ? enc : "";
  const baseStat = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
  for (const [algo, ext] of [
    ["zstd", "zst"],
    ["br", "br"],
    ["gzip", "gz"],
  ] as const) {
    const compPath = `${filePath}.${ext}`;
    if (encStr.includes(algo) && fs.existsSync(compPath)) {
      if (baseStat && fs.statSync(compPath).mtimeMs < baseStat.mtimeMs) {
        continue;
      }
      res.setHeader("Content-Encoding", algo);
      res.setHeader("Content-Type", contentType);
      res.sendFile(compPath);
      return true;
    }
  }
  return false;
}

export const staticMiddleware = Router();

staticMiddleware.get(
  ["/js/app.js", "/css/style.css"],
  (req: Request, res: Response, next: NextFunction) => {
    const ext = req.path.endsWith(".js") ? "text/javascript" : "text/css";
    const filePath = path.join(viewsPath, req.path.slice(1));
    if (
      sendCompressed(
        res,
        filePath,
        `${ext}; charset=utf-8`,
        req.headers["accept-encoding"],
      )
    ) {
      return;
    }
    next();
  },
);

staticMiddleware.use(express.static(viewsPath, { index: false }));

staticMiddleware.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  const indexPath = path.join(viewsPath, "index.html");
  if (
    sendCompressed(
      res,
      indexPath,
      "text/html; charset=utf-8",
      req.headers["accept-encoding"],
    )
  ) {
    return;
  }
  res.sendFile(indexPath);
});
