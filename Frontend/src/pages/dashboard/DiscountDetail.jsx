import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import BackButton from '../../components/BackButton'
import ReviewsSection from '../../components/ReviewsSection'

import DiscountActionRenderer from '../../components/discounts/DiscountActionRenderer'
import useInteractionTracker from '../../hooks/useInteractionTracker'
import { findDiscountById } from '../../data/db'
import { DISCOUNT_TYPE_ICONS, DISCOUNT_TYPE_LABELS, CATEGORY_LABELS as categoryLabels, CATEGORY_COLORS as categoryColors, TIER_LABELS as tierLabels, TIER_COLORS as tierColors } from '../../types/discount'
import { MapPin, Percent, Eye, Info, CheckCircle } from 'lucide-react'

export default function DiscountDetail() {
  const { id } = useParams()
  const { t, td } = useLanguage()
  const { user, company } = useAuth()
  const userId = user?.id || company?.id
  const [discount, setDiscount] = useState(null)

  useEffect(() => {
    const found = findDiscountById(id)
    setDiscount(found)
  }, [id])

  const { trackView } = useInteractionTracker()

  useEffect(() => {
    if (discount) {
      trackView(id)
    }
  }, [discount, id, trackView])

  if (!discount) {
    return (
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          <div className="text-center py-20">
            <Percent className="text-gold/30 mx-auto mb-4" size={64} />
            <p className="text-dark/50">الخصم غير موجود</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <Helmet><title>{td('discounts', discount.name, 'name') || discount.name}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm mb-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-dark">{td('discounts', discount.name, 'name') || discount.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[discount.category] || ''}`}>
                    {categoryLabels[discount.category] || discount.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-dark/50 text-sm">
                  <MapPin size={14} />
                  <span>{td('governorates', discount.city) || discount.city}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">

                <div className={`px-4 py-2 rounded-xl text-center ${tierColors[discount.tier] || ''}`}>
                  <p className="text-xs">{tierLabels[discount.tier] || discount.tier}</p>
                </div>
              </div>
            </div>

            {/* Discount Amount + Type */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-cream rounded-2xl p-6 text-center">
                <Percent size={24} className="text-gold mx-auto mb-2" />
                <p className="text-4xl font-extrabold text-gold">{discount.discount_percent}%</p>
                <p className="text-dark/50 text-sm mt-1">خصم</p>
              </div>
              <div className="bg-cream rounded-2xl p-6 text-center">
                <Info size={24} className="text-gold mx-auto mb-2" />
                <p className="text-lg font-bold text-dark">{DISCOUNT_TYPE_LABELS[discount.discount_type] || discount.discount_type}</p>
                <p className="text-dark/50 text-sm mt-1">نوع الخصم</p>
              </div>
            </div>

            {/* Description */}
            {discount.description && (
              <div className="mb-8">
                <h3 className="font-bold text-dark mb-2">الوصف</h3>
                <p className="text-dark/60">{td('discounts', discount.name, 'description') || discount.description}</p>
              </div>
            )}

            {/* Type-specific action — rendered by reusable component */}
            <div className="mb-8">
              <DiscountActionRenderer discount={discount} userId={userId} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm text-dark/50">
                <Eye size={16} /> {discount.views || 0} مشاهدة
              </div>
              <div className="flex items-center gap-3 text-sm text-dark/50">
                <CheckCircle size={16} /> {discount.uses || 0} استخدام
              </div>
            </div>
          </motion.div>

          {/* Reviews */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm">
            <ReviewsSection targetType="DISCOUNT" targetId={discount.id} />
          </motion.div>
        </div>
      </section>
    </>
  )
}
