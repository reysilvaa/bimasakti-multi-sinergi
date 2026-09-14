import { RajabillerRawResponse } from "./rajabiller.types.js";

export type PdamProductCode = "WASDA" | "WABONDO";

/** One billing period, spec point 4 `data_bill.blthN`. */
export interface SpecBill {
  blth: string; // e.g. "blth1"
  air: number;
  denda: number;
  nonair: number;
  meterAwal: number;
  meterAkhir: number;
  bulan: string;
  tahun: string;
}

/** Normalized inquiry data, spec point 4. */
export interface InquiryData {
  idpel: string;
  nometer: string;
  alamat: string;
  nama: string;
  nominal: number;
  admin: number;
  total_bayar: number;
  jumlah_bulan: string;
  data_bill: SpecBill[];
  ref1: string;
  ref2: string;
}

/** Envelope shape used by every internal API response, spec point 4. */
export interface ApiEnvelope<T = unknown> {
  rc: string;
  ket: string;
  data?: T;
}

export interface TransactionRecord {
  id: number;
  ref1: string;
  ref2: string;
  noResi: string;
  productCode: PdamProductCode;
  pdamName: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  nominal: number;
  adminFee: number;
  penalty: number;
  miscFee: number;
  meterUsage: number;
  totalAmount: number;
  terbilang: string;
  status: string;
  statusDescription: string;
  rawRequest: string;
  rawResponse: string;
  createdAt: string;
}

export interface DbTransactionRow {
  id: number;
  ref1: string;
  ref2: string;
  no_resi: string | null;
  product_code: string;
  pdam_name: string;
  customer_id: string;
  customer_name: string | null;
  customer_address: string | null;
  nominal: number;
  admin_fee: number;
  penalty: number;
  misc_fee: number;
  meter_usage: number;
  total_amount: number;
  terbilang: string | null;
  status: string;
  status_description: string | null;
  raw_request: string | null;
  raw_response: string | null;
  created_at: string;
}
