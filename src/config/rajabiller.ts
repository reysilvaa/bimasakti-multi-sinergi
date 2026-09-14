import "dotenv/config";

export const RAJABILLER = {
  URL:
    process.env.RAJABILLER_URL ||
    "https://c-dev-partnerlink.rajabiller.com/json/index.php",
  UID: process.env.RAJABILLER_UID || "SP300203",
  PIN: process.env.RAJABILLER_PIN || "311575",
} as const;
