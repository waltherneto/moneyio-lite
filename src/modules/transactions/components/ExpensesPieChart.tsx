// [MONEYIO-CHART-PIE-001]
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#a855f7", "#f43f5e"];

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0];

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <p className="text-xs font-medium text-slate-600">{item.name}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">
        {item.value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </p>
    </div>
  );
}

export function ExpensesPieChart({ data }: { data: any[] }) {
  if (data.length === 0) return null;

  const sorted = [...data].sort((a, b) => Number(b.value) - Number(a.value));
  const topFive = sorted.slice(0, 5);
  const remainder = sorted
    .slice(5)
    .reduce((sum, item) => sum + Number(item.value), 0);
  const topCategories =
    sorted.length > 5
      ? [...topFive, { name: "Outros", value: remainder }]
      : topFive;
  const total = sorted.reduce((sum, item) => sum + Number(item.value), 0);
  const formatPercent = (value: number) =>
    total > 0 ? `${Math.round((value / total) * 100)}%` : "0%";

  return (
    <div className="h-[440px] rounded-2xl bg-white border border-slate-200 p-4 flex flex-col">
      <h3 className="text-sm font-semibold text-slate-700 mb-2">
        Despesas por categoria
      </h3>

      <div className="mt-3 grid flex-1 grid-cols-1 gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-start">
        <div className="flex-1 flex items-center justify-center">
          <div className="h-[220px] w-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

       <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Top categorias
          </p>
          <div className="mt-2 divide-y divide-slate-100 text-slate-600">
            {topCategories.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between gap-2 py-2">
                <span className="flex min-w-0 items-center gap-2 truncate">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor:
                        item.name === "Outros"
                          ? "#cbd5e1"
                          : COLORS[index % COLORS.length],
                    }}
                  />
                  <span className="truncate text-xs">{item.name}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-sm font-semibold">
                    {formatBRL(Number(item.value))}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {formatPercent(Number(item.value))}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
