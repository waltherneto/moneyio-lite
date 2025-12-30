// [MONEYIO-CAT-UTILS-001]
import { CATEGORIES_SEED } from "./categories.seed";

const map = new Map(CATEGORIES_SEED.map((c) => [c.id, c.name]));

export function getCategoryName(categoryId: string): string {
  return map.get(categoryId) ?? categoryId;
}
