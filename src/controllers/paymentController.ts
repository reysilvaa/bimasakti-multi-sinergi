import { Request, Response } from "express";
import { RajabillerService } from "../services/rajabillerService.js";
import { TransactionRepository } from "../database/transactionRepository.js";
import { generateReceiptText, extractBills } from "../services/receiptService.js";
import { terbilang } from "../services/terbilang.js";
import { SUPPORTED_PRODUCTS } from "../config/constants.js";
import { isSupportedProduct, envelope, toInt } from "../utils/helpers.js";

export async function handlePayment(req: Request, res: Response): Promise<void> {
  try {
    const { productCode, customerId, ref1, ref2, nominal } = req.body as {
      productCode?: string;
      customerId?: string;
      ref1?: string;
      ref2?: string;
      nominal?: string | number;
    };

    if (!isSupportedProduct(productCode)) {
      res.status(400).json(envelope("01", "Kode produk tidak valid."));
      return;
    }

    if (!customerId || !ref1 || !ref2 || !nominal) {
      res.status(400).json(envelope("03", "Parameter pembayaran tidak lengkap. Lakukan inquiry terlebih dahulu."));
      return;
    }

    // Idempotency: any stored row for ref2 means the bill settled (00) or was
    // already paid (33); failed payments are never stored. Block replay.
    const existing = TransactionRepository.findByRef2(ref2);
    if (existing) {
      res.status(409).json(envelope("33", "Tagihan sudah dibayar sebelumnya (idempoten).", {
        transaction: existing,
        receiptText: generateReceiptText(existing),
      }));
      return;
    }

    const { rawRequest, rawResponse } = await RajabillerService.executePayment({
      productCode,
      customerId,
      ref1,
      ref2,
      nominal: nominal.toString(),
    });

    // "00" = paid, "33" = Rajabiller says already paid (retry after our idempotency
    // window or paid elsewhere). Everything else already threw in sendRajabillerRequest.
    const isSuccess = rawResponse.status === "00";
    const isDouble = rawResponse.status === "33";

    if (!isSuccess && !isDouble) {
      res.status(502).json(envelope(rawResponse.status, rawResponse.keterangan || "Pembayaran gagal diproses oleh Rajabiller."));
      return;
    }

    const bills = extractBills(rawResponse);
    const nominalValue = toInt(rawResponse.nominal);
    const adminFee = toInt(rawResponse.biayaadmin);
    const penalty = bills.reduce((acc, b) => acc + b.denda, 0);
    const miscFee = bills.reduce((acc, b) => acc + b.nonair, 0);
    const meterUsage = bills.reduce((acc, b) => acc + Math.max(0, b.meterAkhir - b.meterAwal), 0);
    const totalAmount = nominalValue + adminFee;

    const savedTx = TransactionRepository.create({
      ref1: rawResponse.ref1 || ref1,
      ref2: rawResponse.ref2 || ref2,
      noResi: rawResponse.noref2 || rawResponse.ref2 || ref2,
      productCode,
      pdamName: SUPPORTED_PRODUCTS[productCode].name,
      customerId: rawResponse.customerid1 || customerId,
      customerName: rawResponse.customername || "-",
      customerAddress: rawResponse.customeraddress || "-",
      nominal: nominalValue,
      adminFee,
      penalty,
      miscFee,
      meterUsage,
      totalAmount,
      terbilang: terbilang(totalAmount),
      status: rawResponse.status,
      statusDescription: rawResponse.keterangan || (isSuccess ? "SUKSES" : "SUDAH DIBAYAR"),
      rawRequest: JSON.stringify(rawRequest),
      rawResponse: JSON.stringify(rawResponse),
    });

    res.json(envelope("00", rawResponse.keterangan || "Pembayaran tagihan berhasil!", {
      transaction: savedTx,
      receiptText: generateReceiptText(savedTx),
    }));
  } catch (error: any) {
    res.status(502).json(envelope(error.rc || "99", error.message || "Terjadi kesalahan internal saat memproses pembayaran."));
  }
}
