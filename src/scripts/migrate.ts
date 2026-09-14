import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
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
    `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await connection.query(`USE \`${database}\``);
  return drizzle(connection);
}

export async function runMigrations(): Promise<void> {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    throw new Error(
      `Migrations folder not found at ${MIGRATIONS_DIR}. Run \`pnpm db:generate\` first.`,
    );
  }

  const db = await loadMigratorDb(CONFIG.DB.NAME);
  await migrate(db, { migrationsFolder: MIGRATIONS_DIR });
  await (db.$client as mysql.Connection).end();
}

if (
  process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url
) {
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
