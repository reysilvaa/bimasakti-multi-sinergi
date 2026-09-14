import mysql from "mysql2/promise";
import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import { CONFIG } from "../config/constants.js";

/**
 * Repository layer: MySQL connection bootstrap (Drizzle over mysql2 pool).
 * Returns a lazily-created singleton; the pool connects on first query.
 */
let dbInstance: MySql2Database | null = null;

export function getDatabase(): MySql2Database {
  if (dbInstance) return dbInstance;

  const pool = mysql.createPool({
    host: CONFIG.DB.HOST,
    port: CONFIG.DB.PORT,
    user: CONFIG.DB.USER,
    password: CONFIG.DB.PASSWORD,
    database: CONFIG.DB.NAME,
    connectionLimit: 10,
  });

  dbInstance = drizzle(pool);
  return dbInstance;
}

export type Database = MySql2Database;
