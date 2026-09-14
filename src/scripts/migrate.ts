/**
 * One-off migration runner: applies pending drizzle SQL migrations.
 * Creates the target database if missing, then runs `drizzle/` migrations.
 *
 * The test runner (test_integration.mjs) imports { runMigrations } after
 * pointing DB_NAME at the isolated test database.
 */
import path from "node:path";
import { pathToFileURL } from "node:url";
import fs from "node:fs";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { CONFIG } from "../config/constants.js";

const MIGRATIONS_DIR = path.resolve(process.cwd(), "drizzle");

async function loadMigratorDb(database: string) {
  const connection = await mysql.createConnection({
    host: CONFIG.DB.HOST,
    port: CONFIG.DB.PORT,
    user: CONFIG.DB.USER,
    password: CONFIG.DB.PASSWORD,
    multipleStatements: true,
  });
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await connection.query(`USE \`${database}\``);
  return drizzle(connection);
}

/** Apply pending migrations to CONFIG.DB.NAME. Safe to call repeatedly. */
export async function runMigrations(): Promise<void> {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    throw new Error(
      `Migrations folder not found at ${MIGRATIONS_DIR}. Run \`pnpm db:generate\` first.`
    );
  }

  const db = await loadMigratorDb(CONFIG.DB.NAME);
  await migrate(db, { migrationsFolder: MIGRATIONS_DIR });
  await (db.$client as mysql.Connection).end();
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  runMigrations()
    .then(() => {
      console.log(`Migrations applied to ${CONFIG.DB.NAME}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}
