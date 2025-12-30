// [MONEYIO-ID-001]
export function createId(prefix = "id"): string {
  // Simple, fast, good enough for local app. (Later you can swap for uuid.)
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}
