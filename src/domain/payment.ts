import { z } from "zod";

export const paymentRequestSchema = z.object({
  productCode: z.string({ message: "Kode produk wajib diisi." }),
  customerId: z.string(),
  ref1: z.string(),
  ref2: z.string(),
  nominal: z.union([z.string(), z.number()]),
});
