// [MONEYIO-SEED-001]
import type { Transaction } from "./transactions.types";

export const TRANSACTIONS_SEED: Transaction[] = [
  {
    id: "seed-1",
    type: "income",
    amount: 5000,
    date: "2025-01-05",
    categoryId: "cat_salary",
    description: "Salário",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    type: "expense",
    amount: 1200,
    date: "2025-01-10",
    categoryId: "cat_market",
    description: "Supermercado",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-3",
    type: "expense",
    amount: 350,
    date: "2025-01-15",
    categoryId: "cat_transport",
    description: "Uber",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
