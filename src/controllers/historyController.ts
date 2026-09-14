import type { Request, Response } from "express";
import { ApiError } from "@/domain/errors.js";
import { envelope, RC } from "@/domain/protocol.js";
import { HistoryService } from "@/services/historyService.js";

export async function listTransactions(
  req: Request,
  res: Response,
): Promise<void> {
  const parsed = parseInt(String(req.query.limit || "100"), 10);
  const transactions = await HistoryService.list(
    isNaN(parsed) ? undefined : parsed,
  );
  res.json(
    envelope(RC.SUCCESS, "Daftar transaksi berhasil didapatkan.", transactions),
  );
}

export async function getTransaction(
  req: Request,
  res: Response,
): Promise<void> {
  const id = parseId(req);
  const { transaction, receiptText } = await HistoryService.getById(id);
  res.json(
    envelope(RC.SUCCESS, "Detail transaksi berhasil didapatkan.", {
      transaction,
      receiptText,
    }),
  );
}

export async function downloadReceipt(
  req: Request,
  res: Response,
): Promise<void> {
  const id = parseId(req);
  const { transaction, receiptText } = await HistoryService.getById(id);
  const filename = `struk_${transaction.productCode}_${transaction.customerId}_${transaction.id}.txt`;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(receiptText);
}

function parseId(req: Request): number {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    throw new ApiError(RC.INVALID_IDPEL, "ID transaksi tidak valid.");
  }
  return id;
}
