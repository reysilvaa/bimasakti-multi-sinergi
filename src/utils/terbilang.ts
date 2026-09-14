const UNITS = [
  "",
  "SATU",
  "DUA",
  "TIGA",
  "EMPAT",
  "LIMA",
  "ENAM",
  "TUJUH",
  "DELAPAN",
  "SEMBILAN",
  "SEPULUH",
  "SEBELAS",
];

function convertNumberToWords(n: number): string {
  const num = Math.floor(Math.abs(n));

  if (num === 0) return "";
  if (num < 12) return UNITS[num] ?? "";
  if (num < 20) return `${convertNumberToWords(num - 10)} BELAS`;
  if (num < 100) {
    const tens = Math.floor(num / 10);
    const remainder = num % 10;
    return `${UNITS[tens]} PULUH ${convertNumberToWords(remainder)}`.trim();
  }
  if (num < 200) {
    return `SERATUS ${convertNumberToWords(num - 100)}`.trim();
  }
  if (num < 1000) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    return `${UNITS[hundreds]} RATUS ${convertNumberToWords(remainder)}`.trim();
  }
  if (num < 2000) {
    return `SERIBU ${convertNumberToWords(num - 1000)}`.trim();
  }
  if (num < 1000000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    return `${convertNumberToWords(thousands)} RIBU ${convertNumberToWords(remainder)}`.trim();
  }
  if (num < 1000000000) {
    const millions = Math.floor(num / 1000000);
    const remainder = num % 1000000;
    return `${convertNumberToWords(millions)} JUTA ${convertNumberToWords(remainder)}`.trim();
  }
  if (num < 1000000000000) {
    const billions = Math.floor(num / 1000000000);
    const remainder = num % 1000000000;
    return `${convertNumberToWords(billions)} MILYAR ${convertNumberToWords(remainder)}`.trim();
  }
  const trillions = Math.floor(num / 1000000000000);
  const remainder = num % 1000000000000;
  return `${convertNumberToWords(trillions)} TRILIUN ${convertNumberToWords(remainder)}`.trim();
}

export function terbilang(amount: number): string {
  if (amount === 0) return "NOL RUPIAH";
  const words = convertNumberToWords(amount).replace(/\s+/g, " ").trim();
  return `${words} RUPIAH`;
}
