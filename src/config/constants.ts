import dotenv from "dotenv";

dotenv.config();

export const CONFIG = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  DB: {
    HOST: process.env.DB_HOST || "127.0.0.1",
    PORT: parseInt(process.env.DB_PORT || "3306", 10),
    USER: process.env.DB_USER || "root",
    PASSWORD: process.env.DB_PASSWORD || "",
    NAME: process.env.DB_NAME || "bimasakti_pdam",
    TEST_NAME: process.env.DB_TEST_NAME || "bimasakti_pdam_test",
  },
} as const;
