import { z } from "zod";

const rajabillerRequestSchema = z.object({
  method: z.enum(["fastpay.inq", "fastpay.pay"]),
  uid: z.string(),
  pin: z.string(),
  idpel1: z.string(),
  idpel2: z.string(),
  idpel3: z.string(),
  kode_produk: z.string(),
  ref1: z.string(),
  nominal: z.string().optional(),
  ref2: z.string().optional(),
  ref3: z.string().optional(),
});
export type RajabillerRequest = z.infer<typeof rajabillerRequestSchema>;

const rajabillerResponseSchema = z
  .object({
    kodeproduk: z.string().optional(),
    waktu: z.string().optional(),
    nominal: z.string().optional(),
    biayaadmin: z.string().optional(),
    ref1: z.string().optional(),
    ref2: z.string().optional(),
    status: z.string(),
    keterangan: z.string().optional(),
    billquantity: z.string().optional(),
    noref2: z.string().optional(),
    customername: z.string().optional(),
    customeraddress: z.string().optional(),
    nometer: z.string().optional(),
  })
  .passthrough();

export type RajabillerRawResponse = z.infer<typeof rajabillerResponseSchema> & {
  [key: string]: string | undefined;
};
