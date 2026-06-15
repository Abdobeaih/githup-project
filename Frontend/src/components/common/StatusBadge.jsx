import { CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, MinusCircle, Archive } from 'lucide-react'
import { STATUS_COLORS } from '../../types/common'

const statusIconMap = {
  ACTIVE: CheckCircle,
  APPROVED: CheckCircle,
  INACTIVE: MinusCircle,
  PENDING: AlertTriangle,
  REJECTED: XCircle,
  EXPIRED: Clock,
  CANCELLED: XCircle,
  PROCESSING: RefreshCw,
  SUSPENDED: AlertTriangle,
  ARCHIVED: Archive,
}

export default function StatusBadge({ status, size = 'md', className = '', label }) {
  const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'
  const Icon = statusIconMap[status] || AlertTriangle
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold ${colorClass} ${sizeClasses} ${className}`}>
      <Icon size={size === 'sm' ? 12 : 14} />
      {label || status}
    </span>
  )
}
