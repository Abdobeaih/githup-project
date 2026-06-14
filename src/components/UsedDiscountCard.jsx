import { motion } from 'framer-motion'
import {
  QrCode,
  Tag,
  Calendar,
  FileText,
  Building2,
  Hash,
  DollarSign,
  TrendingDown,
  ArrowRight,
  Clock,
  CheckCircle,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function UsedDiscountCard({
  scan,
  discount,
  onClick,
  index = 0,
  className = '',
}) {
  const { t, td, lang } = useLanguage()

  // Extract values with fallbacks
  const discountName = scan?.product || discount?.name || t('userScans', 'discount')
  const companyName = scan?.discount?.company_name || discount?.company_name || ''
  const discountPercent = scan?.discount_percent || discount?.discount_percent || ''
  const invoiceNumber = scan?.invoice_id || ''
  const registrationNumber = scan?.invoice_id || ''
  const dateUsed = scan?.scanned_at || null
  const category = scan?.discount?.category || discount?.category || ''
  const promoCode = scan?.promo_code || ''
  const originalPrice = scan?.original_price
  const discountValue = scan?.discount_value
  const finalPrice = scan?.final_price

  const categoryLabels = {
    medical: t('adminDiscounts', 'medical'),
    gym: t('adminDiscounts', 'sports'),
    food: t('adminDiscounts', 'restaurants'),
    fun: t('adminDiscounts', 'entertainment'),
  }

  const categoryColors = {
    medical: 'bg-blue-100 text-blue-600',
    gym: 'bg-orange-100 text-orange-600',
    food: 'bg-red-100 text-red-600',
    fun: 'bg-purple-100 text-purple-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-gold/10 shadow-sm hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer hover:border-gold/30 active:scale-[0.99]' : ''
      } ${className}`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Top Section: Main Info */}
      <div className="flex items-start gap-4 mb-4">
        {/* Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-gold/10 to-gold/5 rounded-xl flex items-center justify-center flex-shrink-0 border border-gold/10">
          <QrCode className="text-gold" size={22} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Row 1: Discount Name + Category */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-bold text-dark text-lg truncate">{discountName}</p>
            </div>
            {/* Status Badge */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <CheckCircle size={14} className="text-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">
                {t('common', 'enrollActive') || 'Applied'}
              </span>
            </div>
          </div>

          {/* Row 2: Company Name */}
          {companyName && (
            <div className="flex items-center gap-1.5 mt-1 text-sm text-dark/60">
              <Building2 size={14} className="text-gold/70 flex-shrink-0" />
              <span className="truncate">{companyName}</span>
            </div>
          )}

          {/* Row 3: Category + Discount % + Promo Code */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {/* Category Badge */}
            {category && categoryLabels[category] && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  categoryColors[category] || 'bg-gray-100 text-gray-600'
                }`}
              >
                {categoryLabels[category]}
              </span>
            )}

            {/* Discount Percent */}
            {discountPercent && (
              <span className="flex items-center gap-1 text-xs font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                <Tag size={12} />
                {discountPercent}
              </span>
            )}

            {/* Promo Code */}
            {promoCode && (
              <span className="flex items-center gap-1 text-xs font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full" dir="ltr">
                <Hash size={12} />
                {promoCode}
              </span>
            )}
          </div>
        </div>

        {/* Chevron (if clickable) */}
        {onClick && (
          <div className="flex-shrink-0 text-gold/50 mt-1">
            <ArrowRight
              size={20}
              className={lang === 'ar' ? 'rotate-180' : ''}
            />
          </div>
        )}
      </div>

      {/* Middle Section: Key Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* Registration Number */}
        {registrationNumber && (
          <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-1 text-xs text-dark/40 mb-0.5">
              <Hash size={10} />
              <span>{t('discountDetails', 'registrationNumber') || 'Reg #'}</span>
            </div>
            <p className="font-mono font-bold text-dark text-sm truncate">
              {registrationNumber}
            </p>
          </div>
        )}

        {/* Date Used */}
        {dateUsed && (
          <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-1 text-xs text-dark/40 mb-0.5">
              <Clock size={10} />
              <span>{t('discountDetails', 'dateUsed') || 'Date'}</span>
            </div>
            <p className="font-bold text-blue-700 text-sm">
              {new Date(dateUsed).toLocaleDateString(
                lang === 'ar' ? 'ar-EG' : 'en-US',
                { year: 'numeric', month: 'short', day: 'numeric' }
              )}
            </p>
          </div>
        )}

        {/* Discount Amount */}
        {discountValue !== undefined && (
          <div className="p-2.5 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center gap-1 text-xs text-dark/40 mb-0.5">
              <TrendingDown size={10} />
              <span>{t('discountDetails', 'discountAmount') || 'Saved'}</span>
            </div>
            <p className="font-bold text-red-600 text-sm">
              -{discountValue} {t('pricing', 'egp')}
            </p>
          </div>
        )}

        {/* Final Price */}
        {finalPrice !== undefined && (
          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
            <div className="flex items-center gap-1 text-xs text-dark/40 mb-0.5">
              <DollarSign size={10} />
              <span>{t('discountDetails', 'finalPrice') || 'Paid'}</span>
            </div>
            <p className="font-bold text-emerald-600 text-sm">
              {finalPrice} {t('pricing', 'egp')}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Section: Pricing Summary Bar */}
      {(finalPrice !== undefined || originalPrice !== undefined) && (
        <div className="pt-3 border-t border-gold/5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              {originalPrice !== undefined && (
                <span className="text-dark/40 line-through">
                  {t('discountDetails', 'originalPrice') || 'Original'}: {originalPrice}{' '}
                  {t('pricing', 'egp')}
                </span>
              )}
              {discountPercent && originalPrice !== undefined && finalPrice !== undefined && (
                <span className="text-dark/30">→</span>
              )}
            </div>

            {onClick && (
              <div className="flex items-center gap-1.5 text-gold text-xs font-medium">
                <span>{t('userScans', 'clickToViewDetails') || 'View Details'}</span>
                <ArrowRight
                  size={12}
                  className={lang === 'ar' ? 'rotate-180' : ''}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
