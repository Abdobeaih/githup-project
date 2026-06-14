import { ENTITY_STATUS } from './common'

// ── Company Categories ──────────────────────────────────────
export const COMPANY_CATEGORIES = {
  MEDICAL: 'medical',
  GYM: 'gym',
  FOOD: 'food',
  FUN: 'fun',
}

export const COMPANY_CATEGORY_LABELS = {
  medical: 'طبي',
  gym: 'رياضة',
  food: 'مطاعم',
  fun: 'ترفيه',
}

export const COMPANY_CATEGORY_COLORS = {
  medical: 'bg-blue-100 text-blue-600',
  gym: 'bg-orange-100 text-orange-600',
  food: 'bg-red-100 text-red-600',
  fun: 'bg-purple-100 text-purple-600',
}

// ── Company Statuses ────────────────────────────────────────
export const COMPANY_STATUS = {
  APPROVED: ENTITY_STATUS.APPROVED,
  PENDING: ENTITY_STATUS.PENDING,
  REJECTED: ENTITY_STATUS.REJECTED,
  SUSPENDED: ENTITY_STATUS.SUSPENDED,
}

export const COMPANY_SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  MOST_DISCOUNTS: 'most_discounts',
  MOST_VIEWS: 'most_views',
}
