import { RajabillerService } from "./rajabillerService.js";
import { TransactionRepository } from "../repository/transaction.repository.js";
import { generateReceiptText } from "./receiptService.js";
import { TransactionRecord, DuplicatePaymentError } from "../models/transaction.js";
import { ApiError } from "../utils/apiError.js";
import { isSupportedProduct } from "../utils/apiResponse.js";

/**
 * Service layer: payment use case.
 * Validates input, enforces idempotency (spec: a stored ref2 is a settled
 * outcome — "00" paid or "33" already paid upstream — never replay it),
 * persists the result, and assembles the receipt.
 *
 * Idempotency is enforced by a MySQL UNIQUE key on ref2 (race-free): the
 * pre-check gives a friendly early return, the catch on ER_DUP_ENTRY is the
 * authoritative guard.
 */
export class PaymentService {
  public static async pay(input: {
    productCode?: string;
    customerId?: string;
    ref1?: string;
    ref2?: string;
    nominal?: string | number;
  }): Promise<{ transaction: TransactionRecord; receiptText: string; keterangan: string }> {
    if (!isSupportedProduct(input.productCode)) {
      throw new ApiError("01", "Kode produk tidak valid.");
    }

    if (!input.customerId || !input.ref1 || !input.ref2 || !input.nominal) {
      throw new ApiError(
        "03",
        "Parameter pembayaran tidak lengkap. Lakukan inquiry terlebih dahulu."
      );
    }

    // Friendly pre-check: any stored row for ref2 means the bill settled
    // ("00") or was already paid upstream ("33"); failed payments are never
    // stored. Block replay before hitting Rajabiller.
    const existing = await TransactionRepository.findByRef2(input.ref2);
    if (existing) {
      throw new DuplicatePaymentError(existing, generateReceiptText(existing));
    }

    const result = await RajabillerService.executePayment({
      productCode: input.productCode,
      customerId: input.customerId,
      ref1: input.ref1,
      ref2: input.ref2,
      nominal: input.nominal.toString(),
    });

    // "00" = paid, "33" = already paid upstream. Both are settled outcomes and stored;
    // any other status already threw inside executePayment.
    try {
      const savedTx = await TransactionRepository.create({
        ...result.record,
        productCode: input.productCode,
        ref2: input.ref2, // request ref2 = idempotency key; receipt number lives in noResi
      });

      return {
        transaction: savedTx,
        receiptText: generateReceiptText(savedTx),
        keterangan: result.keterangan,
      };
    } catch (err: any) {
      // Lost a race: another request settled this ref2 between our pre-check
      // and insert. MySQL ER_DUP_ENTRY -> serve the stored transaction.
      if (err && (err.code === "ER_DUP_ENTRY" || err.errno === 1062)) {
        const stored = await TransactionRepository.findByRef2(input.ref2);
        if (stored) {
          throw new DuplicatePaymentError(stored, generateReceiptText(stored));
        }
      }
      throw err;
    }
  }
}
