import { RC } from "./protocol.js";
import type { TransactionRecord } from "./transaction.js";

export class ApiError extends Error {
  public readonly rc: string;
  public readonly payload?: Record<string, unknown>;

  constructor(rc: string, message: string, payload?: Record<string, unknown>) {
    super(message);
    this.name = "ApiError";
    this.rc = rc;
    this.payload = payload;
  }

  public static from(err: unknown): ApiError {
    if (err instanceof ApiError) return err;
    const rc = (err as { rc?: unknown } | null)?.rc;
    return new ApiError(
      typeof rc === "string" ? rc : RC.INTERNAL_ERROR,
      (err instanceof Error && err.message) || "Terjadi kesalahan internal.",
    );
  }
}

export class DuplicatePaymentError extends ApiError {
  public readonly transaction: TransactionRecord;
  public readonly receiptText: string;

  constructor(transaction: TransactionRecord, receiptText: string) {
    super(RC.ALREADY_PAID, "Tagihan sudah dibayar sebelumnya (idempoten).", {
      transaction,
      receiptText,
    });
    this.name = "DuplicatePaymentError";
    this.transaction = transaction;
    this.receiptText = receiptText;
  }
}
