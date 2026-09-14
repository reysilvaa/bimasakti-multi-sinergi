import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { CONFIG } from "../config/constants.js";

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (dbInstance) return dbInstance;

  const dbPath = path.resolve(CONFIG.DATABASE_PATH);
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  dbInstance = new DatabaseSync(dbPath);
  initSchema(dbInstance);
  return dbInstance;
}

function initSchema(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ref1 TEXT NOT NULL,
      ref2 TEXT NOT NULL,
      no_resi TEXT,
      product_code TEXT NOT NULL,
      pdam_name TEXT NOT NULL,
      customer_id TEXT NOT NULL,
      customer_name TEXT,
      customer_address TEXT,
      nominal INTEGER NOT NULL,
      admin_fee INTEGER NOT NULL,
      penalty INTEGER DEFAULT 0,
      misc_fee INTEGER DEFAULT 0,
      meter_usage INTEGER DEFAULT 0,
      total_amount INTEGER NOT NULL,
      terbilang TEXT,
      status TEXT NOT NULL,
      status_description TEXT,
      raw_request TEXT,
      raw_response TEXT,
      created_at DATETIME DEFAULT (datetime('now', 'localtime'))
    );

    CREATE INDEX IF NOT EXISTS idx_tx_customer_id ON transactions (customer_id);
    CREATE INDEX IF NOT EXISTS idx_tx_ref1 ON transactions (ref1);
    CREATE INDEX IF NOT EXISTS idx_tx_created_at ON transactions (created_at DESC);
  `);
}
