import type { SpecBill } from "../domain/inquiry.js";
import { SUPPORTED_PRODUCTS } from "../domain/product.js";
import type { RajabillerRawResponse } from "../domain/rajabiller.js";
import { type TransactionRecord } from "../domain/transaction.js";
import { toInt } from "../utils/helpers.js";
import { terbilang } from "../utils/terbilang.js";

const MONTH_NAMES = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MEI",
  "JUN",
  "JUL",
  "AGS",
  "SEP",
  "OKT",
  "NOV",
  "DES",
];

export function toSpecBill(
  raw: RajabillerRawResponse,
  i: number,
): SpecBill | null {
  const bulan = (raw[`monthperiod${i}`] || "").trim();
  const tahunRaw = (raw[`yearperiod${i}`] || "").trim();
  const airStr = (raw[`billamount${i}`] || "").trim();
  if (!bulan || !tahunRaw || !airStr) return null;

  const miscStr = (raw[`miscamount${i}`] || "").trim();
  const nonair = miscStr.includes("|")
    ? miscStr.split("|").reduce((acc, cur) => acc + toInt(cur), 0)
    : toInt(miscStr);

  return {
    blth: `blth${i}`,
    air: toInt(airStr),
    denda: toInt(raw[`penalty${i}`]),
    nonair,
    meterAwal: toInt(raw[`firstmeterread${i}`]),
    meterAkhir: toInt(raw[`lastmeterread${i}`]),
    bulan,
    tahun: tahunRaw.length === 2 ? `20${tahunRaw}` : tahunRaw,
  };
}

export function extractBills(raw: RajabillerRawResponse): SpecBill[] {
  const bills: SpecBill[] = [];
  for (let i = 1; i <= 6; i++) {
    const bill = toSpecBill(raw, i);
    if (bill) bills.push(bill);
  }
  return bills;
}

export function formatReceiptDate(rawWaktu?: string): string {
  if (!rawWaktu || rawWaktu.length < 14) {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  return `${rawWaktu.slice(6, 8)}-${rawWaktu.slice(4, 6)}-${rawWaktu.slice(0, 4)} ${rawWaktu.slice(8, 10)}:${rawWaktu.slice(10, 12)}:${rawWaktu.slice(12, 14)}`;
}

const dot = (n: number): string => n.toLocaleString("id-ID");

export function periodLabel(b: SpecBill): string {
  const idx = toInt(b.bulan) - 1;
  return `${MONTH_NAMES[idx] || b.bulan}${b.tahun}`;
}

export function generateReceiptText(tx: TransactionRecord): string {
  let raw: RajabillerRawResponse | null = null;
  try {
    raw = JSON.parse(tx.rawResponse);
  } catch {}

  const bills = raw ? extractBills(raw) : [];
  const pdamName =
    tx.pdamName || SUPPORTED_PRODUCTS[tx.productCode]?.name || "PDAM";
  const billLines =
    bills.length > 0
      ? bills.map((b) => ` ${periodLabel(b)} :Rp ${dot(b.air)}`)
      : [` BULAN 1 :Rp ${dot(tx.nominal)}`];

  const lines: string[] = [
    `STRUK PEMBAYARAN ${pdamName}`,
    `TANGGAL        : ${formatReceiptDate(raw?.waktu)}`,
    `NO. RESI       : ${tx.noResi || "-"}`,
    `NAMA PAM       : ${pdamName}`,
    `NO. PELANGGAN  : ${tx.customerId}`,
    `NAMA           : ${tx.customerName || "-"}`,
    `ALAMAT         : ${tx.customerAddress || "-"}`,
  ];

  const isBondowoso = tx.productCode === "WABONDO";
  if (isBondowoso) {
    lines.push(`PEMAKAIAN      : ${tx.meterUsage}M3`);
  }

  lines.push(
    "RINCIAN TAGIHAN",
    ...billLines,
    `DENDA          :Rp ${dot(tx.penalty)}`,
  );

  if (isBondowoso) {
    lines.push(`BEBAN          :Rp ${dot(tx.miscFee)}`);
  }

  lines.push(
    `ADMIN          :Rp ${dot(tx.adminFee)}`,
    "                    -------------------------",
    `TOTAL TAGIHAN  :Rp ${dot(tx.totalAmount)}`,
    "",
    "TERBILANG      :",
    tx.terbilang || terbilang(tx.totalAmount),
    "",
    `${pdamName} MENYATAKAN STRUK INI`,
    "SEBAGAI BUKTI PEMBAYARAN YANG SAH",
  );

  return lines.join("\n");
}
