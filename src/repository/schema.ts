import { sql } from "drizzle-orm";
import {
  index,
  int,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const transactions = mysqlTable(
  "transactions",
  {
    id: int("id").autoincrement().primaryKey(),
    ref1: varchar("ref1", { length: 64 }).notNull(),
    ref2: varchar("ref2", { length: 64 }).notNull(),
    noResi: varchar("no_resi", { length: 64 }),
    productCode: varchar("product_code", { length: 16 }).notNull(),
    pdamName: varchar("pdam_name", { length: 100 }).notNull(),
    customerId: varchar("customer_id", { length: 32 }).notNull(),
    customerName: varchar("customer_name", { length: 150 }),
    customerAddress: varchar("customer_address", { length: 255 }),
    nominal: int("nominal").notNull(),
    adminFee: int("admin_fee").notNull(),
    penalty: int("penalty").notNull().default(0),
    miscFee: int("misc_fee").notNull().default(0),
    meterUsage: int("meter_usage").notNull().default(0),
    totalAmount: int("total_amount").notNull(),
    terbilang: varchar("terbilang", { length: 255 }),
    status: varchar("status", { length: 8 }).notNull(),
    statusDescription: varchar("status_description", { length: 150 }),
    rawRequest: text("raw_request"),
    rawResponse: text("raw_response"),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    index("idx_tx_customer_id").on(t.customerId),
    uniqueIndex("uq_tx_ref2").on(t.ref2),
    index("idx_tx_ref1").on(t.ref1),
    index("idx_tx_created_at").on(t.createdAt),
  ],
);

export type TransactionRow = typeof transactions.$inferSelect;

export type NewTransactionRow = typeof transactions.$inferInsert;
