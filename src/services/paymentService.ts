import { isSupportedProduct, type PdamProductCode } from "../domain/product.js";
import { RC } from "../domain/protocol.js";
import type { TransactionRecord } from "../domain/transaction.js";
import { TransactionRepository } from "../repository/transaction.repository.js";
import { ApiError } from "../domain/errors.js";
import { RajabillerService } from "./rajabillerService.js";
import { generateReceiptText } from "./receiptService.js";

export class PaymentService {
  public static async pay(input: {
    productCode?: string;
    customerId?: string;
    ref1?: string;
    ref2?: string;
    nominal?: string | number;
  }): Promise<{
    transaction: TransactionRecord;
    receiptText: string;
    keterangan: string;
  }> {
    if (!isSupportedProduct(input.productCode)) {
      throw new ApiError(RC.INVALID_PRODUCT, "Kode produk tidak valid.");
    }
    const productCode = input.productCode as PdamProductCode;

    if (!input.customerId || !input.ref1 || !input.ref2 || !input.nominal) {
      throw new ApiError(
        RC.INCOMPLETE_PAYMENT,
        "Parameter pembayaran tidak lengkap. Lakukan inquiry terlebih dahulu.",
      );
    }

    const existing = await TransactionRepository.findByRef2(input.ref2);
    if (existing) {
      throw new ApiError(
        RC.ALREADY_PAID,
        "Tagihan sudah dibayar sebelumnya (idempoten).",
        { transaction: existing, receiptText: generateReceiptText(existing) },
      );
    }

    const result = await RajabillerService.executePayment({
      productCode,
      customerId: input.customerId,
      ref1: input.ref1,
      ref2: input.ref2,
      nominal: input.nominal.toString(),
    });

    try {
      const savedTx = await TransactionRepository.create({
        ...result.record,
        productCode,
        ref2: input.ref2,
      });

      return {
        transaction: savedTx,
        receiptText: generateReceiptText(savedTx),
        keterangan: result.keterangan,
      };
    } catch (err: any) {
      if (err && (err.code === "ER_DUP_ENTRY" || err.errno === 1062)) {
        const stored = await TransactionRepository.findByRef2(input.ref2);
        if (stored) {
          throw new ApiError(
            RC.ALREADY_PAID,
            "Tagihan sudah dibayar sebelumnya (idempoten).",
            { transaction: stored, receiptText: generateReceiptText(stored) },
          );
        }
      }
      throw err;
    }
  }
}
