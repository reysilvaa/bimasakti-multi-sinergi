import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import { CONFIG } from "@/config/constants.js";
import { errorHandler } from "@/middleware/errorMiddleware.js";
import { getDatabase } from "@/repository/connection.js";
import apiRoutes from "@/routes/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

getDatabase();

app.use(cors());
app.use(express.json());

const viewsPath = path.resolve(__dirname, "../views");
app.use(express.static(viewsPath));

app.use("/api", apiRoutes);

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(viewsPath, "index.html"));
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
