// ── Discount Types ──────────────────────────────────────────
export const DISCOUNT_TYPES = {
  PROMO_CODE: 'PROMO_CODE',
  EXTERNAL_LINK: 'EXTERNAL_LINK',
  INSURANCE_FORM: 'INSURANCE_FORM',
  BANK_FORM: 'BANK_FORM',
}

export const DISCOUNT_TYPE_LABELS = {
  PROMO_CODE: 'كود خصم',
  EXTERNAL_LINK: 'رابط خارجي',
  INSURANCE_FORM: 'نموذج تأمين',
  BANK_FORM: 'نموذج بنكي',
}

export const DISCOUNT_TYPE_ICONS = {
  PROMO_CODE: 'tag',
  EXTERNAL_LINK: 'external-link',
  INSURANCE_FORM: 'shield',
  BANK_FORM: 'banknote',
}

// ── Discount Categories ─────────────────────────────────────
export const DISCOUNT_CATEGORIES = {
  MEDICAL: 'medical',
  GYM: 'gym',
  FOOD: 'food',
  FUN: 'fun',
}

export const DISCOUNT_CATEGORY_LABELS = {
  medical: 'طبي',
  gym: 'رياضة',
  food: 'مطاعم',
  fun: 'ترفيه',
}

export const CATEGORY_LABELS = DISCOUNT_CATEGORY_LABELS

export const CATEGORY_COLORS = {
  medical: 'bg-blue-100 text-blue-600',
  gym: 'bg-orange-100 text-orange-600',
  food: 'bg-red-100 text-red-600',
  fun: 'bg-purple-100 text-purple-600',
}

// ── Tier Levels ─────────────────────────────────────────────
export const TIER_LEVEL = { free: 1, premium: 2, elite: 3 }

export const TIER_LABELS = {
  free: 'مجاني',
  premium: 'مميز',
  elite: 'النخبة',
}

export const TIER_COLORS = {
  free: 'bg-gray-100 text-gray-600',
  premium: 'bg-gold/10 text-gold',
  elite: 'bg-purple-100 text-purple-600',
}
