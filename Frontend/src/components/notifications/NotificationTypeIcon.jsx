import { Bell, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react'
import { NOTIFICATION_TYPE_LABELS } from '../../types/notification'

const TYPE_CONFIG = {
  INFO:    { icon: Bell,          color: 'text-blue-400', bg: 'bg-blue-500/15' },
  SUCCESS: { icon: CheckCircle,   color: 'text-green-400', bg: 'bg-green-500/15' },
  WARNING: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/15' },
  ALERT:   { icon: AlertCircle,   color: 'text-red-400', bg: 'bg-red-500/15' },
}

export default function NotificationTypeIcon({ type = 'INFO', size = 18 }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.INFO
  const Icon = cfg.icon
  return (
    <div className={`p-1.5 rounded-full ${cfg.bg} ${cfg.color}`}>
      <Icon size={size} />
    </div>
  )
}

export function getTypeLabel(type) {
  return NOTIFICATION_TYPE_LABELS[type] || type
}
