import { TransactionRepository } from "../repository/transaction.repository.js";
import { generateReceiptText } from "./receiptService.js";
import { TransactionRecord } from "../models/transaction.js";
import { ApiError } from "../utils/apiError.js";

/**
 * Service layer: history use case.
 * Reads persisted transactions from the repository and assembles receipts.
 */

export const MAX_HISTORY_LIMIT = 500;
export const DEFAULT_HISTORY_LIMIT = 100;

export class HistoryService {
  public static async list(limit?: number): Promise<TransactionRecord[]> {
    const safeLimit = Math.min(
      limit && limit > 0 ? limit : DEFAULT_HISTORY_LIMIT,
      MAX_HISTORY_LIMIT
    );
    return TransactionRepository.findAll(safeLimit);
  }

  public static async getById(id: number): Promise<{
    transaction: TransactionRecord;
    receiptText: string;
  }> {
    const tx = await TransactionRepository.findById(id);
    if (!tx) {
      throw new ApiError("04", "Transaksi tidak ditemukan.");
    }
    return { transaction: tx, receiptText: generateReceiptText(tx) };
  }
}
