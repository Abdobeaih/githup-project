import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Shield, FileText, Calendar, Phone, Check, ArrowLeft, AlertCircle, Loader2, Building2 } from 'lucide-react'
import Breadcrumb from '../../components/Breadcrumb'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { servicesData } from '../../data/servicesData'
import { enrollUserInService, confirmEnrollmentSubscription, findMedicalCenterById, findBankById } from '../../data/db'
import { PLAN_IDS } from '../../types/subscription'

export default function Enrollment() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const serviceParam = searchParams.get('service')
  const providerId = searchParams.get('provider')
  const providerNameParam = searchParams.get('providerName')

  const service = serviceParam ? servicesData[serviceParam] : null
  const isMedical = serviceParam === 'medical'
  const isFinancial = serviceParam === 'financial'

  const [enrollment, setEnrollment] = useState(null)
  const [providerName, setProviderName] = useState(providerNameParam || '')
  const [pageLoading, setPageLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [form, setForm] = useState({
    fullName: user?.name || '',
    dateOfBirth: '',
    phone: user?.phone || '',
    agreeDataUse: false,
    agreeTerms: false,
  })

  const isValid =
    form.dateOfBirth !== '' &&
    form.agreeDataUse &&
    form.agreeTerms

  const breadcrumbItems = [
    { label: t('services', 'heading'), href: '/services' },
    { label: service ? t(serviceParam, 'heading') : '' },
    { label: lang === 'ar' ? 'تأكيد الاشتراك' : 'Confirm Subscription' },
  ]

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      const params = new URLSearchParams()
      if (serviceParam) params.set('service', serviceParam)
      if (providerId) params.set('provider', providerId)
      if (providerNameParam) params.set('providerName', providerNameParam)
      navigate(`/join?redirect=services/enroll&${params.toString()}`, { replace: true })
      return
    }
    if (!serviceParam || !service || (!isMedical && !isFinancial)) {
      setPageError('invalidService')
      setPageLoading(false)
      return
    }
    if (!providerNameParam && providerId) {
      const entity = isMedical ? findMedicalCenterById(providerId) : findBankById(providerId)
      if (entity) setProviderName(entity.name)
    }
    const enrollmentData = {
      service_type: serviceParam,
      ...(isMedical && providerId ? { center_id: providerId } : {}),
      ...(isFinancial && providerId ? { bank_id: providerId } : {}),
    }
    const newEnrollment = enrollUserInService(user.id, enrollmentData)
    setEnrollment(newEnrollment)
    setPageLoading(false)
  }, [authLoading, isAuthenticated, user, serviceParam, providerId, providerNameParam])

  const handleCheckboxChange = (field) => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid || !enrollment) return
    setIsSubmitting(true)
    setSubmitError('')
    try {
      confirmEnrollmentSubscription(enrollment.id, {
        name: user.name,
        dob: form.dateOfBirth,
        phone: user.phone,
        dataUseAgree: form.agreeDataUse,
        termsAgree: form.agreeTerms,
      })
      const regParams = new URLSearchParams()
      regParams.set('service', serviceParam)
      if (providerId) regParams.set('provider', providerId)
      if (providerNameParam) regParams.set('providerName', providerNameParam)
      navigate(`/services/register?${regParams.toString()}`, { replace: true })
    } catch {
      setSubmitError(
        lang === 'ar'
          ? 'حدث خطأ أثناء تأكيد الاشتراك. حاول مرة أخرى.'
          : 'An error occurred while confirming your subscription. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (pageLoading || authLoading) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center bg-cream">
        <LoadingSpinner size="lg" />
      </section>
    )
  }

  if (pageError === 'invalidService') {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-cream px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-3">
            {lang === 'ar' ? 'الخدمة غير متوفرة' : 'Service Not Available'}
          </h2>
          <Link to="/services" className="bg-gradient-to-r from-gold to-[#a67c3d] text-dark px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            {lang === 'ar' ? 'العودة للخدمات' : 'Back to Services'}
          </Link>
        </div>
      </section>
    )
  }


  return (
    <>
      <Helmet>
        <title>{t('common', 'subscriptionTitle')}</title>
        <meta name="description" content={lang === 'ar' ? `تأكيد اشتراكك في ${t(serviceParam, 'heading')}` : `Confirm your subscription to ${t(serviceParam, 'heading')}`} />
      </Helmet>

      <section className="relative min-h-[60vh] hero-gradient flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gold/5 rounded-full top-20 -left-48 animate-float" />
        <div className="absolute w-72 h-72 bg-gold/5 rounded-full bottom-10 right-10 animate-float" style={{ animationDelay: '-5s' }} />
        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumb items={breadcrumbItems} />
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              {t('common', 'subscriptionTitle')}
            </h1>
            <p className="text-xl text-goldLight/80 mb-2">{t(serviceParam, 'heading')}</p>
            {providerName && (
              <p className="text-goldLight/60">{providerName}</p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl border border-gold/10 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-dark to-darkLight p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                  {service?.image ? (
                    <img src={service.image} alt={t(serviceParam, 'heading')} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Building2 size={28} className="text-gold" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{t(serviceParam, 'heading')}</h2>
                  <p className="text-goldLight/70 text-sm">{t(serviceParam, 'subtitle')}</p>
                </div>
              </div>

              <div className="p-4 bg-gold/5 border-b border-gold/10">
                <div className="flex items-center gap-2 text-dark/60 text-sm mb-1">
                  <Shield size={14} className="text-gold" />
                  {t('common', 'companyName')}
                </div>
                <p className="font-bold text-dark text-xl">{providerName || t(serviceParam, 'heading')}</p>
              </div>

              {submitError && (
                <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle size={20} className="text-red-500 shrink-0" />
                  <p className="text-red-700 text-sm">{submitError}</p>
                </div>
              )}

              {user?.plan === PLAN_IDS.ELITE ? (
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield size={40} className="text-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-3">
                    {lang === 'ar' ? 'أنت مشترك في باقة النخبة' : 'You Have the Elite Plan'}
                  </h3>
                  <p className="text-dark/60 text-sm leading-relaxed max-w-md mx-auto">
                    {lang === 'ar'
                      ? 'جميع الخدمات متاحة لك بالفعل من خلال باقة النخبة. يمكنك متابعة خدماتك من لوحة التحكم.'
                      : 'All services are already available to you through the Elite plan. You can manage your services from your dashboard.'}
                  </p>
                  <Link
                    to="/dashboard"
                    className="inline-block mt-6 bg-gradient-to-r from-gold to-[#a67c3d] text-dark px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-gold/30 transition-all"
                  >
                    {lang === 'ar' ? 'الذهاب إلى لوحة التحكم' : 'Go to Dashboard'}
                  </Link>
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-dark mb-1.5 flex items-center gap-2">
                    <FileText size={14} className="text-gold" />
                    {t('common', 'yourFullName')}
                  </label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-gold/5 text-dark font-medium">
                    {form.fullName}
                  </div>
                </div>

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

                <div>
                  <label className="block text-sm font-bold text-dark mb-1.5 flex items-center gap-2">
                    <Phone size={14} className="text-gold" />
                    {t('common', 'phoneNumber')}
                  </label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-gold/5 text-dark font-medium">
                    {form.phone}
                  </div>
                </div>

                <div className="h-px bg-gold/10" />

                <div className="space-y-3">
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

                <div className="h-px bg-gold/10" />

                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={`w-full font-bold text-sm py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    isValid && !isSubmitting
                      ? 'bg-gradient-to-r from-gold to-[#a67c3d] text-dark hover:shadow-md active:scale-[0.98]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {lang === 'ar' ? 'جاري التأكيد...' : 'Confirming...'}
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      {t('common', 'confirmSubscription')}
                    </>
                  )}
                </button>
              </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
