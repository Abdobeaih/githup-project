import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Check, ArrowLeft, Shield, HelpCircle, CreditCard, Star, Building2, FileText, Phone, Mail, MapPin, Edit3, Loader2, AlertCircle } from 'lucide-react'
import Breadcrumb from '../../components/Breadcrumb'
import FAQ from '../../components/FAQ'
import Modal from '../../components/Modal'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { servicesData } from '../../data/servicesData'
import { getAllMedicalCenters } from '../../data/db'
import { PLAN_IDS } from '../../types/subscription'
import { submitServiceRequest } from '../../services/serviceRequestService'
import { createServiceRequest as createServiceRequestLocal } from '../../data/db'

function providerImgUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=c19553&color=fff&size=400`
}

function ProviderCard({ provider }) {
  const { td, lang } = useLanguage()
  return (
    <motion.div
      className="bg-white rounded-2xl border border-gold/10 hover:border-gold/30 hover:shadow-lg transition-all overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="h-44 overflow-hidden relative">
        <img
          src={provider.img_url || providerImgUrl(provider.name)}
          alt={td('companies', provider.name)}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-dark/70 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {provider.discount_percent}% خصم
        </div>
      </div>
      <div className="p-5">
        <h4 className="font-bold text-dark text-lg mb-1">{td('companies', provider.name)}</h4>
        <div className="flex items-center gap-2 text-xs text-dark/60 mb-2">
          <span>{provider.city}</span>
          {provider.rating && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1" dir="ltr">
                <Star size={12} className="text-gold" fill="currentColor" />
                <span className="font-semibold text-dark">{provider.rating}</span>
              </div>
            </>
          )}
        </div>

        {/* Description snippet */}
        <p className="text-dark/60 text-xs leading-relaxed mb-3 line-clamp-2">
          {td('medicalCenters', provider.name, 'description') || provider.description}
        </p>

        {/* Services offered tags */}
        {provider.services_offered?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {provider.services_offered.slice(0, 4).map((s, i) => (
              <span key={i} className="bg-gold/5 text-gold text-[10px] font-semibold px-2 py-0.5 rounded-full border border-gold/10">
                {td('services_offered', s) || s}
              </span>
            ))}
            {provider.services_offered.length > 4 && (
              <span className="text-[10px] text-dark/40">+{provider.services_offered.length - 4}</span>
            )}
          </div>
        )}

        <div className="bg-cream/50 rounded-xl p-3 mb-4 space-y-1.5">
          {provider.pricing?.slice(0, 3).map((p, i) => (
            <div key={i} className="flex justify-between items-center text-xs">
              <span className="text-dark/70">{p.service}</span>
              <span className="text-gold font-bold">{p.memberPrice} ج.م</span>
            </div>
          ))}
          {provider.pricing?.length > 3 && (
            <p className="text-[10px] text-dark/40 text-center pt-1">+{provider.pricing.length - 3} خدمات أخرى</p>
          )}
        </div>

        <Link
          to={`/services/medical-center/${provider.id}`}
          className="block w-full text-center border-2 border-gold/30 text-gold font-bold py-2.5 px-4 rounded-xl text-sm hover:bg-gold/5 active:scale-[0.98] transition-all"
        >
          {lang === 'ar' ? 'التفاصيل' : 'Details'}
        </Link>
      </div>
    </motion.div>
  )
}

export default function MedicalInsurance() {
  const service = servicesData['medical']
  const section = 'medical'
  const { t, tf, td, lang } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [centers, setCenters] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [selectedCenter, setSelectedCenter] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', cardNumber: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const data = getAllMedicalCenters()
    setCenters(data)
    setLoading(false)
  }, [])

  if (!service) return null
  if (loading) return <LoadingSpinner />

  const breadcrumbItems = [
    { label: t('serviceDetail', 'backToServices'), href: '/#services' },
    { label: t(section, 'heading') },
  ]

  const openModal = (center) => {
    setSelectedCenter(center)
    setForm({ name: '', phone: '', email: '', address: '', cardNumber: '', notes: '' })
    setErrors({})
    setSubmitError('')
    setSubmitted(false)
    setShowModal(true)
  }

  const closeModal = () => {
    if (submitting) return
    setShowModal(false)
    setSelectedCenter(null)
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = lang === 'ar' ? 'الاسم مطلوب' : 'Name is required'
    if (!form.phone.trim()) errs.phone = lang === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required'
    else if (form.phone.trim().length > 11) errs.phone = lang === 'ar' ? 'رقم الهاتف يجب أن لا يتجاوز 11 رقمًا' : 'Phone must not exceed 11 digits'
    if (!form.email.trim()) errs.email = lang === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = lang === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Invalid email format'
    if (!form.address.trim()) errs.address = lang === 'ar' ? 'العنوان مطلوب' : 'Address is required'
    if (form.cardNumber && form.cardNumber.length > 14) errs.cardNumber = lang === 'ar' ? 'رقم البطاقة يجب أن لا يتجاوز 14 رقمًا' : 'Card number must not exceed 14 digits'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'phone' || name === 'cardNumber') {
      const digits = value.replace(/\D/g, '')
      setForm(prev => ({ ...prev, [name]: digits }))
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
      return
    }
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setSubmitError('')

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      service_id: 'medical',
      service_name: t(section, 'heading'),
      provider_id: selectedCenter?.id || null,
      provider_name: selectedCenter?.name || null,
      card_number: form.cardNumber || null,
      notes: form.notes.trim(),
    }

    try {
      await submitServiceRequest(payload)
    } catch {
      try {
        createServiceRequestLocal(payload)
      } catch {
        setSubmitError(lang === 'ar' ? 'حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.' : 'An error occurred. Please try again.')
        setSubmitting(false)
        return
      }
    }

    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <>
      <Helmet>
        <title>{t(section, 'title')}</title>
        <meta name="description" content={t(section, 'description')} />
        <meta property="og:title" content={t(section, 'title')} />
        <meta property="og:description" content={t(section, 'description')} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] hero-gradient flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gold/5 rounded-full top-20 -left-48 animate-float" />
        <div className="absolute w-72 h-72 bg-gold/5 rounded-full bottom-10 right-10 animate-float" style={{ animationDelay: '-5s' }} />
        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumb items={breadcrumbItems} />
          <motion.div
            className="mt-8 grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 px-4 py-2 rounded-full mb-6">
                <Star className="text-gold" size={14} />
                <span className="text-gold text-sm font-bold">{t('common', 'premiumService')}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                {t(section, 'heading')}
              </h1>
              <p className="text-xl text-goldLight/80 mb-6">{t(section, 'subtitle')}</p>
              <p className="text-goldLight/70 leading-relaxed mb-8 text-lg">{t(section, 'heroText')}</p>
              <Link
                to={user?.id ? '/pricing' : '/login'}
                className="btn-primary text-dark px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 shadow-xl shadow-gold/20"
              >
                <CreditCard size={20} />
                {t(section, 'cta')}
              </Link>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gold/20">
                <img
                  src={service.image}
                  alt={t(section, 'heading')}
                  className="w-full object-cover h-[400px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-dark mb-6 text-center">{t('common', 'serviceDesc')}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full mb-10" />
            <p className="text-dark/70 leading-loose text-lg text-center">{t(section, 'longDesc')}</p>
          </motion.div>
        </div>
      </section>

      {/* Provider Grid: Medical Centers */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <Building2 size={24} className="text-gold" />
              <h2 className="text-2xl md:text-3xl font-bold text-dark">
                {lang === 'ar' ? 'المستشفيات والمراكز الطبية المشاركة' : 'Participating Medical Centers'}
              </h2>
            </div>
            <p className="text-dark/50 text-sm">{centers.length} {lang === 'ar' ? 'مركز طبي شريك' : 'partner medical centers'}</p>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {centers.map((center) => (
              <ProviderCard key={center.id} provider={center} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark mb-4">{t('common', 'features')}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {service.features.map((feature, i) => (
              <motion.div
                key={i}
                className="bg-white p-6 rounded-2xl border border-gold/10 hover:border-gold/30 hover:shadow-lg transition-all group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-gold to-[#a67c3d] rounded-xl flex items-center justify-center text-dark mb-4 shadow-lg shadow-gold/20 group-hover:scale-110 transition-transform">
                  <Check size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">{tf(section, 'features', i, 'title')}</h3>
                <p className="text-dark/60 text-sm leading-relaxed">{tf(section, 'features', i, 'desc')}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Table */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark mb-4">{t('common', 'coverages')}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full" />
          </div>
          <motion.div
            className="max-w-3xl mx-auto bg-white rounded-3xl overflow-hidden shadow-xl border border-gold/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-r from-dark to-darkLight p-6">
              <div className="flex items-center gap-3 text-white">
                <Shield className="text-gold" size={24} />
                <h3 className="text-xl font-bold">{t('common', 'coverageTable')}</h3>
              </div>
            </div>
            <div className="divide-y divide-gold/10">
              {service.coverages.map((coverage, i) => (
                <div key={i} className="flex items-center justify-between p-5 hover:bg-gold/5 transition-colors">
                  <span className="text-dark font-semibold">{tf(section, 'coverages', i, 'name')}</span>
                  <span className="bg-gold/10 text-gold px-4 py-1.5 rounded-full text-sm font-bold">{tf(section, 'coverages', i, 'value')}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ & CTA */}
      <section className="py-20 bg-gradient-to-br from-dark via-darkLight to-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #c19553 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          {/* FAQ */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <HelpCircle className="text-gold" size={24} />
              <h2 className="text-3xl font-bold text-white">{t('common', 'faq')}</h2>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full" />
          </div>
          <FAQ items={service.faq.map((_, i) => ({ q: tf(section, 'faq', i, 'q'), a: tf(section, 'faq', i, 'a') }))} />

          {/* Join CTA */}
          <div className="mt-16 pt-16 border-t border-gold/10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('common', 'ctaTitle')}</h2>
              <p className="text-goldLight/70 max-w-2xl mx-auto mb-8 text-lg">{t('common', 'ctaSubtitle')}</p>
              {user?.plan !== PLAN_IDS.ELITE && (
                <button onClick={() => openModal(null)} className="btn-primary text-dark px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 shadow-xl shadow-gold/20">
                  {t('common', 'ctaButton')}
                  <ArrowLeft size={20} />
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Modal
        open={showModal}
        onClose={closeModal}
        title={user?.plan === PLAN_IDS.ELITE
          ? (lang === 'ar' ? 'باقة النخبة' : 'Elite Plan')
          : (submitted
            ? (lang === 'ar' ? 'تم إرسال الطلب' : 'Request Submitted')
            : (lang === 'ar' ? 'تقديم طلب اشتراك' : 'Submit Subscription Request'))}
        size="md"
      >
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
            <button
              onClick={closeModal}
              className="mt-6 bg-gradient-to-r from-gold to-[#a67c3d] text-dark px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-gold/30 transition-all"
            >
              {lang === 'ar' ? 'تم' : 'Done'}
            </button>
          </div>
        ) : submitted ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4"
            >
              <Check size={40} strokeWidth={2.5} />
            </motion.div>
            <h3 className="text-xl font-bold text-dark mb-2">
              {lang === 'ar' ? 'تم تقديم الطلب بنجاح' : 'Request Submitted Successfully'}
            </h3>
            <p className="text-dark/60 text-sm mb-6">
              {lang === 'ar'
                ? 'سنقوم بمراجعة طلبك والتواصل معك في أقرب وقت ممكن'
                : 'We will review your request and contact you as soon as possible'}
            </p>
            <button
              onClick={closeModal}
              className="bg-gradient-to-r from-gold to-[#a67c3d] text-dark px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-gold/30 transition-all"
            >
              {lang === 'ar' ? 'تم' : 'Done'}
            </button>
          </div>
        ) : (
          <>
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-4">
                <AlertCircle size={20} className="text-red-500 shrink-0" />
                <p className="text-red-700 text-sm">{submitError}</p>
              </div>
            )}

            <div className="mb-6 p-4 bg-gold/5 rounded-xl border border-gold/10">
              <div className="flex items-center gap-3 mb-3">
                <Building2 size={20} className="text-gold" />
                <div>
                  <p className="text-xs text-dark/50">{lang === 'ar' ? 'الخدمة' : 'Service'}</p>
                  <p className="font-bold text-dark">{t(section, 'heading')}</p>
                </div>
              </div>
              {selectedCenter && (
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-gold" />
                  <div>
                    <p className="text-xs text-dark/50">{lang === 'ar' ? 'مقدم الخدمة' : 'Provider'}</p>
                    <p className="font-bold text-dark">{td('companies', selectedCenter.name)}</p>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-dark font-bold mb-1.5 text-sm flex items-center gap-2">
                  <FileText size={14} className="text-gold" />
                  {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gold/20 bg-cream/50'} focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all text-dark`}
                  placeholder={lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-dark font-bold mb-1.5 text-sm flex items-center gap-2">
                    <Phone size={14} className="text-gold" />
                    {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '') }}
                    maxLength={11}
                    inputMode="numeric"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gold/20 bg-cream/50'} focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all text-dark`}
                    placeholder={lang === 'ar' ? 'أدخل رقم الهاتف' : 'Enter phone number'}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-dark font-bold mb-1.5 text-sm flex items-center gap-2">
                    <Mail size={14} className="text-gold" />
                    {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gold/20 bg-cream/50'} focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all text-dark`}
                    placeholder={lang === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter email address'}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-dark font-bold mb-1.5 text-sm flex items-center gap-2">
                  <MapPin size={14} className="text-gold" />
                  {lang === 'ar' ? 'العنوان' : 'Address'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-red-300 bg-red-50' : 'border-gold/20 bg-cream/50'} focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all text-dark`}
                  placeholder={lang === 'ar' ? 'أدخل عنوانك' : 'Enter your address'}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-dark font-bold mb-1.5 text-sm flex items-center gap-2">
                  <CreditCard size={14} className="text-gold" />
                  {lang === 'ar' ? 'رقم البطاقة' : 'Card Number'}
                  <span className="text-dark/40 text-xs">({lang === 'ar' ? 'اختياري' : 'optional'})</span>
                </label>
                <input
                  type="tel"
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={handleChange}
                  onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '') }}
                  maxLength={14}
                  inputMode="numeric"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.cardNumber ? 'border-red-300 bg-red-50' : 'border-gold/20 bg-cream/50'} focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all text-dark`}
                  placeholder={lang === 'ar' ? 'أدخل رقم البطاقة' : 'Enter card number'}
                />
                {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
              </div>

              <div>
                <label className="block text-dark font-bold mb-1.5 text-sm flex items-center gap-2">
                  <Edit3 size={14} className="text-gold" />
                  {lang === 'ar' ? 'ملاحظات' : 'Notes'}
                  <span className="text-dark/40 text-xs">({lang === 'ar' ? 'اختياري' : 'optional'})</span>
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all text-dark resize-none"
                  placeholder={lang === 'ar' ? 'أي ملاحظات إضافية...' : 'Any additional notes...'}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="flex-1 border-2 border-gold/30 text-gold font-bold py-3 px-4 rounded-xl hover:bg-gold/5 transition-all disabled:opacity-50"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] bg-gradient-to-r from-gold to-[#a67c3d] text-dark font-bold py-3 px-4 rounded-xl hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      {lang === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </Modal>

    </>
  )
}
