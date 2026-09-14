export function toInt(
  val?: string | number | null,
  fallback: number = 0,
): number {
  if (typeof val === "number") return isNaN(val) ? fallback : val;
  if (!val) return fallback;
  const parsed = parseInt(val.trim(), 10);
  return isNaN(parsed) ? fallback : parsed;
}
