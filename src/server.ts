import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import { CONFIG } from "@/config/constants.js";
import { errorHandler } from "@/middleware/error.middleware.js";
import { getDatabase } from "@/repository/connection.js";
import apiRoutes from "@/routes/api.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

getDatabase();

app.use(cors());
app.use(express.json());

const viewsPath = path.resolve(__dirname, "../views");

app.get(["/js/app.js", "/css/style.css"], (req, res, next) => {
  const enc = req.headers["accept-encoding"] || "";
  const ext = req.path.endsWith(".js") ? "text/javascript" : "text/css";
  const filePath = path.join(viewsPath, req.path.slice(1));

  if (
    typeof enc === "string" &&
    enc.includes("br") &&
    fs.existsSync(`${filePath}.br`)
  ) {
    res.setHeader("Content-Encoding", "br");
    res.setHeader("Content-Type", `${ext}; charset=utf-8`);
    return res.sendFile(`${filePath}.br`);
  }
  if (
    typeof enc === "string" &&
    enc.includes("gzip") &&
    fs.existsSync(`${filePath}.gz`)
  ) {
    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Content-Type", `${ext}; charset=utf-8`);
    return res.sendFile(`${filePath}.gz`);
  }
  next();
});

app.use(express.static(viewsPath, { index: false }));

app.use("/api", apiRoutes);

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  const enc = req.headers["accept-encoding"] || "";
  const indexPath = path.join(viewsPath, "index.html");
  if (
    typeof enc === "string" &&
    enc.includes("br") &&
    fs.existsSync(`${indexPath}.br`)
  ) {
    res.setHeader("Content-Encoding", "br");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.sendFile(`${indexPath}.br`);
  }
  if (
    typeof enc === "string" &&
    enc.includes("gzip") &&
    fs.existsSync(`${indexPath}.gz`)
  ) {
    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.sendFile(`${indexPath}.gz`);
  }
  res.sendFile(indexPath);
});

app.use(errorHandler);

if (CONFIG.NODE_ENV !== "test") {
  app.listen(CONFIG.PORT, () => {
    console.log(`==================================================`);
    console.log(`  PDAM BILL PAYMENT SERVER (TypeScript ESM)`);
    console.log(`  Server running on http://localhost:${CONFIG.PORT}`);
    console.log(`  Environment: ${CONFIG.NODE_ENV}`);
    console.log(
      `  Database: MySQL ${CONFIG.DB.HOST}:${CONFIG.DB.PORT}/${CONFIG.DB.NAME}`,
    );
    console.log(`==================================================`);
  });
}
export default app;
