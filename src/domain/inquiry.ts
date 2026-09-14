import { z } from "zod";

export const specBillSchema = z.object({
  air: z.number().int(),
  denda: z.number().int(),
  nonair: z.number().int(),
  meter_awal: z.number().int(),
  meter_akhir: z.number().int(),
  bulan: z.string(),
  tahun: z.string(),
});

export const inquiryDataSchema = z.object({
  idpel: z.string(),
  nomet: z.string(),
  nometer: z.string().optional(),
  alamat: z.string(),
  nama: z.string().optional(),
  nominal: z.number().int(),
  admin: z.number().int(),
  total_bayar: z.number().int(),
  jumlah_bulan: z.string(),
  data_bill: z.record(z.string(), specBillSchema),
  ref1: z.string(),
  ref2: z.string(),
});

export const inquiryRequestSchema = z.object({
  productCode: z.string({ message: "Kode produk wajib diisi." }),
  customerId: z.string({ message: "Nomor ID Pelanggan (idpel) wajib diisi." }),
});

export type SpecBill = z.infer<typeof specBillSchema>;
export type InquiryData = z.infer<typeof inquiryDataSchema>;
