// [MONEYIO-MONTH-001]
import type { MonthKey } from "../../modules/transactions/transactions.types";

export function toMonthKey(value: string): MonthKey {
  // value esperado: "YYYY-MM"
  return value.slice(0, 7) as MonthKey;
}
