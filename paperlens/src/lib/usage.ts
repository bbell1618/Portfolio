const LIMITS = { free: 3, pro: 50 } as const;

interface UsageRecord {
  count: number;
  resetDate: Date;
}

const usage = new Map<string, UsageRecord>();

function getResetDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

function getOrCreate(userId: string): UsageRecord {
  const existing = usage.get(userId);
  const now = new Date();

  if (!existing || now >= existing.resetDate) {
    const record: UsageRecord = { count: 0, resetDate: getResetDate() };
    usage.set(userId, record);
    return record;
  }

  return existing;
}

export function canAnalyze(
  userId: string,
  tier: "free" | "pro" = "free"
): boolean {
  const record = getOrCreate(userId);
  return record.count < LIMITS[tier];
}

export function recordUsage(userId: string): void {
  const record = getOrCreate(userId);
  record.count++;
}

export function getUsage(
  userId: string,
  tier: "free" | "pro" = "free"
): { used: number; limit: number; resetsAt: Date } {
  const record = getOrCreate(userId);
  return {
    used: record.count,
    limit: LIMITS[tier],
    resetsAt: record.resetDate,
  };
}
