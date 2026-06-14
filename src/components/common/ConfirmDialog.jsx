import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function ConfirmDialog({
  open = false,
  onClose,
  onConfirm,
  title = 'تأكيد',
  message = 'هل أنت متأكد من هذه العملية؟',
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  variant = 'danger',
  loading = false,
}) {
  const { lang } = useLanguage()

  const confirmColors =
    variant === 'danger'
      ? 'bg-red-500 hover:bg-red-600 text-white'
      : 'bg-gold hover:bg-gold/90 text-dark'

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gold/10 z-10"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 text-dark/30 hover:text-dark/60 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-red-500" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-dark text-center mb-2">{title}</h3>

            {/* Message */}
            <p className="text-dark/60 text-center text-sm leading-relaxed mb-8">{message}</p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 bg-cream border border-gold/20 text-dark py-3 rounded-xl font-bold text-sm hover:bg-gold/10 transition-all disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${confirmColors}`}
              >
                {loading ? 'جاري...' : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
