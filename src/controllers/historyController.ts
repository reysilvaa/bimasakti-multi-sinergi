import { Request, Response } from "express";
import { HistoryService } from "../services/historyService.js";
import { ApiError } from "../utils/apiError.js";
import { envelope } from "../utils/apiResponse.js";
import { httpStatusFor, sendError } from "./errorMapper.js";

/**
 * Controller layer: history HTTP adapter.
 * Parse HTTP input → call service → map result/ApiError to the spec envelope.
 */
export async function listTransactions(req: Request, res: Response): Promise<void> {
  try {
    const parsed = parseInt(String(req.query.limit || "100"), 10);
    const transactions = await HistoryService.list(isNaN(parsed) ? undefined : parsed);
    res.json(envelope("00", "Daftar transaksi berhasil didapatkan.", transactions));
  } catch (err) {
    sendError(res, err);
  }
}

export async function getTransaction(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json(envelope("02", "ID transaksi tidak valid."));
      return;
    }
    const { transaction, receiptText } = await HistoryService.getById(id);
    res.json(
      envelope("00", "Detail transaksi berhasil didapatkan.", { transaction, receiptText })
    );
  } catch (err) {
    sendError(res, err);
  }
}

export async function downloadReceipt(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).send("ID transaksi tidak valid.");
      return;
    }
    const { transaction, receiptText } = await HistoryService.getById(id);
    const filename = `struk_${transaction.productCode}_${transaction.customerId}_${transaction.id}.txt`;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(receiptText);
  } catch (err) {
    const apiErr = ApiError.from(err);
    res
      .status(apiErr.rc === "04" ? 404 : 500)
      .send(apiErr.rc === "04" ? "Transaksi tidak ditemukan." : apiErr.message);
  }
}

export { httpStatusFor };
