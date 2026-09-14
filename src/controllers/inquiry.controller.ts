import type { Request, Response } from "express";
import { inquiryRequestSchema } from "@/domain/inquiry.js";
import { envelope, RC } from "@/domain/protocol.js";
import { InquiryService } from "@/services/inquiry.service.js";

export async function inquiry(req: Request, res: Response): Promise<void> {
  const body = inquiryRequestSchema.parse(req.body);
  const data = await InquiryService.inquire(body);
  res.json(envelope(RC.SUCCESS, "Inquiry tagihan berhasil didapatkan.", data));
}
