// [MONEYIO-DASH-FULL-001]
import { useMemo, useState } from "react";
import { useTransactionsStore } from "../transactions.store";
import { filterTransactions, computeSummary } from "../transactions.selectors";
import { SummaryCards } from "../components/SummaryCards";
import { Modal } from "../../../shared/ui/Modal";
import {
  TransactionForm,
  type TransactionFormValues,
} from "../components/TransactionForm";
import type { Transaction } from "../transactions.types";
import { getCategoryName } from "../../categories/categories.utils";
import { toMonthKey } from "../../../shared/lib/month";
import { expensesByCategory, dailyFlow } from "../transactions.charts";
import { ExpensesPieChart } from "../components/ExpensesPieChart";
import { DailyFlowChart } from "../components/DailyFlowChart";
import { exportCSV } from "../../../shared/lib/csv";


function toMonthInputValue(monthKey: string) {
  // MonthKey já é "YYYY-MM"
  return monthKey;
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDateISO(dateISO: string): string {
  const [year, month, day] = dateISO.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("pt-BR");
}

export function DashboardPage() {
  const items = useTransactionsStore((s) => s.items);
  const filters = useTransactionsStore((s) => s.filters);

  const createTransaction = useTransactionsStore((s) => s.createTransaction);
  const updateTransaction = useTransactionsStore((s) => s.updateTransaction);
  const deleteTransaction = useTransactionsStore((s) => s.deleteTransaction);
  const resetToDemo = useTransactionsStore((s) => s.resetToDemo);

  const setMonth = useTransactionsStore((s) => s.setMonth);
  const setSearch = useTransactionsStore((s) => s.setSearch);
  const clearOptionalFilters = useTransactionsStore((s) => s.clearOptionalFilters);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [deleteTx, setDeleteTx] = useState<Transaction | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  const filtered = useMemo(() => {
    return filterTransactions(items, filters);
  }, [items, filters]);

  const summary = useMemo(() => computeSummary(filtered), [filtered]);

  function handleCreate(values: TransactionFormValues) {
    createTransaction({
      type: values.type,
      amount: values.amount,
      date: values.date,
      categoryId: values.categoryId,
      description: values.description?.trim() || undefined,
    });
    setCreateOpen(false);
  }

  function handleEdit(values: TransactionFormValues) {
    if (!editTx) return;

    updateTransaction(editTx.id, {
      type: values.type,
      amount: values.amount,
      date: values.date,
      categoryId: values.categoryId,
      description: values.description?.trim() || undefined,
    });

    setEditTx(null);
  }

  function handleConfirmDelete() {
    if (!deleteTx) return;
    deleteTransaction(deleteTx.id);
    setDeleteTx(null);
  }

  function handleConfirmReset() {
    resetToDemo();
    setResetOpen(false);
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
<img
  src="/brand/logo-moneyio-lite.png"
  alt="MoneyIO Lite"
  className="block w-[120px] sm:w-[140px] md:w-[180px] h-auto select-none"
/>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              onClick={() => exportCSV("moneyio-transactions.csv", filtered)}
            >
              Exportar CSV
            </button>

            <button
              type="button"
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              onClick={() => setResetOpen(true)}
            >
              Resetar dados (demo)
            </button>

            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              onClick={() => setCreateOpen(true)}
            >
              + Nova transação
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_minmax(0,1fr)_auto] md:items-end">
            <div>
              <label className="text-xs font-semibold text-slate-600">Mês</label>
              <input
                type="month"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                value={toMonthInputValue(filters.month)}
                onChange={(e) => setMonth(toMonthKey(e.target.value))}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">
                Buscar (descrição)
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
                value={filters.search ?? ""}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ex: uber, mercado, aluguel..."
              />
            </div>

            <div className="flex md:justify-end">
              <button
                type="button"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 md:w-auto"
                onClick={clearOptionalFilters}
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <p>{filtered.length} transação(ões) no mês selecionado</p>
        </div>
      </header>

      <section className="mt-6">
        <SummaryCards summary={summary} />
      </section>

      {/* Charts */}
      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <ExpensesPieChart data={expensesByCategory(filtered)} />
        <DailyFlowChart data={dailyFlow(filtered)} />
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Transações</h2>
          <span className="text-xs text-slate-500">
            {filtered.length} item(ns)
          </span>
        </div>

        <div className="mt-4">
          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-10 text-center">
              <p className="text-lg font-semibold">Nenhuma transação encontrada</p>
              <p className="mt-2 text-sm text-slate-600">
                Cadastre entradas e despesas para visualizar gráficos e relatórios.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <li key={t.id} className="py-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_160px_auto] sm:items-center">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {t.description || "Sem descrição"}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span
                          className={[
                            "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                            t.type === "expense"
                              ? "border-rose-200 bg-rose-50 text-rose-700"
                              : "border-blue-200 bg-blue-50 text-blue-700",
                          ].join(" ")}
                        >
                          {t.type === "expense" ? "Despesa" : "Entrada"}
                        </span>
                        <span>{formatDateISO(t.date)}</span>
                        <span>• {getCategoryName(t.categoryId)}</span>
                      </div>
                    </div>

                    <div className="min-w-[160px] text-left sm:text-right">
                      <p
                        className={[
                          "text-base font-semibold",
                          t.type === "expense"
                            ? "text-rose-600"
                            : "text-blue-600",
                        ].join(" ")}
                      >
                        {t.type === "expense" ? "-" : "+"} {formatBRL(t.amount)}
                      </p>
                      <p className="text-xs text-slate-400">
                        Atualizado:{" "}
                        {new Date(t.updatedAt).toLocaleString("pt-BR")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:justify-end">
                      <button
                        type="button"
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        onClick={() => setEditTx(t)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-rose-200 bg-white px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                        onClick={() => setDeleteTx(t)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Create */}
      <Modal
        title="Nova transação"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      >
        <TransactionForm
          onCancel={() => setCreateOpen(false)}
          onSubmit={handleCreate}
        />
      </Modal>

      {/* Edit */}
      <Modal
        title="Editar transação"
        open={!!editTx}
        onClose={() => setEditTx(null)}
      >
        {editTx ? (
          <TransactionForm
            onCancel={() => setEditTx(null)}
            onSubmit={handleEdit}
            initialValues={{
              type: editTx.type,
              amount: editTx.amount,
              date: editTx.date,
              categoryId: editTx.categoryId,
              description: editTx.description ?? "",
            }}
          />
        ) : null}
      </Modal>

      {/* Delete confirm */}
      <Modal
        title="Remover transação"
        open={!!deleteTx}
        onClose={() => setDeleteTx(null)}
      >
        {deleteTx ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">
              Você tem certeza que deseja remover esta transação?
            </div>

            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-sm text-slate-500">
                {formatDateISO(deleteTx.date)}
              </p>
              <p className="mt-1 font-medium">
                {deleteTx.description || "Sem descrição"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {getCategoryName(deleteTx.categoryId)} •{" "}
                {deleteTx.type === "expense" ? "Despesa" : "Entrada"}
              </p>
              <p className="mt-1 font-semibold">
                {deleteTx.type === "expense" ? "-" : "+"}{" "}
                {formatBRL(deleteTx.amount)}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                onClick={() => setDeleteTx(null)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500"
                onClick={handleConfirmDelete}
              >
                Remover
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Reset demo data */}
      <Modal
        title="Resetar dados (demo)"
        open={resetOpen}
        onClose={() => setResetOpen(false)}
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
            Isso vai apagar as transações salvas no navegador e recarregar dados de exemplo.
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              onClick={() => setResetOpen(false)}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
              onClick={handleConfirmReset}
            >
              Resetar dados
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


