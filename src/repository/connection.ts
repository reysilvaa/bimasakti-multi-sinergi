import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { CONFIG } from "@/config/constants.js";

declare global {
  var __mysql_pool: mysql.Pool | undefined;
  var __db_instance: MySql2Database | undefined;
}

export function getDatabase(): MySql2Database {
  if (globalThis.__db_instance) return globalThis.__db_instance;

  const pool =
    globalThis.__mysql_pool ??
    mysql.createPool({
      host: CONFIG.DB.HOST,
      port: CONFIG.DB.PORT,
      user: CONFIG.DB.USER,
      password: CONFIG.DB.PASSWORD,
      database: CONFIG.DB.NAME,
      waitForConnections: true,
      connectionLimit: 2,
      maxIdle: 1,
      idleTimeout: 10000,
      queueLimit: 20,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });

  globalThis.__mysql_pool = pool;
  globalThis.__db_instance = drizzle(pool);
  return globalThis.__db_instance;
}
