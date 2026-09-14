import { z } from "zod";
import { pdamProductCodeSchema } from "@/domain/product.js";

const transactionRecordSchema = z.object({
  id: z.number().int(),
  ref1: z.string(),
  ref2: z.string(),
  noResi: z.string(),
  productCode: pdamProductCodeSchema,
  pdamName: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  customerAddress: z.string(),
  nominal: z.number().int(),
  adminFee: z.number().int(),
  penalty: z.number().int(),
  miscFee: z.number().int(),
  meterUsage: z.number().int(),
  totalAmount: z.number().int(),
  terbilang: z.string(),
  status: z.string(),
  statusDescription: z.string(),
  rawRequest: z.string(),
  rawResponse: z.string(),
  createdAt: z.string(),
});

export type TransactionRecord = z.infer<typeof transactionRecordSchema>;
