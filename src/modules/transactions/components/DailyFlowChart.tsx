// [MONEYIO-CHART-LINE-001]
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDateISO(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("pt-BR");
}

export function DailyFlowChart({ data }: { data: any[] }) {
  if (data.length === 0) return null;

  const chartData = data.map((item) => ({
    ...item,
    balance: Number(item.income ?? 0) - Number(item.expense ?? 0),
  }));
  const labelMap: Record<string, string> = {
    income: "Entrada",
    expense: "Saída",
    balance: "Saldo diário",
  };

  return (
    <div className="flex h-[430px] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-700">
          Entradas x Saídas (por dia)
        </h3>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Entradas
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Saídas
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-400" />
            Saldo diário
          </span>
        </div>
      </div>

      <div className="mt-3 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => formatDateISO(String(value))}
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickMargin={8}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) => formatBRL(Number(value))}
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickMargin={8}
              axisLine={false}
              tickLine={false}
              width={86}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) return null;
                const ordered = ["income", "expense", "balance"]
                  .map((key) => payload.find((entry) => String(entry.dataKey) === key))
                  .filter(Boolean);
                return (
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm">
                    <p className="font-semibold">{formatDateISO(String(label))}</p>
                    <div className="mt-1 space-y-1">
                      {ordered.map((entry) => (
                        <div key={entry.dataKey} className="flex items-center justify-between gap-3">
                          <span className="text-slate-500">
                            {labelMap[String(entry.dataKey)] ?? String(entry.dataKey)}
                          </span>
                          <span className="font-semibold text-slate-700">
                            {formatBRL(Number(entry.value))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            />
            <Line type="monotone" dataKey="income" stroke="#2563eb" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="balance" stroke="#64748b" strokeWidth={1.1} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
