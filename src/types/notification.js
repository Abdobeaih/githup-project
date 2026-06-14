// ── Notification Types ──────────────────────────────────────
export const NOTIFICATION_TYPES = {
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  ALERT: 'ALERT',
}

export const NOTIFICATION_TYPE_LABELS = {
  INFO: 'معلومات',
  SUCCESS: 'نجاح',
  WARNING: 'تنبيه',
  ALERT: 'إنذار',
}

// ── Notification Filter Presets ─────────────────────────────
export const NOTIFICATION_TYPE_FILTERS = ['ALL', 'INFO', 'SUCCESS', 'WARNING', 'ALERT']

export const NOTIFICATION_READ_FILTERS = [
  { value: 'ALL', label: 'الكل' },
  { value: 'UNREAD', label: 'غير مقروء' },
  { value: 'READ', label: 'مقروء' },
]

// ── Grouping ────────────────────────────────────────────────
export const NOTIFICATION_GROUP_LABELS = {
  today: 'اليوم',
  yesterday: 'أمس',
  thisWeek: 'هذا الأسبوع',
  older: 'أقدم',
}
