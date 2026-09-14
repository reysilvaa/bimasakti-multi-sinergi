import type { Request, Response } from "express";
import { paymentRequestSchema } from "../domain/payment.js";
import { PaymentService } from "../services/paymentService.js";
import { RC, envelope } from "../domain/protocol.js";

export async function payment(req: Request, res: Response): Promise<void> {
  const body = paymentRequestSchema.parse(req.body);
  const result = await PaymentService.pay(body);
  res.json(
    envelope(RC.SUCCESS, result.keterangan, {
      transaction: result.transaction,
      receiptText: result.receiptText,
    }),
  );
}
