// ── Subscription Statuses ───────────────────────────────────
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  PENDING: 'PENDING',
}

export const SUBSCRIPTION_STATUS_LABELS = {
  ACTIVE: 'نشط',
  CANCELLED: 'ملغي',
  EXPIRED: 'منتهي',
  PENDING: 'قيد الانتظار',
}

export const SUBSCRIPTION_STATUS_COLORS = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-600',
  EXPIRED: 'bg-gray-100 text-gray-600',
  PENDING: 'bg-amber-100 text-amber-600',
}

// ── Plan IDs ────────────────────────────────────────────────
export const PLAN_IDS = {
  FREE: 'free',
  PREMIUM: 'premium',
  ELITE: 'elite',
}

export const PLAN_LABELS = {
  free: 'مجاني',
  premium: 'مميز',
  elite: 'النخبة',
}

export const PLAN_PRICES = {
  free: 0,
  premium: 99,
  elite: 199,
}

export const PLAN_DURATION_MONTHS = {
  free: 0,
  premium: 1,
  elite: 1,
}
