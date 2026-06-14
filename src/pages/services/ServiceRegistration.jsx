import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Check, ArrowLeft, CreditCard, AlertCircle, Loader2, Building2, Star } from 'lucide-react'
import Breadcrumb from '../../components/Breadcrumb'
import { useLanguage } from '../../context/LanguageContext'
import { servicesData } from '../../data/servicesData'
import { submitServiceRequest } from '../../services/serviceRequestService'
import { createServiceRequest as createServiceRequestLocal } from '../../data/db'

export default function ServiceRegistration() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t, td, lang } = useLanguage()

  const serviceId = searchParams.get('service')
  const providerId = searchParams.get('provider')
  const providerName = searchParams.get('providerName')

  const service = servicesData[serviceId]
  const section = serviceId

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const breadcrumbItems = [
    { label: t('services', 'heading'), href: '/services' },
    { label: service ? t(section, 'heading') : '' },
    { label: lang === 'ar' ? 'تقديم طلب' : 'Submit Request' },
  ]

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = lang === 'ar' ? 'الاسم مطلوب' : 'Name is required'
    if (!form.phone.trim()) errs.phone = lang === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required'
    else if (!/^\d{11}$/.test(form.phone)) errs.phone = lang === 'ar' ? 'رقم الهاتف يجب أن يتكون من 11 رقمًا' : 'Phone must be exactly 11 digits'
    if (!form.email.trim()) errs.email = lang === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = lang === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Invalid email format'
    if (!form.address.trim()) errs.address = lang === 'ar' ? 'العنوان مطلوب' : 'Address is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '').slice(0, 11)
      setForm(prev => ({ ...prev, phone: digits }))
      if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }))
      return
    }
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate() || !service) return

    setSubmitting(true)
    setSubmitError('')

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      service_id: serviceId,
      service_name: service ? t(section, 'heading') : serviceId,
      provider_id: providerId || null,
      provider_name: providerName || null,
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
    navigate(`/services/register/success?service=${serviceId}`, {
      state: { ...payload }
    })
  }

  if (!service) {
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
        <title>{t(section, 'title')} - {lang === 'ar' ? 'تقديم طلب' : 'Submit Request'}</title>
        <meta name="description" content={lang === 'ar' ? `تقديم طلب اشتراك في خدمة ${t(section, 'heading')} من مستقلين` : `Submit a subscription request for ${t(section, 'heading')} service from Freelancer 360`} />
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
              {lang === 'ar' ? 'تقديم طلب اشتراك' : 'Submit Subscription Request'}
            </h1>
            <p className="text-xl text-goldLight/80 mb-2">{t(section, 'heading')}</p>
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
                  {service.image ? (
                    <img src={service.image} alt={t(section, 'heading')} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Building2 size={28} className="text-gold" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{t(section, 'heading')}</h2>
                  <p className="text-goldLight/70 text-sm">{t(section, 'subtitle')}</p>
                </div>
              </div>

              {submitError && (
                <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle size={20} className="text-red-500 shrink-0" />
                  <p className="text-red-700 text-sm">{submitError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-dark font-bold mb-1.5 text-sm">
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

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-dark font-bold mb-1.5 text-sm">
                      {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11) }}
                      maxLength={11}
                      inputMode="numeric"
                      className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gold/20 bg-cream/50'} focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all text-dark`}
                      placeholder={lang === 'ar' ? 'أدخل رقم الهاتف' : 'Enter phone number'}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-dark font-bold mb-1.5 text-sm">
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
                  <label className="block text-dark font-bold mb-1.5 text-sm">
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
                  <label className="block text-dark font-bold mb-1.5 text-sm">
                    {lang === 'ar' ? 'الخدمة المطلوبة' : 'Service Name'}
                  </label>
                  <input
                    type="text"
                    value={t(section, 'heading')}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-gold/5 text-dark/70 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-dark font-bold mb-1.5 text-sm">
                    {lang === 'ar' ? 'ملاحظات' : 'Notes'} <span className="text-dark/40 text-xs">{lang === 'ar' ? '(اختياري)' : '(optional)'}</span>
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all text-dark resize-none"
                    placeholder={lang === 'ar' ? 'أي ملاحظات إضافية...' : 'Any additional notes...'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-gold to-[#a67c3d] text-dark font-bold py-4 px-8 rounded-2xl text-lg hover:shadow-xl hover:shadow-gold/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      {lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      {lang === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
