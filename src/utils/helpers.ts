import { CONFIG, SUPPORTED_PRODUCTS } from "../config/constants.js";
import { RajabillerRawResponse, RajabillerRequest } from "../types/rajabiller.types.js";
import { InquiryData, PdamProductCode, SpecBill } from "../types/transaction.types.js";
import { extractBills } from "../services/receiptService.js";

/**
 * Safely parse integer with default fallback.
 */
export function toInt(val?: string | number | null, fallback: number = 0): number {
  if (typeof val === "number") return isNaN(val) ? fallback : val;
  if (!val) return fallback;
  const parsed = parseInt(val.trim(), 10);
  return isNaN(parsed) ? fallback : parsed;
}

/** Type guard: a product code is supported iff it is a key of SUPPORTED_PRODUCTS. */
export function isSupportedProduct(code: unknown): code is PdamProductCode {
  return typeof code === "string" && code in SUPPORTED_PRODUCTS;
}

/** Spec point 4 response envelope: { rc, ket, data }. rc "00" = success. */
export function envelope<T>(rc: string, ket: string, data?: T) {
  return data === undefined ? { rc, ket } : { rc, ket, data };
}

/** Build spec point 4 inquiry data shape from a raw Rajabiller inquiry response. */
export function toInquiryData(
  raw: RajabillerRawResponse,
  productCode: PdamProductCode,
  sentRef1: string
): InquiryData {
  const bills: SpecBill[] = extractBills(raw);
  const nominal = toInt(raw.nominal);
  const admin = toInt(raw.biayaadmin);

  return {
    idpel: raw.customerid1 || raw.idpelanggan1 || "",
    nometer: raw.nometer || "",
    alamat: raw.customeraddress || "",
    nama: raw.customername || "",
    nominal,
    admin,
    total_bayar: nominal + admin,
    jumlah_bulan: raw.billquantity || String(bills.length),
    data_bill: bills,
    ref1: raw.ref1 || sentRef1,
    ref2: raw.ref2 || "",
  };
}

/**
 * Shared HTTP POST client for Rajabiller partnerlink API.
 * By default throws Error with .rc on non-"00" business failure;
 * pass { throwOnBusinessError: false } to get the raw response instead (payment).
 */
export async function sendRajabillerRequest(
  payload: RajabillerRequest,
  opts?: { throwOnBusinessError?: boolean }
): Promise<RajabillerRawResponse> {
  const response = await fetch(CONFIG.RAJABILLER.URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw Object.assign(new Error(`Rajabiller HTTP Error: ${response.status} ${response.statusText}`), { rc: "99" });
  }

  const raw = (await response.json()) as RajabillerRawResponse;
  if (raw.status !== "00" && opts?.throwOnBusinessError !== false) {
    throw Object.assign(new Error(raw.keterangan || "Rajabiller request failed"), { rc: raw.status });
  }
  return raw;
}
