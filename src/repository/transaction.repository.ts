import { desc, eq, sql } from "drizzle-orm";
import type { TransactionRecord } from "../domain/transaction.js";
import { getDatabase } from "./connection.js";
import { type NewTransactionRow, transactions } from "./schema.js";

function toRecord(row: typeof transactions.$inferSelect): TransactionRecord {
  return {
    id: row.id,
    ref1: row.ref1,
    ref2: row.ref2,
    noResi: row.noResi || row.ref2,
    productCode: row.productCode as TransactionRecord["productCode"],
    pdamName: row.pdamName,
    customerId: row.customerId,
    customerName: row.customerName || "",
    customerAddress: row.customerAddress || "",
    nominal: row.nominal,
    adminFee: row.adminFee,
    penalty: row.penalty,
    miscFee: row.miscFee,
    meterUsage: row.meterUsage,
    totalAmount: row.totalAmount,
    terbilang: row.terbilang || "",
    status: row.status,
    statusDescription: row.statusDescription || "",
    rawRequest: row.rawRequest || "",
    rawResponse: row.rawResponse || "",
    createdAt: row.createdAt,
  };
}

export class TransactionRepository {
  public static async create(
    data: NewTransactionRow,
  ): Promise<TransactionRecord> {
    const db = getDatabase();
    const result = await db.insert(transactions).values(data);
    const insertedId = Number(result[0].insertId);
    const fetched = await this.findById(insertedId);
    if (!fetched) {
      throw new Error("Failed to retrieve created transaction");
    }
    return fetched;
  }

  public static async findAll(
    limit: number = 100,
  ): Promise<TransactionRecord[]> {
    const db = getDatabase();
    const rows = await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.id))
      .limit(limit);
    return rows.map(toRecord);
  }

  public static async findById(id: number): Promise<TransactionRecord | null> {
    const db = getDatabase();
    const rows = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id))
      .limit(1);
    return rows[0] ? toRecord(rows[0]) : null;
  }

  public static async findByRef2(
    ref2: string,
  ): Promise<TransactionRecord | null> {
    const db = getDatabase();
    const rows = await db
      .select()
      .from(transactions)
      .where(eq(transactions.ref2, ref2))
      .orderBy(desc(transactions.id))
      .limit(1);
    return rows[0] ? toRecord(rows[0]) : null;
  }

  public static async count(): Promise<number> {
    const db = getDatabase();
    const rows = await db
      .select({ value: sql<number>`count(*)` })
      .from(transactions);
    return Number(rows[0]?.value ?? 0);
  }
}
