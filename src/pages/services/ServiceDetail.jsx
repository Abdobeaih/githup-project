import { useState, useEffect } from 'react'
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { handleSubscribe } from '../../utils/subscribeUtils'
import { findMedicalCenterById, findBankById } from '../../data/db'
import NotFound from '../NotFound'
import {
  MapPin, Phone, Star, ArrowLeft,
  Building2, Quote, MessageCircle, ShieldCheck,
  CheckCircle, CreditCard
} from 'lucide-react'
import Breadcrumb from '../../components/Breadcrumb'
import LoadingSpinner from '../../components/LoadingSpinner'

function StarRating({ rating, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5" dir="ltr">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= Math.round(rating) ? 'text-gold' : 'text-gold/20'}
          fill={s <= Math.round(rating) ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  )
}

export default function ServiceDetail() {
  const { id } = useParams()
  const location = useLocation()
  const { t, td, lang } = useLanguage()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [entity, setEntity] = useState(null)
  const [loading, setLoading] = useState(true)

  const isMedical = location.pathname.startsWith('/services/medical-center')

  useEffect(() => {
    const data = isMedical ? findMedicalCenterById(id) : findBankById(id)
    setEntity(data)
    setLoading(false)
  }, [isMedical, id])

  const breadcrumbItems = [
    { label: t('services', 'heading'), href: '/services' },
    { label: isMedical ? t('adminUsers', 'medicalCenter') : t('common', 'bank') },
    { label: entity ? td(isMedical ? 'medicalCenters' : 'banks', entity.name, 'name') : '' },
  ]

  if (loading) return <LoadingSpinner />
  if (!entity) return <NotFound />

  const services = entity.services_offered || []
  const pricing = entity.pricing || []
  const reviews = entity.reviews || []

  return (
    <>
      <Helmet>
        <title>{td(isMedical ? 'medicalCenters' : 'banks', entity.name, 'name')} - Freelancer 360</title>
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[50vh] hero-gradient flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gold/5 rounded-full top-20 -left-48 animate-float" />
        <div className="absolute w-72 h-72 bg-gold/5 rounded-full bottom-10 right-10 animate-float" style={{ animationDelay: '-5s' }} />
        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumb items={breadcrumbItems} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8 grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                {td(isMedical ? 'medicalCenters' : 'banks', entity.name, 'name')}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-gold" dir="ltr">
                  <Star size={18} fill="currentColor" />
                  <span className="text-white font-bold">{entity.rating}</span>
                </div>
                <div className="flex items-center gap-2 text-goldLight/70">
                  <MapPin size={16} />
                  <span>{td('governorates', entity.governorate)}</span>
                </div>
              </div>
              <p className="text-goldLight/80 leading-relaxed text-lg">
                {td(isMedical ? 'medicalCenters' : 'banks', entity.name, 'description')}
              </p>
              <button
                onClick={() => handleSubscribe(navigate, isAuthenticated, { service: isMedical ? 'medical' : 'financial', provider: entity.id, providerName: entity.name })}
                className="mt-6 btn-primary text-dark px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 shadow-xl shadow-gold/20"
              >
                <CreditCard size={20} />
                {lang === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
              </button>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gold/20">
                <img
                  src={entity.img_url}
                  alt={td(isMedical ? 'medicalCenters' : 'banks', entity.name, 'name')}
                  className="w-full object-cover h-[400px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Details + Pricing + Reviews section */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Link
              to={'/services'}
              className="inline-flex items-center gap-2 text-gold font-bold mb-8 hover:underline"
            >
              <ArrowLeft size={18} />
              {t('services', 'heading')}
            </Link>

            {/* Info card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm mb-6"
            >
              <h2 className="text-2xl font-bold text-dark mb-6">
                {td(isMedical ? 'medicalCenters' : 'banks', entity.name, 'name')}
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-dark/70">
                    <MapPin className="text-gold shrink-0" size={20} />
                    <span>{td(isMedical ? 'medicalCenters' : 'banks', entity.name, 'address')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-dark/70">
                    <Phone className="text-gold shrink-0" size={20} />
                    <span dir="ltr">{entity.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-dark/70">
                    <Building2 className="text-gold shrink-0" size={20} />
                    <span>{td('governorates', entity.governorate)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-center gap-1">
                  <div className="flex items-center gap-2" dir="ltr">
                    <span className="text-dark font-bold text-lg">{entity.rating}</span>
                    <StarRating rating={entity.rating} size={20} />
                  </div>
                  <span className="text-dark/40 text-sm">
                    ({reviews.length} {t('common', 'reviewsCount')})
                  </span>
                </div>
              </div>

              <p className="text-dark/60 leading-relaxed text-lg mb-2">
                {td(isMedical ? 'medicalCenters' : 'banks', entity.name, 'description')}
              </p>
            </motion.div>

            {/* Services offered tags */}
            {services.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm mb-6"
              >
                <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                  <CheckCircle size={20} className="text-gold" />
                  {t('common', 'services') || 'الخدمات المقدمة'}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {services.map((s, j) => (
                    <span
                      key={j}
                      className="bg-gold/5 text-gold px-4 py-2 rounded-xl font-semibold text-sm border border-gold/10"
                    >
                      {td('services_offered', s)}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Pricing Table */}
            {pricing.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm mb-6"
              >
                <h3 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-gold" />
                  {t('common', 'prices')}
                </h3>
                <div className="overflow-hidden rounded-xl border border-gold/10">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="bg-gold/5 border-b border-gold/10">
                        <th className="py-4 px-5 font-bold text-dark text-sm">{isMedical ? t('common', 'serviceDesc') : t('common', 'serviceDesc')}</th>
                        <th className="py-4 px-5 font-bold text-emerald-600 text-sm text-center whitespace-nowrap">
                          <span className="flex items-center justify-center gap-1.5">
                            <CheckCircle size={14} /> {t('common', 'memberPrice')}
                          </span>
                        </th>
                        <th className="py-4 px-5 font-bold text-dark/50 text-sm text-center whitespace-nowrap">
                          {t('common', 'nonMemberPrice')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricing.map((p, j) => (
                        <tr key={j} className="border-b border-gold/5 last:border-0 hover:bg-gold/5 transition-colors">
                          <td className="py-4 px-5 font-semibold text-dark">
                            {td('services_offered', p.service) || p.service}
                          </td>
                          <td className="py-4 px-5 text-center">
                            <span className="bg-emerald-50 text-emerald-600 font-bold px-4 py-1.5 rounded-lg text-sm">
                              {p.memberPrice === 0
                                ? t('common', 'free')
                                : `${p.memberPrice} ${t('common', 'egp')}`}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-center text-dark/60 font-semibold text-sm">
                            {p.nonMemberPrice === 0
                              ? t('common', 'free')
                              : `${p.nonMemberPrice} ${t('common', 'egp')}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Customer Reviews */}
            {reviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm mb-6"
              >
                <h3 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                  <MessageCircle size={20} className="text-gold" />
                  {t('common', 'customerReviews')}
                  <span className="text-sm text-dark/40 font-normal mr-2">({reviews.length})</span>
                </h3>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-cream rounded-xl p-5 border border-gold/10 relative"
                    >
                      <Quote size={16} className="absolute top-3 right-3 text-gold/20" />
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-sm">
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-dark text-sm">{review.userName}</p>
                            <StarRating rating={review.rating} size={12} />
                          </div>
                        </div>
                        <span className="text-dark/30 text-xs">
                          {new Date(review.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                        </span>
                      </div>
                      <p className="text-dark/70 leading-relaxed text-sm mr-2">
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </section>
    </>
  )
}
