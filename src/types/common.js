// ── Shared Entity Statuses ──────────────────────────────────
export const ENTITY_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
  PROCESSING: 'PROCESSING',
  SUSPENDED: 'SUSPENDED',
  ARCHIVED: 'ARCHIVED',
}

export const ENTITY_STATUS_LABELS = {
  ACTIVE: 'نشط',
  INACTIVE: 'غير نشط',
  PENDING: 'قيد الانتظار',
  APPROVED: 'مقبول',
  REJECTED: 'مرفوض',
  EXPIRED: 'منتهي',
  CANCELLED: 'ملغي',
  PROCESSING: 'قيد المعالجة',
  SUSPENDED: 'موقوف',
  ARCHIVED: 'مؤرشف',
}

// ── Status Badge Color Map ──────────────────────────────────
export const STATUS_COLORS = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  INACTIVE: 'bg-gray-100 text-gray-600',
  PENDING: 'bg-amber-100 text-amber-600',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-600',
  EXPIRED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-600',
  PROCESSING: 'bg-blue-100 text-blue-600',
  SUSPENDED: 'bg-orange-100 text-orange-600',
  ARCHIVED: 'bg-purple-100 text-purple-600',
}

// ── Sort Options ────────────────────────────────────────────
export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  POPULAR: 'popular',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
}

export const SORT_LABELS = {
  newest: 'الأحدث',
  oldest: 'الأقدم',
  name_asc: 'الاسم (أ-ي)',
  name_desc: 'الاسم (ي-أ)',
  popular: 'الأكثر شهرة',
  price_asc: 'السعر (الأقل)',
  price_desc: 'السعر (الأعلى)',
}

// ── Default Pagination ──────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

// ── Generic entity types ────────────────────────────────────
export const ENTITY_TYPES = {
  DISCOUNT: 'discount',
  COMPANY: 'company',
  BRANCH: 'branch',
  REVIEW: 'review',
  SUBSCRIPTION: 'subscription',
  NOTIFICATION: 'notification',
  USER: 'user',
}

// ── Empty State Presets ─────────────────────────────────────
export const EMPTY_STATES = {
  NO_RESULTS: 'no_results',

  NO_NOTIFICATIONS: 'no_notifications',
  NO_DISCOUNTS: 'no_discounts',
  NO_REVIEWS: 'no_reviews',
  NO_BRANCHES: 'no_branches',
  NO_SUBSCRIPTIONS: 'no_subscriptions',
  NO_COMPANIES: 'no_companies',
}
