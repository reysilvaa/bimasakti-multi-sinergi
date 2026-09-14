import type { SpecBill } from "@/domain/inquiry.js";
import { SUPPORTED_PRODUCTS } from "@/domain/product.js";
import type { RajabillerRawResponse } from "@/domain/rajabiller.js";
import type { TransactionRecord } from "@/domain/transaction.js";
import { toInt } from "@/utils/helpers.js";
import { terbilang } from "@/utils/terbilang.js";

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

function toSpecBill(raw: RajabillerRawResponse, i: number): SpecBill | null {
  const bulan = (raw[`monthperiod${i}`] || "").trim();
  const tahunRaw = (raw[`yearperiod${i}`] || "").trim();
  const airStr = (raw[`billamount${i}`] || "").trim();
  if (!bulan || !tahunRaw || !airStr) return null;

  const miscStr = (raw[`miscamount${i}`] || "").trim();
  const nonair = miscStr.includes("|")
    ? miscStr.split("|").reduce((acc, cur) => acc + toInt(cur), 0)
    : toInt(miscStr);

  return {
    air: toInt(airStr),
    denda: toInt(raw[`penalty${i}`]),
    nonair,
    meter_awal: toInt(raw[`firstmeterread${i}`]),
    meter_akhir: toInt(raw[`lastmeterread${i}`]),
    bulan,
    tahun: tahunRaw.length === 2 ? `20${tahunRaw}` : tahunRaw,
  };
}

export function extractBills(
  raw: RajabillerRawResponse,
): Record<string, SpecBill> {
  const bills: Record<string, SpecBill> = {};
  for (let i = 1; i <= 6; i++) {
    const bill = toSpecBill(raw, i);
    if (bill) bills[`blth${i}`] = bill;
  }
  return bills;
}

function formatReceiptDate(rawWaktu?: string): string {
  if (!rawWaktu || rawWaktu.length < 14) {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  return `${rawWaktu.slice(6, 8)}-${rawWaktu.slice(4, 6)}-${rawWaktu.slice(0, 4)} ${rawWaktu.slice(8, 10)}:${rawWaktu.slice(10, 12)}:${rawWaktu.slice(12, 14)}`;
}

const dot = (n: number): string => n.toLocaleString("id-ID");

function periodLabel(b: SpecBill): string {
  const idx = toInt(b.bulan) - 1;
  return `${MONTH_NAMES[idx] || b.bulan} ${b.tahun}`;
}

function formatFeeLine(label: string, amount: number): string {
  return `${label.padEnd(15, " ")}: Rp${dot(amount).padStart(14, " ")}`;
}

function wrapWords(text: string, maxLen = 50): string[] {
  const words = text.trim().split(/\s+/);
  const result: string[] = [];
  let current = "";
  for (const word of words) {
    if (!current) {
      current = word;
    } else if (`${current} ${word}`.length <= maxLen) {
      current += ` ${word}`;
    } else {
      result.push(current);
      current = word;
    }
  }
  if (current) result.push(current);
  return result;
}

export function generateReceiptText(tx: TransactionRecord): string {
  let raw: RajabillerRawResponse | null = null;
  try {
    raw = JSON.parse(tx.rawResponse);
  } catch {}

  const billsMap = raw ? extractBills(raw) : {};
  const bills = Object.values(billsMap);
  const pdamName =
    tx.pdamName || SUPPORTED_PRODUCTS[tx.productCode]?.name || "PDAM";

  const billLines =
    bills.length > 0
      ? bills.map(
          (b) =>
            `${`  ${periodLabel(b)}`.padEnd(15, " ")}: Rp${dot(b.air).padStart(14, " ")}`,
        )
      : [
          `${"  BULAN 1".padEnd(15, " ")}: Rp${dot(tx.nominal).padStart(14, " ")}`,
        ];

  const noResi = tx.noResi || tx.ref2 || raw?.noref2 || raw?.ref2 || "-";

  const lines: string[] = [
    `STRUK PEMBAYARAN ${pdamName}`,
    `${"TANGGAL".padEnd(15, " ")}: ${formatReceiptDate(raw?.waktu)}`,
    `${"NO. RESI".padEnd(15, " ")}: ${noResi}`,
    `${"NAMA PAM".padEnd(15, " ")}: ${pdamName}`,
    `${"NO. PELANGGAN".padEnd(15, " ")}: ${tx.customerId}`,
    `${"NAMA".padEnd(15, " ")}: ${tx.customerName || raw?.customername || "-"}`,
    `${"ALAMAT".padEnd(15, " ")}: ${tx.customerAddress || raw?.customeraddress || "-"}`,
  ];

  const isBondowoso = tx.productCode === "WABONDO";
  if (isBondowoso || (tx.meterUsage !== undefined && tx.meterUsage > 0)) {
    lines.push(`${"PEMAKAIAN".padEnd(15, " ")}: ${tx.meterUsage} M3`);
  }

  lines.push("RINCIAN TAGIHAN", ...billLines);
  lines.push(formatFeeLine("DENDA", tx.penalty));

  if (isBondowoso || tx.miscFee > 0) {
    lines.push(formatFeeLine("BEBAN", tx.miscFee));
  }

  lines.push(
    formatFeeLine("ADMIN", tx.adminFee),
    `${" ".repeat(17)}${"-".repeat(21)}`,
    formatFeeLine("TOTAL TAGIHAN", tx.totalAmount),
    "",
    `${"TERBILANG".padEnd(15, " ")}:`,
    ...wrapWords(tx.terbilang || terbilang(tx.totalAmount), 50),
    "",
    `${pdamName} MENYATAKAN STRUK INI`,
    "SEBAGAI BUKTI PEMBAYARAN YANG SAH",
  );

  return lines.join("\n");
}
