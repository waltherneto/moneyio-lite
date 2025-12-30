// [MONEYIO-CAT-001]
export type Category = {
  id: string;
  name: string;
};

export const CATEGORIES_SEED: Category[] = [
  { id: "cat_market", name: "Mercado" },
  { id: "cat_transport", name: "Transporte" },
  { id: "cat_food", name: "Alimentação" },
  { id: "cat_health", name: "Saúde" },
  { id: "cat_leisure", name: "Lazer" },
  { id: "cat_education", name: "Educação" },
  { id: "cat_bills", name: "Contas" },
  { id: "cat_loan", name: "Empréstimo" },
  { id: "cat_salary", name: "Salário" },
  { id: "cat_freelancing", name: "Freela" },
  { id: "cat_contract", name: "Contrato" },
  { id: "cat_other", name: "Outros" },
];
