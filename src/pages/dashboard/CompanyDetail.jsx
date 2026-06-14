import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/BackButton'
import ReviewsSection from '../../components/ReviewsSection'
import { findCompanyById, getDiscountsByCompany } from '../../data/db'
import { CATEGORY_COLORS as categoryColors, CATEGORY_LABELS as categoryLabels, TIER_LABELS as tierLabels, TIER_COLORS as tierColors } from '../../types/discount'
import { REVIEW_TARGET_TYPES } from '../../types/review'
import { Building2, MapPin, Tag, Percent, Eye, Star, Phone, Clock, ChevronLeft } from 'lucide-react'

export default function CompanyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, td } = useLanguage()
  const [company, setCompany] = useState(null)
  const [discounts, setDiscounts] = useState([])

  useEffect(() => {
    const found = findCompanyById(id)
    if (found) {
      setCompany(found)
      setDiscounts(getDiscountsByCompany(id))
    }
  }, [id])

  if (!company) {
    return (
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          <div className="text-center py-20">
            <Building2 className="text-gold/30 mx-auto mb-4" size={64} />
            <p className="text-dark/50">الشركة غير موجودة</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <Helmet><title>{td('companies', company.name) || company.name}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="text-6xl">{company.emoji || '🏢'}</div>
              <div className="flex-1 text-center md:text-right">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-dark">{td('companies', company.name) || company.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[company.category] || ''}`}>
                    {categoryLabels[company.category] || company.category}
                  </span>
                </div>
                <p className="text-dark/60 mb-4">{company.city}</p>
                {company.email && (
                  <p className="text-dark/50 text-sm mb-2">{company.email}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-gold/10 shadow-sm text-center">
              <Tag size={20} className="text-gold mx-auto mb-2" />
              <p className="text-2xl font-extrabold text-dark">{discounts.length}</p>
              <p className="text-dark/50 text-xs">خصم</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gold/10 shadow-sm text-center">
              <Eye size={20} className="text-gold mx-auto mb-2" />
              <p className="text-2xl font-extrabold text-dark">{company.views || 0}</p>
              <p className="text-dark/50 text-xs">مشاهدة</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gold/10 shadow-sm text-center">
              <Star size={20} className="text-gold mx-auto mb-2" />
              <p className="text-2xl font-extrabold text-dark">{company.uses || 0}</p>
              <p className="text-dark/50 text-xs">استخدام</p>
            </div>
          </motion.div>

          {/* Discounts */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-xl font-bold text-dark mb-4">الخصومات المتاحة</h2>
            {discounts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-gold/10 shadow-sm text-center">
                <Percent className="text-gold/30 mx-auto mb-4" size={48} />
                <p className="text-dark/50">لا توجد خصومات متاحة حاليًا</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {discounts.filter(d => d.status === 'approved').map((d, i) => (
                  <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[d.category] || ''}`}>
                        {categoryLabels[d.category] || d.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${tierColors[d.tier] || ''}`}>
                        {tierLabels[d.tier] || d.tier}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-dark mb-2">{td('discounts', d.name, 'name') || d.name}</h3>
                    <p className="text-dark/60 text-sm mb-4 line-clamp-2">{td('discounts', d.name, 'description') || d.description}</p>
                    <div className="flex items-center gap-2 mb-4 text-sm text-dark/50">
                      <MapPin size={14} />
                      <span>{td('governorates', d.city) || d.city}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-extrabold text-gold">{d.discount_percent}</span>
                        <span className="text-dark/40 text-xs">خصم</span>
                      </div>
                      <button onClick={() => navigate(`/discounts/${d.id}`)}
                        className="bg-dark text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-darkLight transition-all">
                        التفاصيل
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Reviews */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm">
            <ReviewsSection targetType={REVIEW_TARGET_TYPES.COMPANY} targetId={company.id} />
          </motion.div>
        </div>
      </section>
    </>
  )
}
