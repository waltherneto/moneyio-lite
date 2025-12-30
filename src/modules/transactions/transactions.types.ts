// [MONEYIO-TXN-001]
export type MoneyType = "income" | "expense";

// ISO Date: "YYYY-MM-DD"
export type ISODate = string;

// Month Key: "YYYY-MM"
export type MonthKey = `${number}-${string}`;

export type Transaction = {
  id: string;
  type: MoneyType;
  amount: number; // always positive; type defines direction
  date: ISODate; // "YYYY-MM-DD"
  categoryId: string;
  description?: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
};

export type TransactionCreateInput = Omit<
  Transaction,
  "id" | "createdAt" | "updatedAt"
>;

export type TransactionUpdateInput = Partial<
  Omit<Transaction, "id" | "createdAt" | "updatedAt">
>;

export type TransactionFilters = {
  month: MonthKey; // required
  search?: string; // optional text search (description)
  type?: MoneyType | "all";
  categoryId?: string | "all";
};
