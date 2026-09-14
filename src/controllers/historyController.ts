import { Request, Response } from "express";
import { TransactionRepository } from "../database/transactionRepository.js";
import { generateReceiptText } from "../services/receiptService.js";
import { envelope } from "../utils/helpers.js";

export async function listTransactions(req: Request, res: Response): Promise<void> {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || "100"), 10) || 100, 500);
    const transactions = TransactionRepository.findAll(limit);
    res.json(envelope("00", "Daftar transaksi berhasil didapatkan.", transactions));
  } catch (error: any) {
    res.status(500).json(envelope("99", error.message || "Gagal mengambil data riwayat transaksi."));
  }
}

export async function getTransaction(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json(envelope("02", "ID transaksi tidak valid."));
      return;
    }

    const tx = TransactionRepository.findById(id);
    if (!tx) {
      res.status(404).json(envelope("04", "Transaksi tidak ditemukan."));
      return;
    }

    res.json(envelope("00", "Detail transaksi berhasil didapatkan.", {
      transaction: tx,
      receiptText: generateReceiptText(tx),
    }));
  } catch (error: any) {
    res.status(500).json(envelope("99", error.message || "Gagal mengambil detail transaksi."));
  }
}

export async function downloadReceipt(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).send("ID transaksi tidak valid.");
      return;
    }

    const tx = TransactionRepository.findById(id);
    if (!tx) {
      res.status(404).send("Transaksi tidak ditemukan.");
      return;
    }

    const filename = `struk_${tx.productCode}_${tx.customerId}_${tx.id}.txt`;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(generateReceiptText(tx));
  } catch (error: any) {
    res.status(500).send(error.message || "Gagal mengunduh struk.");
  }
}
