// [MONEYIO-DATE-001]
import type { MonthKey } from "../../modules/transactions/transactions.types";

export function getMonthKey(dateISO: string): MonthKey {
  // expects "YYYY-MM-DD"
  return dateISO.slice(0, 7) as MonthKey;
}

export function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function nowISOString(): string {
  return new Date().toISOString();
}
