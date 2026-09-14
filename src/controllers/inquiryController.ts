import { Request, Response } from "express";
import { InquiryService } from "../services/inquiryService.js";
import { envelope } from "../utils/apiResponse.js";
import { sendError } from "./errorMapper.js";

/**
 * Controller layer: inquiry HTTP adapter.
 * Parse HTTP input → call service → map result/ApiError to the spec envelope.
 */
export async function inquiry(req: Request, res: Response): Promise<void> {
  try {
    const data = await InquiryService.inquire(req.body as {
      productCode?: string;
      customerId?: string;
    });
    res.json(envelope("00", "Inquiry tagihan berhasil didapatkan.", data));
  } catch (err) {
    sendError(res, err);
  }
}
