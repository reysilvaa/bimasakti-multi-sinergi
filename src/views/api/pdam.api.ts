import type { InquiryData } from "@/domain/inquiry.js";
import type { TransactionRecord } from "@/domain/transaction.js";
import type { Envelope, Product } from "@/views/utils.js";

export interface PaymentPayload {
  productCode: string;
  customerId: string;
  ref1: string;
  ref2: string;
  nominal: number | string;
}

export interface PaymentResult {
  transaction: TransactionRecord;
  receiptText: string;
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch("/api/products");
  const json: Envelope<Product[]> = await res.json();
  if (json.rc === "00" && json.data) {
    return json.data;
  }
  throw new Error(json.ket || "Gagal mengambil daftar produk.");
}

export async function getTransactions(
  limit = 100,
): Promise<TransactionRecord[]> {
  const res = await fetch(`/api/transactions?limit=${limit}`);
  const json: Envelope<TransactionRecord[]> = await res.json();
  if (json.rc === "00" && json.data) {
    return json.data;
  }
  throw new Error(json.ket || "Gagal mengambil riwayat transaksi.");
}

export async function requestInquiry(
  productCode: string,
  customerId: string,
): Promise<InquiryData> {
  const res = await fetch("/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productCode, customerId }),
  });
  const json: Envelope<InquiryData> = await res.json();
  if (json.rc !== "00" || !json.data) {
    throw new Error(json.ket || "Gagal melakukan inquiry tagihan.");
  }
  return json.data;
}

export async function requestPayment(
  payload: PaymentPayload,
): Promise<{ data: PaymentResult; ket: string }> {
  const res = await fetch("/api/payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json: Envelope<PaymentResult> = await res.json();
  if (json.rc !== "00" || !json.data) {
    throw new Error(json.ket || "Pembayaran gagal diproses.");
  }
  return { data: json.data, ket: json.ket };
}

export async function getTransactionDetail(id: number): Promise<PaymentResult> {
  const res = await fetch(`/api/transactions/${id}`);
  const json: Envelope<PaymentResult> = await res.json();
  if (json.rc === "00" && json.data?.receiptText) {
    return json.data;
  }
  throw new Error(json.ket || "Gagal mengambil detail transaksi.");
}
