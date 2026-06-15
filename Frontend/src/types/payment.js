// ── Payment Statuses ────────────────────────────────────────
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  SUCCESS: 'SUCCESS',     // API returns SUCCESS synonym
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  CANCELLED: 'CANCELLED',
}

export const PAYMENT_STATUS_LABELS = {
  PENDING: 'قيد الانتظار',
  PROCESSING: 'قيد المعالجة',
  COMPLETED: 'مكتمل',
  SUCCESS: 'مكتمل',
  FAILED: 'فشل',
  REFUNDED: 'مسترجع',
  CANCELLED: 'ملغي',
}

export const PAYMENT_STATUS_COLORS = {
  PENDING: 'bg-amber-100 text-amber-600',
  PROCESSING: 'bg-blue-100 text-blue-600',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  SUCCESS: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-red-100 text-red-600',
  REFUNDED: 'bg-purple-100 text-purple-600',
  CANCELLED: 'bg-gray-100 text-gray-600',
}

// ── Payment Methods ─────────────────────────────────────────
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  WALLET: 'wallet',
}

export const PAYMENT_METHOD_LABELS = {
  cash: 'نقدي',
  card: 'بطاقة',
  bank_transfer: 'تحويل بنكي',
  wallet: 'محفظة',
}
