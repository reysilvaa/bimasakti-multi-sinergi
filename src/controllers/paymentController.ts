import { Request, Response } from "express";
import { PaymentService } from "../services/paymentService.js";
import { envelope } from "../utils/apiResponse.js";
import { sendError } from "./errorMapper.js";

/**
 * Controller layer: payment HTTP adapter.
 * Parse HTTP input → call service → map result/ApiError to the spec envelope.
 */
export async function payment(req: Request, res: Response): Promise<void> {
  try {
    const result = await PaymentService.pay(req.body as {
      productCode?: string;
      customerId?: string;
      ref1?: string;
      ref2?: string;
      nominal?: string | number;
    });
    res.json(
      envelope("00", result.keterangan, {
        transaction: result.transaction,
        receiptText: result.receiptText,
      })
    );
  } catch (err) {
    sendError(res, err);
  }
}
