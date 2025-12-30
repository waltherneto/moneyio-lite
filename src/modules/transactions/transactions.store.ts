// [MONEYIO-STORE-001]
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  MonthKey,
  Transaction,
  TransactionCreateInput,
  TransactionUpdateInput,
  TransactionFilters,
} from "./transactions.types";
import { createId } from "../../shared/lib/id";
import { getMonthKey, nowISOString } from "../../shared/lib/dates";
import { normalizeAmount } from "../../shared/lib/money";
import { readStorage, writeStorage } from "../../shared/lib/storage";
import { TRANSACTIONS_SEED } from "./transactions.seed";

const STORAGE_KEY = "moneyio.transactions";
const STORAGE_VERSION = 1;

type TransactionsState = {
  items: Transaction[];

  // UI/filters
  filters: TransactionFilters;

  // CRUD
  createTransaction: (input: TransactionCreateInput) => Transaction;
  updateTransaction: (id: string, patch: TransactionUpdateInput) => void;
  deleteTransaction: (id: string) => void;

  // Filters
  setMonth: (month: MonthKey) => void;
  setSearch: (search: string) => void;
  setFilters: (patch: Partial<TransactionsState["filters"]>) => void;
  setTypeFilter: (type: TransactionFilters["type"]) => void;
  setCategoryFilter: (categoryId: TransactionFilters["categoryId"]) => void;
  clearOptionalFilters: () => void;

  // Persistence helpers
  hydrate: () => void;
  resetAll: () => void;
  resetToDemo: () => void;
};

function sortByDateDesc(a: Transaction, b: Transaction): number {
  // ISO date strings compare lexicographically
  if (a.date > b.date) return -1;
  if (a.date < b.date) return 1;
  // tie-breaker by updatedAt
  if (a.updatedAt > b.updatedAt) return -1;
  if (a.updatedAt < b.updatedAt) return 1;
  return 0;
}

function persist(items: Transaction[]): void {
  writeStorage(STORAGE_KEY, STORAGE_VERSION, items);
}

function defaultFilters(): TransactionFilters {
  return {
    month: getMonthKey(new Date().toISOString().slice(0, 10)) as MonthKey,
    search: "",
    type: "all",
    categoryId: "all",
  };
}

export const useTransactionsStore = create<TransactionsState>()(
  devtools((set, get) => ({
    items: [],
    filters: defaultFilters(),

    hydrate: () => {
      const loaded = readStorage<Transaction[]>(STORAGE_KEY, STORAGE_VERSION);

      if (!loaded || loaded.length === 0) {
        persist(TRANSACTIONS_SEED);
        set({ items: TRANSACTIONS_SEED }, false, "seed");
        return;
      }

      set({ items: loaded.sort(sortByDateDesc) }, false, "hydrate");
    },

    resetAll: () => {
      persist([]);
      set(
        {
          items: [],
          filters: defaultFilters(),
        },
        false,
        "resetAll"
      );
    },
    resetToDemo: () => {
      const seeded = [...TRANSACTIONS_SEED].sort(sortByDateDesc);
      persist(seeded);
      set(
        {
          items: seeded,
          filters: defaultFilters(),
        },
        false,
        "resetToDemo"
      );
    },

    createTransaction: (input) => {
      const now = nowISOString();
      const tx: Transaction = {
        id: createId("txn"),
        type: input.type,
        amount: normalizeAmount(Math.abs(input.amount)),
        date: input.date,
        categoryId: input.categoryId,
        description: input.description?.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      };

      const next = [tx, ...get().items].sort(sortByDateDesc);
      persist(next);
      set({ items: next }, false, "createTransaction");
      return tx;
    },

    updateTransaction: (id, patch) => {
      const now = nowISOString();

      const next = get().items.map((t) => {
        if (t.id !== id) return t;

        const updated: Transaction = {
          ...t,
          ...patch,
          amount:
            patch.amount !== undefined
              ? normalizeAmount(Math.abs(patch.amount))
              : t.amount,
          description:
            patch.description !== undefined
              ? patch.description.trim() || undefined
              : t.description,
          updatedAt: now,
        };

        return updated;
      });

      persist(next);
      set({ items: next.sort(sortByDateDesc) }, false, "updateTransaction");
    },

    deleteTransaction: (id) => {
      const next = get().items.filter((t) => t.id !== id);
      persist(next);
      set({ items: next }, false, "deleteTransaction");
    },

    setMonth: (month) =>
      set(
        (state) => ({
          filters: { ...state.filters, month },
        }),
        false,
        "setMonth"
      ),

    setSearch: (search) =>
      set(
        (state) => ({
          filters: { ...state.filters, search },
        }),
        false,
        "setSearch"
      ),

    setFilters: (patch) =>
      set(
        (state) => ({
          filters: { ...state.filters, ...patch },
        }),
        false,
        "setFilters"
      ),

    setTypeFilter: (type) =>
      set(
        (state) => ({
          filters: { ...state.filters, type: type ?? "all" },
        }),
        false,
        "setTypeFilter"
      ),

    setCategoryFilter: (categoryId) =>
      set(
        (state) => ({
          filters: { ...state.filters, categoryId: categoryId ?? "all" },
        }),
        false,
        "setCategoryFilter"
      ),

    clearOptionalFilters: () =>
      set(
        (state) => ({
          filters: {
            ...state.filters,
            search: "",
            type: "all",
            categoryId: "all",
          },
        }),
        false,
        "clearOptionalFilters"
      ),
  }))
);
