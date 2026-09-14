import type { Request, Response } from "express";
import { paymentRequestSchema } from "@/domain/payment.js";
import { envelope, RC } from "@/domain/protocol.js";
import { PaymentService } from "@/services/payment.service.js";

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
