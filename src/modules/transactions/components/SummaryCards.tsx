// [MONEYIO-DASH-002]
type Summary = {
  income: number;
  expense: number;
  balance: number;
};

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function SummaryCards({ summary }: { summary: Summary }) {
  const balanceClass =
    summary.balance >= 0 ? "text-blue-600" : "text-rose-600";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Entradas</p>
        <p className="mt-1 text-2xl font-semibold text-blue-600">
          {formatBRL(summary.income)}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Saídas</p>
        <p className="mt-1 text-2xl font-semibold text-rose-600">
          {formatBRL(summary.expense)}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Saldo</p>
        <p className={`mt-1 text-2xl font-semibold ${balanceClass}`}>
          {formatBRL(summary.balance)}
        </p>
      </div>
    </div>
  );
}
