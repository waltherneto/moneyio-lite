// [MONEYIO-STORAGE-001]
type StorageEnvelope<T> = {
  version: number;
  savedAt: string;
  data: T;
};

export function readStorage<T>(
  key: string,
  expectedVersion: number
): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StorageEnvelope<T>;

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof parsed.version !== "number"
    ) {
      return null;
    }

    // If versions mismatch, ignore (later we can implement migration)
    if (parsed.version !== expectedVersion) return null;

    return parsed.data ?? null;
  } catch {
    return null;
  }
}

export function writeStorage<T>(
  key: string,
  version: number,
  data: T
): void {
  const envelope: StorageEnvelope<T> = {
    version,
    savedAt: new Date().toISOString(),
    data,
  };

  localStorage.setItem(key, JSON.stringify(envelope));
}
