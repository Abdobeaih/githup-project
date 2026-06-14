import React from 'react'

interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'rounded'
  size?: 'sm' | 'md'
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  cancelled: { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' },
  expired: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  success: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  failed: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  inactive: { bg: 'bg-gray-50', text: 'text-gray-500', dot: 'bg-gray-400' },
  info: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  error: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'default', size = 'sm' }) => {
  const key = status?.toLowerCase() || 'pending'
  const config = statusConfig[key] || { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' }

  const sizeClasses = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'

  if (variant === 'rounded') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-bold ${config.bg} ${config.text} rounded-full ${sizeClasses}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {status}
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center font-bold rounded-lg ${config.bg} ${config.text} ${sizeClasses}`}>
      {status}
    </span>
  )
}
