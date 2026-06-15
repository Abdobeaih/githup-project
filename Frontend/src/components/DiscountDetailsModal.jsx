import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Tag,
  FileText,
  Calendar,
  DollarSign,
  Percent,
  ShoppingBag,
  Building2,
  Hash,
  Clock,
  Shield,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  TrendingDown,
  Sparkles,
  CreditCard,
  QrCode,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useEffect, useMemo } from 'react'

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modal = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } },
}

export default function DiscountDetailsModal({ open, onClose, discount, scan, title }) {
  const { t, td, lang } = useLanguage()

  // Escape key handler
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  // Determine values from scan (most detailed) or discount fallback
  const discountName = scan?.product || discount?.name || t('userScans', 'discount')
  const companyName = scan?.discount?.company_name || discount?.company_name || ''
  const discountPercent = scan?.discount_percent || discount?.discount_percent || ''
  const originalPrice = scan?.original_price
  const discountValue = scan?.discount_value
  const finalPrice = scan?.final_price
  const invoiceNumber = scan?.invoice_id || ''
  const registrationNumber = scan?.invoice_id || '' // Registration Number = Invoice Number
  const dateUsed = scan?.scanned_at || null
  const category = scan?.discount?.category || discount?.category || ''
  const promoCode = scan?.promo_code || ''
  const amountPaid = scan?.amount_paid
  const invoiceLast4 = scan?.invoice_last4 || ''

  // Insights calculation
  const insights = useMemo(() => {
    const items = []

    if (discountValue && discountValue > 0) {
      items.push({
        icon: TrendingDown,
        title: t('discountDetails', 'insightSaved') || 'Great Savings!',
        text: `${t('discountDetails', 'youSaved') || 'You saved'} ${discountValue} ${t('pricing', 'egp')} ${t('discountDetails', 'onThisPurchase') || 'on this purchase'}`,
        type: 'success',
      })
    }

    if (discountPercent) {
      items.push({
        icon: Sparkles,
        title: t('discountDetails', 'discountApplied') || 'Discount Applied',
        text: `${t('discountDetails', 'thisWasA') || 'This was a'} ${discountPercent} ${t('discountDetails', 'discount') || 'discount'} ${t('discountDetails', 'from') || 'from'} ${companyName || t('discountDetails', 'ourPartner') || 'our partner'}`,
        type: 'info',
      })
    }

    if (promoCode) {
      items.push({
        icon: QrCode,
        title: t('discountDetails', 'promoCodeUsed') || 'Promo Code Used',
        text: `${t('discountDetails', 'codeWas') || 'Code was'} "${promoCode}" ${t('discountDetails', 'generatedForThis') || 'generated for this transaction'}`,
        type: 'info',
      })
    }

    if (invoiceLast4) {
      items.push({
        icon: CreditCard,
        title: t('discountDetails', 'invoiceReference') || 'Invoice Reference',
        text: `${t('discountDetails', 'last4Digits') || 'Last 4 digits'}: ${invoiceLast4}`,
        type: 'info',
      })
    }

    if (finalPrice !== undefined && originalPrice !== undefined && finalPrice < originalPrice) {
      const percentSaved = Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
      items.push({
        icon: Lightbulb,
        title: t('discountDetails', 'smartChoice') || 'Smart Choice!',
        text: `${t('discountDetails', 'youPaidOnly') || 'You paid only'} ${finalPrice} ${t('pricing', 'egp')} ${t('discountDetails', 'insteadOf') || 'instead of'} ${originalPrice} ${t('pricing', 'egp')} (${percentSaved}% ${t('discountDetails', 'less') || 'less'})`,
        type: 'success',
      })
    }

    return items
  }, [discountValue, discountPercent, promoCode, invoiceLast4, finalPrice, originalPrice, companyName, t, lang])

  const categoryLabels = {
    medical: t('adminDiscounts', 'medical'),
    gym: t('adminDiscounts', 'sports'),
    food: t('adminDiscounts', 'restaurants'),
    fun: t('adminDiscounts', 'entertainment'),
  }

  const typeColors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
  }

  const typeIconColors = {
    success: 'text-emerald-500',
    info: 'text-blue-500',
    warning: 'text-amber-500',
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="discount-modal-backdrop"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <motion.div
            key="discount-modal-card"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl border border-gold/10 w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gold/10 bg-gradient-to-r from-gold/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                  <Tag size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-dark">
                    {title || t('discountDetails', 'title') || 'Discount Details'}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <CheckCircle size={12} className="text-emerald-500" />
                    <span className="text-xs text-emerald-600 font-medium">
                      {t('discountDetails', 'readOnly') || 'Read-only'}
                    </span>
                    {category && categoryLabels[category] && (
                      <>
                        <span className="text-dark/30">|</span>
                        <span className="text-xs text-dark/50">{categoryLabels[category]}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-cream text-dark/40 hover:text-dark transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* ===== MAIN INFO SECTION ===== */}
              <div className="p-4 bg-gradient-to-br from-gold/5 to-transparent rounded-xl border border-gold/10">
                {/* Discount Name (prominent) */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-dark/60 text-xs mb-1">
                    <ShoppingBag size={12} className="text-gold" />
                    {t('discountDetails', 'discountName') || 'Discount Name'}
                  </div>
                  <p className="font-bold text-dark text-xl">{discountName}</p>
                </div>

                {/* Vendor/Company Name */}
                {companyName && (
                  <div className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-gold/5">
                    <Building2 size={14} className="text-gold/70" />
                    <span className="text-sm text-dark/70">
                      {t('discountDetails', 'vendor') || 'Vendor'}:{' '}
                      <span className="font-semibold text-dark">{companyName}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* ===== KEY DETAILS GRID ===== */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={14} className="text-gold" />
                  <h3 className="text-sm font-bold text-dark">
                    {t('discountDetails', 'transactionDetails') || 'Transaction Details'}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Discount Amount */}
                  {discountValue !== undefined && (
                    <div className="p-3.5 bg-red-50 rounded-xl border border-red-100">
                      <div className="flex items-center gap-1.5 text-xs text-dark/50 mb-1">
                        <TrendingDown size={12} className="text-red-500" />
                        {t('discountDetails', 'discountAmount') || 'Discount Amount'}
                      </div>
                      <p className="font-bold text-red-600 text-lg">
                        -{discountValue} {t('pricing', 'egp')}
                      </p>
                    </div>
                  )}

                  {/* Discount Percent */}
                  {discountPercent && (
                    <div className="p-3.5 bg-gold/5 rounded-xl border border-gold/10">
                      <div className="flex items-center gap-1.5 text-xs text-dark/50 mb-1">
                        <Percent size={12} className="text-gold" />
                        {t('discountDetails', 'discountPercent') || 'Discount'}
                      </div>
                      <p className="font-bold text-gold text-lg">{discountPercent}</p>
                    </div>
                  )}

                  {/* Registration Number */}
                  {registrationNumber && (
                    <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-100">
                      <div className="flex items-center gap-1.5 text-xs text-dark/50 mb-1">
                        <Hash size={12} className="text-purple-500" />
                        {t('discountDetails', 'registrationNumber') || 'Registration Number'}
                      </div>
                      <p className="font-mono font-bold text-purple-700 text-sm">{registrationNumber}</p>
                    </div>
                  )}

                  {/* Date Used */}
                  {dateUsed && (
                    <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-1.5 text-xs text-dark/50 mb-1">
                        <Calendar size={12} className="text-blue-500" />
                        {t('discountDetails', 'dateUsed') || 'Date Used'}
                      </div>
                      <p className="font-bold text-blue-700 text-sm">
                        {new Date(dateUsed).toLocaleDateString(
                          lang === 'ar' ? 'ar-EG' : 'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                      </p>
                    </div>
                  )}

                  {/* Promo Code */}
                  {promoCode && (
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="flex items-center gap-1.5 text-xs text-dark/50 mb-1">
                        <QrCode size={12} className="text-emerald-500" />
                        {t('discountDetails', 'promoCode') || 'Promo Code'}
                      </div>
                      <p className="font-mono font-bold text-emerald-700 text-sm" dir="ltr">
                        {promoCode}
                      </p>
                    </div>
                  )}

                  {/* Invoice Last 4 */}
                  {invoiceLast4 && (
                    <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-1.5 text-xs text-dark/50 mb-1">
                        <CreditCard size={12} className="text-gray-500" />
                        {t('discountDetails', 'invoiceLast4') || 'Invoice Last 4'}
                      </div>
                      <p className="font-mono font-bold text-gray-700 text-sm" dir="ltr">
                        ••••{invoiceLast4}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ===== PRICING BREAKDOWN ===== */}
              {(originalPrice !== undefined || finalPrice !== undefined || amountPaid !== undefined) && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign size={14} className="text-gold" />
                    <h3 className="text-sm font-bold text-dark">
                      {t('discountDetails', 'pricingBreakdown') || 'Pricing Breakdown'}
                    </h3>
                  </div>

                  <div className="bg-cream/30 rounded-xl p-4 border border-gold/10 space-y-3">
                    {/* Original Price */}
                    {originalPrice !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-dark/60">
                          {t('discountDetails', 'originalPrice') || 'Original Price'}
                        </span>
                        <span className="text-sm font-bold text-dark/40 line-through">
                          {originalPrice} {t('pricing', 'egp')}
                        </span>
                      </div>
                    )}

                    {/* Discount Value */}
                    {discountValue !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-dark/60">
                          {t('discountDetails', 'discountValue') || 'Discount Applied'}
                        </span>
                        <span className="text-sm font-bold text-red-500">
                          -{discountValue} {t('pricing', 'egp')}
                        </span>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="h-px bg-gold/20" />

                    {/* Final Price */}
                    {finalPrice !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-dark">
                          {t('discountDetails', 'finalPrice') || 'Final Price'}
                        </span>
                        <span className="text-lg font-extrabold text-emerald-600">
                          {finalPrice} {t('pricing', 'egp')}
                        </span>
                      </div>
                    )}

                    {/* Amount Paid */}
                    {amountPaid !== undefined && amountPaid !== finalPrice && (
                      <div className="flex items-center justify-between pt-2 border-t border-gold/10">
                        <span className="text-sm text-dark/60">
                          {t('discountDetails', 'amountPaid') || 'Amount Paid'}
                        </span>
                        <span className="text-sm font-bold text-dark">
                          {amountPaid} {t('pricing', 'egp')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ===== INSIGHTS SECTION ===== */}
              {insights.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={14} className="text-gold" />
                    <h3 className="text-sm font-bold text-dark">
                      {t('discountDetails', 'insights') || 'Insights & Info'}
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {insights.map((insight, i) => {
                      const Icon = insight.icon
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: lang === 'ar' ? 10 : -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`p-3 rounded-xl border ${typeColors[insight.type] || typeColors.info}`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={`mt-0.5 flex-shrink-0 ${typeIconColors[insight.type] || typeIconColors.info}`}>
                              <Icon size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{insight.title}</p>
                              <p className="text-sm opacity-80 mt-0.5">{insight.text}</p>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ===== READ-ONLY NOTICE ===== */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Shield size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {t('discountDetails', 'readOnlyNotice') ||
                      'This is a read-only record. Discount details cannot be modified after application.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gold/10 bg-cream/20">
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-gold to-[#a67c3d] text-white font-bold text-sm py-3 px-4 rounded-xl hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} />
                {t('common', 'close') || 'Close'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
