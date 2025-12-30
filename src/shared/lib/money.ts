// [MONEYIO-MONEY-001]
export function normalizeAmount(value: number): number {
  if (!Number.isFinite(value)) return 0;
  // keep 2 decimals, avoid float weirdness a bit
  return Math.round(value * 100) / 100;
}
