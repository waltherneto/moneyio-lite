// [MONEYIO-CHARTS-001]
import type { Transaction } from "./transactions.types";
import { getCategoryName } from "../categories/categories.utils";

export function expensesByCategory(transactions: Transaction[]) {
  const map = new Map<string, number>();

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const name = getCategoryName(t.categoryId);
      map.set(name, (map.get(name) ?? 0) + t.amount);
    });

  return Array.from(map.entries()).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
  }));
}

export function dailyFlow(transactions: Transaction[]) {
  const map = new Map<string, { income: number; expense: number }>();

  transactions.forEach((t) => {
    if (!map.has(t.date)) {
      map.set(t.date, { income: 0, expense: 0 });
    }

    const day = map.get(t.date)!;
    if (t.type === "income") day.income += t.amount;
    else day.expense += t.amount;
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({
      date,
      income: Math.round(values.income * 100) / 100,
      expense: Math.round(values.expense * 100) / 100,
    }));
}
