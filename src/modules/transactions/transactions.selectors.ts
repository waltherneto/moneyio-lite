// [MONEYIO-SELECTORS-001]
import type { Transaction, TransactionFilters } from "./transactions.types";
import { getMonthKey } from "../../shared/lib/dates";

export function filterTransactions(
  items: Transaction[],
  filters: TransactionFilters
): Transaction[] {
  const search = (filters.search ?? "").trim().toLowerCase();
  const type = filters.type ?? "all";
  const categoryId = filters.categoryId ?? "all";

  return items.filter((t) => {
    const sameMonth = getMonthKey(t.date) === filters.month;
    if (!sameMonth) return false;

    if (type !== "all" && t.type !== type) return false;

    if (categoryId !== "all" && t.categoryId !== categoryId) return false;

    if (search) {
      const hay = `${t.description ?? ""}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }

    return true;
  });
}

export function computeSummary(items: Transaction[]): {
  income: number;
  expense: number;
  balance: number;
} {
  let income = 0;
  let expense = 0;

  for (const t of items) {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  }

  // keep 2 decimals
  income = Math.round(income * 100) / 100;
  expense = Math.round(expense * 100) / 100;

  const balance = Math.round((income - expense) * 100) / 100;

  return { income, expense, balance };
}
