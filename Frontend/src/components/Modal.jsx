import { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modal = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } },
}

export default function Modal({ open, onClose, title, children, size = 'lg' }) {
  const { lang } = useLanguage()
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const titleId = (title || '').replace(/\s+/g, '-').toLowerCase()

  // Keep ref in sync with latest onClose without triggering effect re-runs
  useEffect(() => { onCloseRef.current = onClose })

  const getFocusableElements = useCallback(() => {
    if (!dialogRef.current) return []
    return dialogRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  }, [])

  const trapFocus = useCallback((e) => {
    const elements = getFocusableElements()
    if (elements.length === 0) return
    const first = elements[0]
    const last = elements[elements.length - 1]
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }, [getFocusableElements])

  useEffect(() => {
    if (!open) return
    previousFocusRef.current = document.activeElement
    const handler = (e) => { if (e.key === 'Escape') onCloseRef.current() }
    window.addEventListener('keydown', handler)
    document.addEventListener('keydown', trapFocus)
    document.body.style.overflow = 'hidden'
    setTimeout(() => {
      const elements = getFocusableElements()
      if (elements.length > 0) elements[0].focus()
    }, 50)
    return () => {
      window.removeEventListener('keydown', handler)
      document.removeEventListener('keydown', trapFocus)
      document.body.style.overflow = ''
      if (previousFocusRef.current) previousFocusRef.current.focus()
    }
  }, [open, trapFocus, getFocusableElements])

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-full mx-4',
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-backdrop"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
        >
          <motion.div
            key="modal-card"
            ref={dialogRef}
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-2xl shadow-2xl border border-gold/10 w-full ${sizes[size]} max-h-[85vh] flex flex-col overflow-hidden`}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gold/10 shrink-0">
              <h2 id={titleId} className="text-lg font-bold text-dark">{title}</h2>
              <button
                onClick={onClose}
                aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
                className="p-2 rounded-xl hover:bg-cream text-dark/40 hover:text-dark transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
