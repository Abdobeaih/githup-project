import { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { getGovernorates, enrollUserInService } from '../data/db'
import { getMedicalCenters, getBanks, getMedicalCentersByGovernorate, getBanksByGovernorate } from '../services/enrollmentService'
import { User, Briefcase, Mail, Lock, ArrowLeft, MapPin, Check, Smartphone, CreditCard, Building2, QrCode, Shield, Zap, Crown, Phone, Globe, Link2, Store, ClipboardList, UserCheck, KeyRound, Loader2, Stethoscope, Landmark } from 'lucide-react'
import { PasswordInput } from '../components/ui'
import { USER_ROLES } from '../types/user'

const STEPS = ['stepInfo', 'stepPlan', 'stepPayment']

const PAYMENT_METHODS = [
  { id: 'vodafone_cash',    icon: Smartphone, nameKey: 'vodafoneCash',     descKey: 'vodafoneCashDesc' },
  { id: 'credit_card',      icon: CreditCard,  nameKey: 'creditCard',      descKey: 'creditCardDesc' },
  { id: 'bank_transfer',    icon: Building2,   nameKey: 'bankTransfer',    descKey: 'bankTransferDesc' },
  { id: 'instapay',         icon: QrCode,      nameKey: 'instaPay',        descKey: 'instaPayDesc' },
]

const PLAN_PRICES = { free: 0, premium: 99, elite: 199 }
const PLAN_ICONS  = { free: Shield, premium: Zap, elite: Crown }

export default function Signup() {
  const { signup, sendSignupOtp, verifySignupEmail, sendingSignupOtp, verifyingSignupOtp } = useAuth()
  const { t, ta, td, lang } = useLanguage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const [governorates, setGovernorates] = useState([])

  const [role, setRole] = useState(null) // null | USER_ROLES.USER | USER_ROLES.COMPANY
  const [step, setStep] = useState(0)
  const [processing, setProcessing] = useState(false)

  // OTP verification state
  const [showOtpVerification, setShowOtpVerification] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpSuccess, setOtpSuccess] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const otpRefs = useRef([])

  const [form, setForm] = useState({
    name: '', email: '', phone: '', nationalId: '', job: '', password: '', plan: 'free',
    governorate: '',
    // Company fields
    companyFullName: '', companyJobTitle: '', companyPhone: '',
    companyEmail: '', companyName: '', companyCategory: 'food',
    companyBranchName: '', companyContactLink: '', companyWebsite: '',
    // Checkboxes
    hasCommercialReg: false, hasTaxCard: false,
    // Insurance selection
    medical_center_id: '', bank_id: '',
  })
  const [medicalCenters, setMedicalCenters] = useState([])
  const [banks, setBanks] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  // Load insurance providers from API (with governorate filter)
  useEffect(() => {
    let cancelled = false
    async function loadProviders() {
      const gov = form.governorate
      const [centers, bks] = gov
        ? await Promise.all([getMedicalCentersByGovernorate(gov), getBanksByGovernorate(gov)])
        : await Promise.all([getMedicalCenters(), getBanks()])
      if (!cancelled) {
        setMedicalCenters(centers)
        setBanks(bks)
      }
    }
    loadProviders()
    return () => { cancelled = true }
  }, [form.governorate])

  useEffect(() => {
    setGovernorates(getGovernorates())
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
    if (fieldErrors[name]) setFieldErrors({ ...fieldErrors, [name]: '' })
  }

  const isUser = role === USER_ROLES.USER
  const isPaidPlan = form.plan === 'premium' || form.plan === 'elite'
  const isElite = form.plan === 'elite'
  const specialties = ta('signup', 'specialties')
  const categories = ['medical', 'gym', 'food', 'fun']

  // ── Step validation ──────────────────────────────────────────
  const getStep0Errors = () => {
    const errs = {}
    if (form.phone && !/^\d{11}$/.test(form.phone)) errs.phone = 'Phone number must be exactly 11 digits.'
    if (form.nationalId && !/^\d{14}$/.test(form.nationalId)) errs.nationalId = 'National ID must be exactly 14 digits.'
    return errs
  }

  const canGoNext = () => {
    if (step === 0) {
      if (!(form.name && form.email && form.job && form.password && form.governorate)) return false
      return Object.keys(getStep0Errors()).length === 0
    }
    // Step 1: comprehensive (elite) requires both insurance selections
    if (step === 1) {
      if (isElite && (!form.medical_center_id || !form.bank_id)) return false
      return true
    }
    return true
  }

  const handleNext = () => {
    if (!canGoNext()) return
    if (step === 0) setFieldErrors(getStep0Errors())
    // Step 1: plan selection — free → submit, paid → validate insurance → payment
    if (step === 1) {
      if (!isPaidPlan) {
        handleSubmit()
        return
      }
      // Comprehensive (elite) — both insurance selections required
      if (isElite && (!form.medical_center_id || !form.bank_id)) {
        setError(lang === 'ar' ? 'يرجى اختيار مقدم التأمين الطبي والمالي' : 'Please select both medical and financial insurance providers')
        return
      }
      setError('')
    }
    setStep(s => Math.min(s + 1, STEPS.length - 1))
  }

  const handleBack = () => {
    if (step === 0) { setRole(null); return }
    setStep(s => Math.max(s - 1, 0))
  }

  const handleSubmit = () => {
    setError('')
    setProcessing(true)

    if (isPaidPlan && step === 2) {
      setTimeout(() => { doSignup() }, 1500)
      return
    }

    doSignup()
  }

  const doSignup = async () => {
    setProcessing(false)
    const result = signup({
      name: form.name, email: form.email, phone: form.phone, nationalId: form.nationalId, job: form.job, password: form.password,
      plan: form.plan, role: USER_ROLES.USER,
      governorate: form.governorate,
    })
    if (result.success) {
      // Enroll in selected insurance services for comprehensive (elite) plan
      if (isElite) {
        if (form.medical_center_id) {
          enrollUserInService(result.user.id, { service_type: 'medical', center_id: form.medical_center_id })
        }
        if (form.bank_id) {
          enrollUserInService(result.user.id, { service_type: 'financial', bank_id: form.bank_id })
        }
      }
      // Send verification OTP email and show OTP screen
      const otpResult = await sendSignupOtp(form.email, form.name, USER_ROLES.USER)
      if (otpResult.success) {
        setOtpSuccess('تم إرسال رمز التحقق إلى بريدك الإلكتروني')
        setShowOtpVerification(true)
        setOtpCode('')
        setOtpError('')
        startResendCooldown()
        setTimeout(() => otpRefs.current[0]?.focus(), 100)
      } else {
        // OTP sending failed but user is created — redirect anyway
        finishSignup()
      }
    } else setError(result.error)
  }

  const finishSignup = () => {
    if (redirectUrl) {
      const service = searchParams.get('service') || ''
      const provider = searchParams.get('provider') || ''
      const providerName = searchParams.get('providerName') || ''
      navigate(`/${redirectUrl}?service=${service}&provider=${provider}&providerName=${providerName}`, { replace: true })
    } else {
      navigate('/dashboard/user')
    }
  }

  // OTP input handlers
  const handleOtpDigit = (index, e) => {
    const val = e.target.value
    if (!/^\d?$/.test(val)) return
    const arr = otpCode.split('')
    arr[index] = val
    const newOtp = arr.join('')
    setOtpCode(newOtp)
    if (val && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = async (e) => {
    e?.preventDefault()
    setOtpError('')
    if (otpCode.length !== 6) {
      setOtpError('يرجى إدخال رمز التحقق المكون من 6 أرقام')
      return
    }
    const result = await verifySignupEmail(form.email, otpCode, USER_ROLES.USER)
    if (result.success) {
      setOtpSuccess('تم تأكيد البريد الإلكتروني بنجاح! مرحباً بك في Freelancer360')
      setTimeout(() => finishSignup(), 1500)
    } else {
      setOtpError(result.error)
    }
  }

  const startResendCooldown = () => {
    setResendCooldown(60)
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return
    setOtpError('')
    const result = await sendSignupOtp(form.email, form.name, USER_ROLES.USER)
    if (result.success) {
      setOtpSuccess('تم إعادة إرسال رمز التحقق')
      setOtpCode('')
      startResendCooldown()
    } else {
      setOtpError(result.error)
    }
  }

  const handleCompanySubmit = (e) => {
    e.preventDefault()
    setError('')
    const result = signup({
      name: form.companyName,
      email: form.companyEmail,
      password: form.companyName + '123', // auto-generated password
      job: form.companyCategory,
      role: USER_ROLES.COMPANY,
    })
    if (result.success) navigate('/dashboard/company')
    else setError(result.error)
  }

  // ── Animations ───────────────────────────────────────────────
  const slideVariants = {
    enter:  (d) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  }

  const fadeVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -20 },
  }

  // ── Role Selection Screen ──────────────────────────────────
  if (!role) {
    return (
      <>
        <Helmet><title>{t('signup', 'title')}</title></Helmet>
        <section className="min-h-screen hero-gradient flex items-center pt-24 pb-12">
          <div className="container mx-auto px-6">
            <motion.div {...fadeVariants} className="max-w-lg mx-auto">
              <div className="text-center mb-10">
                <Link to="/" className="inline-flex items-center gap-2 text-goldLight hover:text-gold transition-colors mb-6">
                  <ArrowLeft size={18} /> {t('signup', 'backHome')}
                </Link>
                <h1 className="text-4xl font-bold text-white mb-2">{t('signup', 'heading')}</h1>
                <p className="text-goldLight/60">{t('signup', 'roleSubtitle')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Individual Card */}
                <button onClick={() => setRole(USER_ROLES.USER)}
                  className="group bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-gold/20 hover:border-gold/60 transition-all text-center hover:bg-gold/5 hover:shadow-xl hover:shadow-gold/10">
                  <div className="text-5xl mb-4">👤</div>
                  <h3 className="text-xl font-bold text-white mb-2">{t('signup', 'individual')}</h3>
                  <p className="text-goldLight/50 text-sm">{t('signup', 'individualDesc')}</p>
                </button>

                {/* Company Card */}
                <button onClick={() => setRole(USER_ROLES.COMPANY)}
                  className="group bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-gold/20 hover:border-gold/60 transition-all text-center hover:bg-gold/5 hover:shadow-xl hover:shadow-gold/10">
                  <div className="text-5xl mb-4">🏢</div>
                  <h3 className="text-xl font-bold text-white mb-2">{t('signup', 'company')}</h3>
                  <p className="text-goldLight/50 text-sm">{t('signup', 'companyDesc')}</p>
                </button>
              </div>

              <p className="text-center text-goldLight/50 text-sm mt-8">
                {t('signup', 'hasAccount')}{' '}
                <Link to="/login" className="text-gold hover:text-goldLight transition-colors font-semibold">{t('signup', 'loginLink')}</Link>
              </p>
            </motion.div>
          </div>
        </section>
      </>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // COMPANY REGISTRATION FORM
  // ═══════════════════════════════════════════════════════════════
  if (role === USER_ROLES.COMPANY) {
    return (
      <>
        <Helmet><title>{t('signup', 'title')}</title></Helmet>
        <section className="min-h-screen hero-gradient flex items-center pt-24 pb-12">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
              <div className="text-center mb-8">
                <button onClick={() => setRole(null)}
                  className="inline-flex items-center gap-2 text-goldLight hover:text-gold transition-colors mb-4">
                  <ArrowLeft size={18} /> {t('signup', 'backHome')}
                </button>
                <h1 className="text-3xl font-bold text-white mb-1">{t('signup', 'heading')}</h1>
                <p className="text-goldLight/60 text-sm">{t('signup', 'subtitle')}</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-gold/20">
                <form onSubmit={handleCompanySubmit} className="space-y-4">
                  {/* Role badge */}
                  <div className="text-center mb-4">
                    <span className="inline-flex items-center gap-2 bg-gold/20 text-goldLight px-4 py-1.5 rounded-full text-xs font-bold">
                      🏢 {t('signup', 'company')}
                    </span>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-goldLight font-semibold mb-2 text-sm">{t('signup', 'companyFullName')}</label>
                    <div className="relative">
                      <UserCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                      <input type="text" name="companyFullName" value={form.companyFullName} onChange={handleChange} required
                        className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark placeholder-dark/40 outline-none input-focus"
                        placeholder={t('signup', 'companyFullNamePlaceholder')} />
                    </div>
                  </div>

                  {/* Job Title */}
                  <div>
                    <label className="block text-goldLight font-semibold mb-2 text-sm">{t('signup', 'companyJobTitle')}</label>
                    <div className="relative">
                      <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                      <input type="text" name="companyJobTitle" value={form.companyJobTitle} onChange={handleChange} required
                        className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark placeholder-dark/40 outline-none input-focus"
                        placeholder={t('signup', 'companyJobTitlePlaceholder')} />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-goldLight font-semibold mb-2 text-sm">{t('signup', 'companyPhone')}</label>
                      <div className="relative">
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                        <input type="tel" name="companyPhone" value={form.companyPhone} onChange={handleChange} required
                          inputMode="numeric" maxLength={11}
                          onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '') }}
                          className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark placeholder-dark/40 outline-none input-focus"
                          placeholder={t('signup', 'companyPhonePlaceholder')} />
                      </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-goldLight font-semibold mb-2 text-sm">{t('signup', 'companyEmailLabel')}</label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                      <input type="email" name="companyEmail" value={form.companyEmail} onChange={handleChange} required
                        className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark placeholder-dark/40 outline-none input-focus"
                        placeholder="info@company.com" />
                    </div>
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-goldLight font-semibold mb-2 text-sm">{t('signup', 'companyNameLabel')}</label>
                    <div className="relative">
                      <Store className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                      <input type="text" name="companyName" value={form.companyName} onChange={handleChange} required
                        className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark placeholder-dark/40 outline-none input-focus"
                        placeholder={t('signup', 'companyNamePlaceholder')} />
                    </div>
                  </div>

                  {/* Industry / Category */}
                  <div>
                    <label className="block text-goldLight font-semibold mb-2 text-sm">{t('signup', 'categoryLabel')}</label>
                    <div className="relative">
                      <ClipboardList className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                      <select name="companyCategory" value={form.companyCategory} onChange={handleChange}
                        className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark outline-none input-focus appearance-none cursor-pointer">
                        <option value="medical">{lang === 'ar' ? 'طبي' : 'Medical'}</option>
                        <option value="gym">{lang === 'ar' ? 'رياضة' : 'Sports'}</option>
                        <option value="food">{lang === 'ar' ? 'مطاعم' : 'Restaurants'}</option>
                        <option value="fun">{lang === 'ar' ? 'ترفيه' : 'Entertainment'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Branch Name */}
                  <div>
                    <label className="block text-goldLight font-semibold mb-2 text-sm">{t('signup', 'companyBranchName')}</label>
                    <div className="relative">
                      <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                      <input type="text" name="companyBranchName" value={form.companyBranchName} onChange={handleChange} required
                        className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark placeholder-dark/40 outline-none input-focus"
                        placeholder={t('signup', 'companyBranchNamePlaceholder')} />
                    </div>
                  </div>

                  {/* Contact Link */}
                  <div>
                    <label className="block text-goldLight font-semibold mb-2 text-sm">{t('signup', 'companyContactLink')}</label>
                    <div className="relative">
                      <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                      <input type="url" name="companyContactLink" value={form.companyContactLink} onChange={handleChange} required
                        className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark placeholder-dark/40 outline-none input-focus"
                        placeholder={t('signup', 'companyContactLinkPlaceholder')} />
                    </div>
                  </div>

                  {/* Website (optional) */}
                  <div>
                    <label className="block text-goldLight font-semibold mb-2 text-sm">{t('signup', 'companyWebsite')}</label>
                    <div className="relative">
                      <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                      <input type="url" name="companyWebsite" value={form.companyWebsite} onChange={handleChange}
                        className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark placeholder-dark/40 outline-none input-focus"
                        placeholder={t('signup', 'companyWebsitePlaceholder')} />
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="pt-4 border-t border-gold/20 space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        form.hasCommercialReg ? 'bg-gold border-gold' : 'border-gold/30 group-hover:border-gold/60'
                      }`}>
                        {form.hasCommercialReg && <Check size={14} className="text-dark" />}
                      </div>
                      <input type="checkbox" name="hasCommercialReg" checked={form.hasCommercialReg} onChange={handleChange} className="hidden" />
                      <span className="text-goldLight text-sm">{t('signup', 'commercialReg')}</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        form.hasTaxCard ? 'bg-gold border-gold' : 'border-gold/30 group-hover:border-gold/60'
                      }`}>
                        {form.hasTaxCard && <Check size={14} className="text-dark" />}
                      </div>
                      <input type="checkbox" name="hasTaxCard" checked={form.hasTaxCard} onChange={handleChange} className="hidden" />
                      <span className="text-goldLight text-sm">{t('signup', 'taxCard')}</span>
                    </label>
                  </div>

                  {error && <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl py-3">{error}</p>}

                  <button type="submit"
                    className="w-full bg-gradient-to-r from-gold to-[#a67c3d] text-dark py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-gold/20 transition-all">
                    {t('signup', 'submitCompany')}
                  </button>

                  <p className="text-center text-goldLight/50 text-sm">
                    {t('signup', 'hasAccount')} <Link to="/login" className="text-gold hover:text-goldLight transition-colors font-semibold">{t('signup', 'loginLink')}</Link>
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </section>
      </>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // USER REGISTRATION WIZARD
  // ═══════════════════════════════════════════════════════════════
  const stepIndicators = STEPS.map((key, i) => ({
    key,
    label: t('signup', key),
    active: i <= step,
  }))

  return (
    <>
      <Helmet><title>{t('signup', 'title')}</title></Helmet>
      <section className="min-h-screen hero-gradient flex items-center pt-24 pb-12">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <button onClick={() => setRole(null)}
                className="inline-flex items-center gap-2 text-goldLight hover:text-gold transition-colors mb-4">
                <ArrowLeft size={18} /> {t('signup', 'backHome')}
              </button>
              <h1 className="text-3xl font-bold text-white mb-1">{t('signup', 'heading')}</h1>
              <p className="text-goldLight/60 text-sm">{t('signup', 'subtitle')}</p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {stepIndicators.map((s, i) => (
                <div key={s.key} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    s.active ? 'bg-gold text-dark' : 'bg-white/10 text-goldLight/40'
                  }`}>
                    {i < step ? <Check size={12} /> : <span>{i + 1}</span>}
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                  {i < stepIndicators.length - 1 && (
                    <div className={`w-6 h-0.5 rounded ${i < step ? 'bg-gold' : 'bg-white/10'}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-gold/20">

              {/* ══════ Email Verification Screen ══════ */}
              {showOtpVerification ? (
                <motion.div key="otp-verify"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-5">
                  <div className="text-center mb-2">
                    <div className="flex justify-center mb-3">
                      <div className="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center">
                        <KeyRound className="text-gold" size={28} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{lang === 'ar' ? 'تأكيد البريد الإلكتروني' : 'Verify Your Email'}</h3>
                    <p className="text-goldLight/70 text-sm">{otpSuccess || 'تم إنشاء حسابك! يرجى إدخال رمز التحقق المرسل إلى بريدك الإلكتروني'}</p>
                    <p className="text-goldLight/50 text-xs mt-1" dir="ltr">{form.email}</p>
                  </div>

                  {/* 6-digit OTP input */}
                  <div className="flex justify-center gap-3 rtl:gap-3" dir="ltr">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                      <input key={i}
                        ref={el => otpRefs.current[i] = el}
                        type="text" inputMode="numeric" maxLength={1}
                        value={otpCode[i] || ''}
                        onChange={(e) => handleOtpDigit(i, e)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-12 h-14 text-center text-xl font-bold bg-white/90 border-0 rounded-xl text-dark outline-none transition-all input-focus"
                      />
                    ))}
                  </div>

                  {otpError && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl py-3">
                      {otpError}
                    </motion.p>
                  )}

                  <button type="button" onClick={handleVerifyOtp}
                    disabled={verifyingSignupOtp || otpCode.length !== 6}
                    className="w-full bg-gradient-to-r from-gold to-[#a67c3d] text-dark py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-gold/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {verifyingSignupOtp && <Loader2 size={20} className="animate-spin" />}
                    {verifyingSignupOtp
                      ? (lang === 'ar' ? 'جاري التحقق...' : 'Verifying...')
                      : (lang === 'ar' ? 'تأكيد الرمز' : 'Verify Code')}
                  </button>

                  <div className="text-center">
                    <button type="button" onClick={handleResendOtp} disabled={resendCooldown > 0}
                      className="text-gold hover:text-goldLight transition-colors text-sm disabled:opacity-50">
                      {resendCooldown > 0
                        ? (lang === 'ar' ? `إعادة الإرسال بعد ${resendCooldown} ثانية` : `Resend in ${resendCooldown}s`)
                        : (lang === 'ar' ? 'إعادة إرسال الرمز' : 'Resend Code')}
                    </button>
                  </div>
                </motion.div>
              ) : (
              <AnimatePresence mode="wait" custom={1}>
                {/* Step 0 — Personal Info */}
                {step === 0 && (
                  <motion.div key="step0" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-4">
                    <div className="text-center mb-2">
                      <span className="inline-flex items-center gap-2 bg-gold/20 text-goldLight px-4 py-1.5 rounded-full text-xs font-bold">
                        👤 {t('signup', 'individual')}
                      </span>
                    </div>
                    <div>
                      <label className="block text-goldLight font-semibold mb-2 text-sm">{t('signup', 'nameLabel')}</label>
                      <div className="relative">
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                        <input type="text" name="name" value={form.name} onChange={handleChange} required
                          className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark placeholder-dark/40 outline-none input-focus"
                          placeholder={t('signup', 'namePlaceholder')} />
                      </div>
                    </div>
                     <div>
                      <label className="block text-goldLight font-semibold mb-2 text-sm">{t('signup', 'emailLabel')}</label>
                      <div className="relative">
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                        <input type="email" name="email" value={form.email} onChange={handleChange} required
                          className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark placeholder-dark/40 outline-none input-focus"
                          placeholder="example@email.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-goldLight font-semibold mb-2 text-sm">{t('signup', 'phoneLabel')}</label>
                      <div className="relative">
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                          inputMode="numeric" maxLength={11}
                          onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '') }}
                          className={`w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark placeholder-dark/40 outline-none input-focus ${fieldErrors.phone ? 'ring-2 ring-red-400' : ''}`}
                          placeholder={t('signup', 'phonePlaceholder')} />
                      </div>
                      {fieldErrors.phone && <p className="text-red-400 text-xs mt-1">{fieldErrors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-goldLight font-semibold mb-2 text-sm">{t('signup', 'nationalIdLabel')}</label>
                      <div className="relative">
                        <UserCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                        <input type="text" name="nationalId" value={form.nationalId} onChange={handleChange}
                          inputMode="numeric" maxLength={14}
                          onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '') }}
                          className={`w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark placeholder-dark/40 outline-none input-focus ${fieldErrors.nationalId ? 'ring-2 ring-red-400' : ''}`}
                          placeholder={t('signup', 'nationalIdPlaceholder')} />
                      </div>
                      {fieldErrors.nationalId && <p className="text-red-400 text-xs mt-1">{fieldErrors.nationalId}</p>}
                    </div>
                    <div>
                      <label className="block text-goldLight font-semibold mb-2 text-sm">{t('signup', 'specialtyLabel')}</label>
                      <div className="relative">
                        <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                        <input type="text" name="job" value={form.job} onChange={handleChange} required
                          className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark placeholder-dark/40 outline-none input-focus"
                          placeholder={t('signup', 'specialtyPlaceholder')} />
                      </div>
                    </div>
                    <div>
                      <PasswordInput
                        label={t('signup', 'passwordLabel')}
                        icon={<Lock size={18} />}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark placeholder-dark/40 outline-none transition-all input-focus"
                        placeholder={t('signup', 'passwordPlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-goldLight font-semibold mb-2 text-sm">{t('signup', 'governorateLabel')}</label>
                      <div className="relative">
                        <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                        <select name="governorate" value={form.governorate} onChange={handleChange} required
                          className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark outline-none input-focus appearance-none cursor-pointer">
                          <option value="">{t('signup', 'governoratePlaceholder')}</option>
                          {governorates.map((g, i) => <option key={i} value={g}>{td('governorates', g)}</option>)}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 1 — Choose Plan + Insurance Selection (paid only) */}
                {step === 1 && (
                  <motion.div key="step1" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-4">
                    <p className="text-goldLight/60 text-sm text-center mb-2">{t('signup', 'planLabel')}</p>
                    {['free', 'premium', 'elite'].map(p => {
                      const Icon = PLAN_ICONS[p]
                      const selected = form.plan === p
                      return (
                        <button key={p} type="button" onClick={() => { setForm({ ...form, plan: p }); setError('') }}
                          className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-right transition-all ${
                            selected ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/5 hover:border-gold/30'
                          }`}>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            selected ? 'bg-gold text-dark' : 'bg-white/10 text-goldLight'
                          }`}>
                            <Icon size={24} />
                          </div>
                          <div className="flex-1">
                            <p className={`font-bold text-sm ${selected ? 'text-gold' : 'text-goldLight'}`}>
                              {p === 'free' ? t('signup', 'freePlan') : p === 'premium' ? t('signup', 'premiumPlan') : t('signup', 'elitePlan')}
                            </p>
                            <p className="text-goldLight/40 text-xs mt-0.5">
                              {p === 'free' ? t('pricing', 'freeDesc') : p === 'premium' ? t('pricing', 'premiumDesc') : t('pricing', 'eliteDesc')}
                            </p>
                          </div>
                          <div className="text-left">
                            <p className="text-xl font-extrabold text-white">{PLAN_PRICES[p]}</p>
                            <p className="text-goldLight/40 text-xs">{t('pricing', 'egp')}</p>
                          </div>
                        </button>
                      )
                    })}

                    {/* Insurance selection — shown only for comprehensive (elite) plan */}
                    {isElite && (
                      <div className="pt-4 border-t border-gold/20 space-y-5">
                        <p className="text-goldLight/60 text-sm text-center">
                          {lang === 'ar' ? 'اختر مقدمي الخدمة للتأمين الطبي والمالي' : 'Choose your Medical and Financial Insurance providers'}
                        </p>

                        {/* ── Medical Insurance (dropdown) ── */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Stethoscope size={16} className="text-gold" />
                            <h3 className="font-bold text-white text-sm">
                              {lang === 'ar' ? 'التأمين الطبي' : 'Medical Insurance'}
                            </h3>
                          </div>
                          {medicalCenters.length === 0 ? (
                            <p className="text-goldLight/40 text-xs text-center py-4">
                              {lang === 'ar' ? 'لا توجد مراكز طبية متاحة في محافظتك' : 'No medical centers available in your governorate'}
                            </p>
                          ) : (
                            <div className="relative">
                              <Building2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50 pointer-events-none" />
                              <select name="medical_center_id" value={form.medical_center_id} onChange={handleChange}
                                className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark outline-none input-focus appearance-none cursor-pointer">
                                <option value="">{lang === 'ar' ? '-- اختر مركزاً طبياً --' : '-- Select a medical center --'}</option>
                                {medicalCenters.map(c => (
                                  <option key={c.id} value={c.id}>
                                    {td('companies', c.name)} — {c.city || c.governorate || ''}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>

                        {/* ── Financial Insurance (dropdown) ── */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Landmark size={16} className="text-gold" />
                            <h3 className="font-bold text-white text-sm">
                              {lang === 'ar' ? 'التأمين المالي' : 'Financial Insurance'}
                            </h3>
                          </div>
                          {banks.length === 0 ? (
                            <p className="text-goldLight/40 text-xs text-center py-4">
                              {lang === 'ar' ? 'لا توجد بنوك متاحة في محافظتك' : 'No banks available in your governorate'}
                            </p>
                          ) : (
                            <div className="relative">
                              <Landmark size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50 pointer-events-none" />
                              <select name="bank_id" value={form.bank_id} onChange={handleChange}
                                className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark outline-none input-focus appearance-none cursor-pointer">
                                <option value="">{lang === 'ar' ? '-- اختر بنكاً --' : '-- Select a bank --'}</option>
                                {banks.map(b => (
                                  <option key={b.id} value={b.id}>
                                    {td('companies', b.name)} — {b.city || b.governorate || ''}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </motion.div>
                )}

                {/* Step 2 — Payment Method */}
                {step === 2 && (
                  <motion.div key="step3" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-4">
                    {/* Plan summary */}
                    <div className="bg-gold/10 border border-gold/20 rounded-2xl p-4 text-center">
                      <p className="text-goldLight/60 text-xs">{t('signup', 'planLabel')}</p>
                      <p className="text-white font-bold text-lg">
                        {form.plan === 'free' ? t('signup', 'freePlan') : form.plan === 'premium' ? t('signup', 'premiumPlan') : t('signup', 'elitePlan')}
                      </p>
                      <p className="text-gold text-2xl font-extrabold">{PLAN_PRICES[form.plan]} <span className="text-sm font-normal text-goldLight/60">{t('pricing', 'egp')}</span></p>
                    </div>

                    {isPaidPlan && (
                      <>
                        <p className="text-goldLight/60 text-sm text-center">{t('signup', 'selectPayment')}</p>
                        {PAYMENT_METHODS.map(m => {
                          const Icon = m.icon
                          const selected = paymentMethod === m.id
                          return (
                            <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id)}
                              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-right transition-all ${
                                selected ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/5 hover:border-gold/30'
                              }`}>
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                                selected ? 'bg-gold text-dark' : 'bg-white/10 text-goldLight'
                              }`}>
                                <Icon size={22} />
                              </div>
                              <div className="flex-1">
                                <p className={`font-bold text-sm ${selected ? 'text-gold' : 'text-goldLight'}`}>
                                  {t('signup', m.nameKey)}
                                </p>
                                <p className="text-goldLight/40 text-xs mt-0.5">{t('signup', m.descKey)}</p>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selected ? 'border-gold bg-gold' : 'border-white/20'
                              }`}>
                                {selected && <Check size={12} className="text-dark" />}
                              </div>
                            </button>
                          )
                        })}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              )}

              {/* Error */}
              {!showOtpVerification && error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl py-3 mt-4">
                  {error}
                </motion.p>
              )}

              {/* Processing overlay */}
              {!showOtpVerification && processing && (
                <div className="flex flex-col items-center gap-3 mt-6 py-8">
                  <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
                  <p className="text-goldLight text-sm">{t('signup', 'processingPayment')}</p>
                </div>
              )}

              {/* Navigation buttons */}
              {!showOtpVerification && !processing && (
                <div className="flex items-center gap-3 mt-6">
                  {step > 0 && (
                    <button type="button" onClick={handleBack}
                      className="flex-1 bg-white/10 text-goldLight py-3.5 rounded-xl font-bold text-sm hover:bg-white/15 transition-all">
                      {t('signup', 'back')}
                    </button>
                  )}
                  {step < STEPS.length - 1 ? (
                    <button type="button" onClick={handleNext} disabled={!canGoNext()}
                      className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${
                        canGoNext()
                          ? 'bg-gradient-to-r from-gold to-[#a67c3d] text-dark hover:shadow-lg hover:shadow-gold/20'
                          : 'bg-white/10 text-goldLight/40 cursor-not-allowed'
                      }`}>
                      {t('signup', 'next')}
                    </button>
                  ) : (
                    <button type="button" onClick={handleSubmit}
                      disabled={isPaidPlan && !paymentMethod}
                      className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${
                        (!isPaidPlan || paymentMethod)
                          ? 'bg-gradient-to-r from-gold to-[#a67c3d] text-dark hover:shadow-lg hover:shadow-gold/20'
                          : 'bg-white/10 text-goldLight/40 cursor-not-allowed'
                      }`}>
                      {form.plan === 'free' ? t('signup', 'subscribeFree') : t('signup', 'subscribe')}
                    </button>
                  )}
                </div>
              )}

              <p className="text-center text-goldLight/50 text-sm mt-6">
                {t('signup', 'hasAccount')} <Link to="/login" className="text-gold hover:text-goldLight transition-colors font-semibold">{t('signup', 'loginLink')}</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
