import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info' | 'success'
  loading?: boolean
}

const iconMap = {
  danger: { Icon: AlertCircle, color: 'bg-red-100 text-red-600' },
  warning: { Icon: AlertTriangle, color: 'bg-amber-100 text-amber-600' },
  info: { Icon: Info, color: 'bg-blue-100 text-blue-600' },
  success: { Icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
}

const buttonMap = {
  danger: 'bg-red-500 hover:bg-red-600',
  warning: 'bg-amber-500 hover:bg-amber-600',
  info: 'bg-dark hover:bg-darkLight',
  success: 'bg-emerald-500 hover:bg-emerald-600',
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  const { Icon, color } = iconMap[variant]

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gold/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onCancel} className="absolute top-4 right-4 text-dark/40 hover:text-dark">
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${color}`}>
            <Icon size={32} />
          </div>
          <h3 className="text-lg font-bold text-dark mb-2">{title}</h3>
          <p className="text-dark/60 text-sm mb-6">{message}</p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gold/20 text-dark font-bold text-sm hover:bg-gold/5 transition-all disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2.5 rounded-xl text-white font-bold text-sm transition-all ${buttonMap[variant]} disabled:opacity-50`}
            >
              {loading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
