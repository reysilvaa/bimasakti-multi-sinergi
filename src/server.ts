import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CONFIG } from "./config/constants.js";
import { getDatabase } from "./database/connection.js";
import apiRoutes from "./routes/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

getDatabase();

app.use(cors());
app.use(express.json());

const publicPath = path.resolve(__dirname, "../public");
app.use(express.static(publicPath));

app.use("/api", apiRoutes);

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(publicPath, "index.html"));
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(CONFIG.PORT, () => {
  console.log(`==================================================`);
  console.log(`  PDAM BILL PAYMENT SERVER (TypeScript ESM)`);
  console.log(`  Server running on http://localhost:${CONFIG.PORT}`);
  console.log(`  Environment: ${CONFIG.NODE_ENV}`);
  console.log(`  Database: ${CONFIG.DATABASE_PATH}`);
  console.log(`==================================================`);
});

export default app;
