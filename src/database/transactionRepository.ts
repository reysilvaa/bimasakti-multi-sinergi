import { getDatabase } from "./connection.js";
import { TransactionRecord, PdamProductCode } from "../types/transaction.types.js";

interface DbTransactionRow {
  id: number;
  ref1: string;
  ref2: string;
  no_resi: string | null;
  product_code: string;
  pdam_name: string;
  customer_id: string;
  customer_name: string | null;
  customer_address: string | null;
  nominal: number;
  admin_fee: number;
  penalty: number;
  misc_fee: number;
  meter_usage: number;
  total_amount: number;
  terbilang: string | null;
  status: string;
  status_description: string | null;
  raw_request: string | null;
  raw_response: string | null;
  created_at: string;
}

function mapRowToRecord(row: DbTransactionRow): TransactionRecord {
  return {
    id: row.id,
    ref1: row.ref1,
    ref2: row.ref2,
    noResi: row.no_resi || row.ref2,
    productCode: row.product_code as PdamProductCode,
    pdamName: row.pdam_name,
    customerId: row.customer_id,
    customerName: row.customer_name || "",
    customerAddress: row.customer_address || "",
    nominal: Number(row.nominal),
    adminFee: Number(row.admin_fee),
    penalty: Number(row.penalty),
    miscFee: Number(row.misc_fee),
    meterUsage: Number(row.meter_usage),
    totalAmount: Number(row.total_amount),
    terbilang: row.terbilang || "",
    status: row.status,
    statusDescription: row.status_description || "",
    rawRequest: row.raw_request || "",
    rawResponse: row.raw_response || "",
    createdAt: row.created_at,
  };
}

export class TransactionRepository {
  public static create(data: Omit<TransactionRecord, "id" | "createdAt">): TransactionRecord {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO transactions (
        ref1, ref2, no_resi, product_code, pdam_name, customer_id, customer_name,
        customer_address, nominal, admin_fee, penalty, misc_fee, meter_usage,
        total_amount, terbilang, status, status_description, raw_request, raw_response
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?
      )
    `);

    const result = stmt.run(
      data.ref1,
      data.ref2,
      data.noResi,
      data.productCode,
      data.pdamName,
      data.customerId,
      data.customerName,
      data.customerAddress,
      data.nominal,
      data.adminFee,
      data.penalty,
      data.miscFee,
      data.meterUsage,
      data.totalAmount,
      data.terbilang,
      data.status,
      data.statusDescription,
      data.rawRequest,
      data.rawResponse
    );

    const insertedId = Number(result.lastInsertRowid);
    const fetched = this.findById(insertedId);
    if (!fetched) {
      throw new Error("Failed to retrieve created transaction");
    }
    return fetched;
  }

  public static findAll(limit: number = 100): TransactionRecord[] {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT * FROM transactions
      ORDER BY id DESC
      LIMIT ?
    `);
    const rows = stmt.all(limit) as unknown as DbTransactionRow[];
    return rows.map(mapRowToRecord);
  }

  public static findById(id: number): TransactionRecord | null {
    const db = getDatabase();
    const stmt = db.prepare("SELECT * FROM transactions WHERE id = ?");
    const row = stmt.get(id) as unknown as DbTransactionRow | undefined;
    return row ? mapRowToRecord(row) : null;
  }

  public static findByRef2(ref2: string): TransactionRecord | null {
    const db = getDatabase();
    const stmt = db.prepare("SELECT * FROM transactions WHERE ref2 = ? ORDER BY id DESC LIMIT 1");
    const row = stmt.get(ref2) as unknown as DbTransactionRow | undefined;
    return row ? mapRowToRecord(row) : null;
  }
}
