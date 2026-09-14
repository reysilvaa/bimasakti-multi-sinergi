import fs from "node:fs";
import path from "node:path";
import express, {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";

const viewsPath = path.resolve(process.cwd(), "views");

function sendCompressed(
  res: Response,
  filePath: string,
  contentType: string,
  enc: unknown,
): boolean {
  const encStr = typeof enc === "string" ? enc : "";
  for (const [algo, ext] of [
    ["zstd", "zst"],
    ["br", "br"],
    ["gzip", "gz"],
  ] as const) {
    if (encStr.includes(algo) && fs.existsSync(`${filePath}.${ext}`)) {
      res.setHeader("Content-Encoding", algo);
      res.setHeader("Content-Type", contentType);
      res.sendFile(`${filePath}.${ext}`);
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
