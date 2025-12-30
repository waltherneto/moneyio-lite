// [MONEYIO-FORM-FIX-010]
import { useEffect, useState } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES_SEED } from "../../categories/categories.seed";
import { todayISO } from "../../../shared/lib/dates";
import type { MoneyType } from "../transactions.types";

const formSchema = z.object({
  type: z.enum(["income", "expense"]),

  amount: z.preprocess(
    (v) => {
      if (typeof v === "string") {
        // aceita "1.234,56" e "1234.56"
        const normalized = v.trim().replace(/\./g, "").replace(",", ".");
        const n = Number(normalized);
        return Number.isFinite(n) ? n : v;
      }
      return v;
    },
    z.number().positive("Informe um valor maior que 0")
  ),

  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato YYYY-MM-DD"),

  categoryId: z.string().min(1, "Selecione uma categoria"),
  description: z.string().max(80, "Máximo 80 caracteres").optional(),
});

export type TransactionFormValues = z.infer<typeof formSchema>;

type Props = {
  onSubmit: (values: TransactionFormValues) => void;
  onCancel: () => void;
  defaultType?: MoneyType;
  initialValues?: Partial<TransactionFormValues>;
};

function toAmountDigits(amount: number): string {
  return Math.round(amount * 100).toString();
}

function amountDigitsToNumber(digits: string): number {
  if (!digits) return 0;
  return Number(digits) / 100;
}

function formatAmountDigits(digits: string): string {
  if (!digits) return "";
  const value = Number(digits) / 100;
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function stripNonDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function TransactionForm({ onSubmit, onCancel, defaultType, initialValues }: Props) {
  const initialAmountDigits =
    typeof initialValues?.amount === "number"
      ? toAmountDigits(initialValues.amount)
      : "";
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: initialValues?.type ?? defaultType ?? "expense",
      amount: formatAmountDigits(initialAmountDigits),
      date: initialValues?.date ?? todayISO(),
      categoryId: initialValues?.categoryId ?? "cat_market",
      description: initialValues?.description ?? "",
    },
    mode: "onSubmit",
  });

  const selectedType = watch("type") ?? "expense";
  const [amountDigits, setAmountDigits] = useState(initialAmountDigits);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isSubmitSuccessful) return;
    setShowSuccess(true);
    const timeout = setTimeout(() => setShowSuccess(false), 2500);
    return () => clearTimeout(timeout);
  }, [isSubmitSuccessful]);

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) =>
        onSubmit({
          ...values,
          amount: amountDigitsToNumber(amountDigits),
        } as TransactionFormValues)
      )}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Tipo</label>
          <select
            className={[
              "mt-1 w-full rounded-xl border px-3 py-2",
              selectedType === "income"
                ? "border-blue-300 bg-blue-50 text-blue-900"
                : "border-rose-300 bg-rose-50 text-rose-900",
            ].join(" ")}
            {...register("type")}
          >
            <option value="expense">Despesa</option>
            <option value="income">Entrada</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">
              {String(errors.type.message)}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Valor</label>
          <Controller
            control={control}
            name="amount"
            render={({ field }) => (
              <input
                {...field}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
                value={formatAmountDigits(amountDigits)}
                onChange={(event) => {
                  const digits = stripNonDigits(event.target.value);
                  setAmountDigits(digits);
                  field.onChange(formatAmountDigits(digits));
                }}
                placeholder="0,00"
              />
            )}
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">
              {String(errors.amount.message)}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Data</label>
          <input
            type="date"
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
            {...register("date")}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">
              {String(errors.date.message)}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Categoria</label>
          <select
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
            {...register("categoryId")}
          >
            {CATEGORIES_SEED.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">
              {String(errors.categoryId.message)}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Descrição (opcional)</label>
        <input
          type="text"
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
          {...register("description")}
          placeholder="Ex: Uber para o trabalho"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {String(errors.description.message)}
          </p>
        )}
      </div>

      {showSuccess ? (
        <div
          className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700"
          role="status"
          aria-live="polite"
        >
          Transacao salva com sucesso.
        </div>
      ) : null}

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
