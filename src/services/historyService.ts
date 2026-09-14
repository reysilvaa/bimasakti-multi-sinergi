import { ApiError } from "@/domain/errors.js";
import { RC } from "@/domain/protocol.js";
import type { TransactionRecord } from "@/domain/transaction.js";
import { TransactionRepository } from "@/repository/transaction.repository.js";
import { generateReceiptText } from "@/services/receiptService.js";

const MAX_HISTORY_LIMIT = 500;
const DEFAULT_HISTORY_LIMIT = 100;

export class HistoryService {
  public static async list(limit?: number): Promise<TransactionRecord[]> {
    const safeLimit = Math.min(
      limit && limit > 0 ? limit : DEFAULT_HISTORY_LIMIT,
      MAX_HISTORY_LIMIT,
    );
    return TransactionRepository.findAll(safeLimit);
  }

  public static async getById(id: number): Promise<{
    transaction: TransactionRecord;
    receiptText: string;
  }> {
    const tx = await TransactionRepository.findById(id);
    if (!tx) {
      throw new ApiError(RC.NOT_FOUND, "Transaksi tidak ditemukan.");
    }
    return { transaction: tx, receiptText: generateReceiptText(tx) };
  }
}
