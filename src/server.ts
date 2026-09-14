import cors from "cors";
import express from "express";
import { CONFIG } from "@/config/constants.js";
import { errorHandler } from "@/middleware/error.middleware.js";
import { staticMiddleware } from "@/middleware/static.middleware.js";
import { getDatabase } from "@/repository/connection.js";
import apiRoutes from "@/routes/api.routes.js";

const app = express();

getDatabase();

app.use(cors());
app.use(express.json());
app.use("/api", apiRoutes);
app.use(staticMiddleware);
app.use(errorHandler);

if (CONFIG.NODE_ENV !== "test") {
  app.listen(CONFIG.PORT, () => {
    console.log(`Server running on http://localhost:${CONFIG.PORT}`);
  });
}

export default app;
