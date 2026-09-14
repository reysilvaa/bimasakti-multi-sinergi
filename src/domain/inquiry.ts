import { z } from "zod";

export const specBillSchema = z.object({
  blth: z.string(),
  air: z.number().int(),
  denda: z.number().int(),
  nonair: z.number().int(),
  meterAwal: z.number().int(),
  meterAkhir: z.number().int(),
  bulan: z.string(),
  tahun: z.string(),
});

export const inquiryDataSchema = z.object({
  idpel: z.string(),
  nometer: z.string(),
  alamat: z.string(),
  nama: z.string(),
  nominal: z.number().int(),
  admin: z.number().int(),
  total_bayar: z.number().int(),
  jumlah_bulan: z.string(),
  data_bill: z.array(specBillSchema),
  ref1: z.string(),
  ref2: z.string(),
});

export const inquiryRequestSchema = z.object({
  productCode: z.string({ message: "Kode produk wajib diisi." }),
  customerId: z.string({ message: "Nomor ID Pelanggan (idpel) wajib diisi." }),
});

export type SpecBill = z.infer<typeof specBillSchema>;
export type InquiryData = z.infer<typeof inquiryDataSchema>;
