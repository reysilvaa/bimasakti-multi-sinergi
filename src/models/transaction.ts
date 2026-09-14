/**
 * Model layer: Transaction entity — pure domain data, no I/O, no framework deps.
 * Shape returned by repository and consumed by services.
 */

export type PdamProductCode = "WASDA" | "WABONDO";

/** One billing period (spec point 4, `data_bill.blthN`). */
export interface SpecBill {
  blth: string;
  air: number;
  denda: number;
  nonair: number;
  meterAwal: number;
  meterAkhir: number;
  bulan: string;
  tahun: string;
}

/** Normalized inquiry data (spec point 4). */
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

/** A settled payment outcome persisted by the repository. */
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

/** Raw Rajabiller API payload shapes (wire format). */
export interface RajabillerRequest {
  method: "fastpay.inq" | "fastpay.pay";
  uid: string;
  pin: string;
  idpel1: string;
  idpel2: string;
  idpel3: string;
  kode_produk: string;
  ref1: string;
  nominal?: string;
  ref2?: string;
  ref3?: string;
}

export interface RajabillerRawResponse {
  kodeproduk?: string;
  waktu?: string;
  nominal?: string;
  biayaadmin?: string;
  ref1?: string;
  ref2?: string;
  status: string;
  keterangan?: string;
  billquantity?: string;
  noref2?: string;
  customername?: string;
  customeraddress?: string;
  nometer?: string;

  [key: string]: string | undefined;
}

/**
 * Thrown when a payment with an already-settled ref2 is replayed.
 * Carries the original stored transaction + its receipt for the envelope.
 */
export class DuplicatePaymentError extends Error {
  public readonly rc = "33";
  public readonly transaction: TransactionRecord;
  public readonly receiptText: string;

  constructor(transaction: TransactionRecord, receiptText: string) {
    super("Tagihan sudah dibayar sebelumnya (idempoten).");
    this.name = "DuplicatePaymentError";
    this.transaction = transaction;
    this.receiptText = receiptText;
  }
}
