import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, FileText, Calendar, Phone, Check, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import Modal from './Modal'

export default function ConfirmSubscriptionModal({
  open,
  onClose,
  companyName = '',
  enrollment,
  onSubmit,
  size = 'md',
}) {
  const { t, lang } = useLanguage()

  const [form, setForm] = useState({
    fullName: '',
    dateOfBirth: '',
    phone: '',
    agreeDataUse: false,
    agreeTerms: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Validation: all required fields filled + both checkboxes checked
  const isValid =
    form.fullName.trim() !== '' &&
    form.dateOfBirth !== '' &&
    form.phone.trim().length === 11 &&
    form.agreeDataUse &&
    form.agreeTerms

  // Reset form when modal closes
  const handleClose = () => {
    if (isSubmitting) return
    setForm({
      fullName: '',
      dateOfBirth: '',
      phone: '',
      agreeDataUse: false,
      agreeTerms: false,
    })
    setIsSuccess(false)
    onClose?.()
  }

  const handleCheckboxChange = (field) => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) return

    setIsSubmitting(true)
    try {
      const result = onSubmit?.({
        fullName: form.fullName.trim(),
        dateOfBirth: form.dateOfBirth,
        phone: form.phone.trim(),
        agreeDataUse: form.agreeDataUse,
        agreeTerms: form.agreeTerms,
        enrollment,
      })
      if (result instanceof Promise) await result
      setIsSuccess(true)
      // Auto-close after success animation
      setTimeout(() => {
        handleClose()
      }, 1200)
    } catch (err) {
      console.error('Submit failed:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const title = isSuccess
    ? t('common', 'enrollmentConfirmed')
    : t('common', 'subscriptionTitle')

  // Success State
  if (isSuccess) {
    return (
      <Modal open={open} onClose={handleClose} title={title} size={size}>
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4"
          >
            <Check size={40} strokeWidth={2.5} />
          </motion.div>
          <h3 className="text-xl font-bold text-dark mb-2">
            {t('common', 'confirmDiscountReceipt')}
          </h3>
          <p className="text-dark/60 text-sm">
            {lang === 'ar'
              ? 'تم تأكيد اشتراكك بنجاح. سيتم تطبيق الخصم خلال لحظات.'
              : 'Your subscription has been confirmed successfully. The discount will be applied shortly.'}
          </p>
        </div>
      </Modal>
    )
  }

  // Form State
  return (
    <Modal open={open} onClose={handleClose} title={title} size={size}>
      <form onSubmit={handleSubmit} className="space-y-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {/* Company Name - Prominent Header */}
        <div className="p-4 bg-gold/5 rounded-xl border border-gold/10">
          <div className="flex items-center gap-2 text-dark/60 text-sm mb-1">
            <Shield size={14} className="text-gold" />
            {t('common', 'companyName')}
          </div>
          <p className="font-bold text-dark text-xl">{companyName}</p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gold/10" />

        {/* Full Name Input */}
        <div>
          <label className="block text-sm font-bold text-dark mb-1.5 flex items-center gap-2">
            <FileText size={14} className="text-gold" />
            {t('common', 'yourFullName')}
          </label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder={t('common', 'fullNamePlaceholder')}
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-cream/30 text-dark placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
        </div>

        {/* Date of Birth Input */}
        <div>
          <label className="block text-sm font-bold text-dark mb-1.5 flex items-center gap-2">
            <Calendar size={14} className="text-gold" />
            {t('common', 'dateOfBirth')}
          </label>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-cream/30 text-dark focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
        </div>

        {/* Phone Number Input */}
        <div>
          <label className="block text-sm font-bold text-dark mb-1.5 flex items-center gap-2">
            <Phone size={14} className="text-gold" />
            {t('common', 'phoneNumber')}
          </label>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={11}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '') }}
            placeholder={t('common', 'phonePlaceholder')}
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-cream/30 text-dark placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-gold/10" />

        {/* Checkboxes */}
        <div className="space-y-3">
          {/* Data Use Agreement */}
          <label className="flex items-start gap-3 cursor-pointer group select-none">
            <div className="mt-0.5 relative">
              <input
                type="checkbox"
                checked={form.agreeDataUse}
                onChange={() => handleCheckboxChange('agreeDataUse')}
                disabled={isSubmitting}
                className="peer w-4 h-4 rounded border-gold/40 text-gold focus:ring-gold/30 disabled:opacity-50 cursor-pointer"
              />
              <Check
                size={12}
                className="absolute top-0.5 left-0.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
              />
            </div>
            <span className="text-sm text-dark/80 group-hover:text-dark/95 transition-colors">
              {t('common', 'agreeDataUse')}
            </span>
          </label>

          {/* Terms & Conditions */}
          <label className="flex items-start gap-3 cursor-pointer group select-none">
            <div className="mt-0.5 relative">
              <input
                type="checkbox"
                checked={form.agreeTerms}
                onChange={() => handleCheckboxChange('agreeTerms')}
                disabled={isSubmitting}
                className="peer w-4 h-4 rounded border-gold/40 text-gold focus:ring-gold/30 disabled:opacity-50 cursor-pointer"
              />
              <Check
                size={12}
                className="absolute top-0.5 left-0.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
              />
            </div>
            <span className="text-sm text-dark/80 group-hover:text-dark/95 transition-colors">
              {t('common', 'agreeTerms')}
            </span>
          </label>
        </div>

        {/* Divider */}
        <div className="h-px bg-gold/10" />

        {/* Submit Button */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`w-full font-bold text-sm py-3 px-4 rounded-xl transition-all ${
              isValid && !isSubmitting
                ? 'bg-gradient-to-r from-gold to-[#a67c3d] text-white hover:shadow-md active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting
              ? lang === 'ar'
                ? 'جاري التأكيد...'
                : 'Confirming...'
              : t('common', 'confirmDiscountReceipt')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
