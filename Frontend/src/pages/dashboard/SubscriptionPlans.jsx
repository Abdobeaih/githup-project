import { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import BackButton from '../../components/BackButton'
import {
  getPlansWithFeatures, getPlans, getPlanFeatures, getFeatures,
  subscribe, getMySubscription
} from '../../services/subscriptionsService'
import { Crown, CheckCircle, Zap, Shield, AlertCircle, RefreshCw, CreditCard, Building2, QrCode, Smartphone, Check, X, ArrowLeft, Phone, Calendar, Hash, User, Landmark, Stethoscope, PiggyBank, MapPin, Star } from 'lucide-react'
import Modal from '../../components/Modal'
import { useNavigate } from 'react-router-dom'
import { PLAN_IDS } from '../../types/subscription'
import { enrollUserInService } from '../../data/db'
import { getMedicalCenters, getBanks } from '../../services/enrollmentService'

const planIcons = {
  free: Shield,
  premium: Zap,
  elite: Crown,
}

/** Static fallback plans — shown when the API and localStorage both fail. */
const FALLBACK_PLANS = [
  {
    id: PLAN_IDS.FREE,
    name: 'مجاني',
    price: 0,
    duration_months: 0,
    popular: false,
    is_active: true,
    features: ['الوصول إلى الخصومات', 'خصم واحد نشط', 'الوصول الأساسي للمنصة'],
  },
  {
    id: PLAN_IDS.PREMIUM,
    name: 'مميز',
    price: 99,
    duration_months: 1,
    popular: true,
    is_active: true,
    features: ['الوصول إلى الخصومات', 'خصومات غير محدودة', 'دعم فوري', 'تقارير الاستخدام', 'إشعارات فورية'],
  },
  {
    id: PLAN_IDS.ELITE,
    name: 'النخبة',
    price: 199,
    duration_months: 1,
    popular: false,
    is_active: true,
    features: [
      'الوصول إلى الخصومات',
      'خصومات غير محدودة',
      'دعم فوري',
      'تقارير الاستخدام',
      'إشعارات فورية',
      'مدير حساب مخصص',
      'تقارير متقدمة',
      'تكامل API',
      'لا إعلانات',
    ],
  },
]

export default function SubscriptionPlans() {
  const { t, lang } = useLanguage()
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [plans, setPlans] = useState(FALLBACK_PLANS)
  const [currentPlanId, setCurrentPlanId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)
  const [message, setMessage] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [paymentStep, setPaymentStep] = useState(0) // 0 = method selection, 1 = input form
  const [paymentDetails, setPaymentDetails] = useState({})

  // Service enrollment modal — shows plan details + both insurance dropdowns (elite only)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [medicalCenters, setMedicalCenters] = useState([])
  const [banks, setBanks] = useState([])
  const [selectedCenterId, setSelectedCenterId] = useState('')
  const [selectedBankId, setSelectedBankId] = useState('')

  const PAYMENT_METHODS = [
    {
      id: 'vodafone_cash', icon: Smartphone, nameAr: 'فودافون كاش', nameEn: 'Vodafone Cash',
      fields: [
        { name: 'phone', labelAr: 'رقم الهاتف (فودافون كاش)', labelEn: 'Phone Number (Vodafone Cash)', type: 'tel', icon: Phone, maxLength: 11, required: true },
      ],
    },
    {
      id: 'credit_card', icon: CreditCard, nameAr: 'بطاقة ائتمان', nameEn: 'Credit Card',
      fields: [
        { name: 'cardNumber', labelAr: 'رقم البطاقة', labelEn: 'Card Number', type: 'tel', icon: Hash, maxLength: 16, required: true },
        { name: 'expiryDate', labelAr: 'تاريخ الانتهاء', labelEn: 'Expiry Date', type: 'text', icon: Calendar, maxLength: 5, placeholder: 'MM/YY', required: true },
        { name: 'cvv', labelAr: 'رمز CVV', labelEn: 'CVV', type: 'tel', icon: Hash, maxLength: 4, required: true },
      ],
    },
    {
      id: 'bank_transfer', icon: Building2, nameAr: 'تحويل بنكي', nameEn: 'Bank Transfer',
      fields: [
        { name: 'bankName', labelAr: 'اسم البنك', labelEn: 'Bank Name', type: 'text', icon: Landmark, required: true },
        { name: 'accountNumber', labelAr: 'رقم الحساب', labelEn: 'Account Number', type: 'tel', icon: Hash, maxLength: 20, required: true },
        { name: 'accountHolder', labelAr: 'اسم صاحب الحساب', labelEn: 'Account Holder Name', type: 'text', icon: User, required: true },
      ],
    },
    {
      id: 'instapay', icon: QrCode, nameAr: 'إنستا باي', nameEn: 'InstaPay',
      fields: [
        { name: 'instapayId', labelAr: 'رقم الهاتف أو معرف InstaPay', labelEn: 'Phone Number or InstaPay ID', type: 'tel', icon: Phone, maxLength: 20, required: true },
      ],
    },
  ]

  const resetPaymentModal = () => {
    setSelectedPaymentMethod('')
    setPaymentStep(0)
    setPaymentDetails({})
    setShowPaymentModal(false)
  }

  const load = useCallback(async () => {
    setLoading(true)
    setMessage(null)
    let plansLoaded = false

    // Load plans (with features) and subscription in parallel
    const results = await Promise.allSettled([
      getPlansWithFeatures(),                         // single call, features pre-populated
      user?.id ? getMySubscription(user.id) : Promise.resolve(null),
    ])

    const [plansResult, subResult] = results

    // ── Plans ──
    if (plansResult.status === 'fulfilled') {
      const raw = plansResult.value?.data || []
      if (raw.length > 0) {
        // Normalise: ensure features is an array of feature-NAME strings,
        //           and that every plan has a usable id (string)
        const enriched = raw.map(plan => ({
          ...plan,
          id: plan.id || plan._id,
          features: (plan.features || [])
            .map(f => (typeof f === 'object' ? f?.name || '' : f))
            .filter(Boolean),
          // Keep the popular flag for the UI highlight
          popular: plan.popular ?? (plan.price > 0 && raw.indexOf(plan) === 1),
        }))
        setPlans(enriched)
        plansLoaded = true
      }
    }

    // ── Subscription ──
    if (subResult.status === 'fulfilled') {
      const sub = subResult.value?.data
      if (sub) {
        setCurrentPlanId(sub.plan_id || sub.planId)
      }
    }

    // Fallback if nothing loaded
    if (!plansLoaded) {
      setPlans(FALLBACK_PLANS)
      setMessage({ type: 'info', text: 'تم تحميل الباقات من البيانات المحلية' })
    }

    setLoading(false)
  }, [user?.id])

  useEffect(() => { load() }, [load])

  // Load medical centers + banks for the elite service modal
  useEffect(() => {
    async function loadProviders() {
      const [centers, bks] = await Promise.all([
        getMedicalCenters(),
        getBanks(),
      ])
      setMedicalCenters(centers)
      setBanks(bks)
    }
    loadProviders()
  }, [])

  const handleSubscribe = (planId) => {
    if (planId === currentPlanId) {
      setMessage({ type: 'info', text: 'أنت مشترك في هذه الباقة حاليًا' })
      return
    }
    if (!user?.id) {
      navigate(`/join?redirect=${encodeURIComponent('/subscriptions/plans')}`)
      return
    }
    const plan = plans.find(p => p.id === planId)
    if (!plan) return
    if (plan.id === PLAN_IDS.ELITE) {
      // Elite plan → show service modal with insurance dropdowns
      setSelectedCenterId('')
      setSelectedBankId('')
      setSelectedPlanId(planId)
      setShowServiceModal(true)
      return
    }
    if (plan.price > 0) {
      // Premium plan → go directly to payment
      setSelectedPlanId(planId)
      setSelectedPaymentMethod('')
      setPaymentStep(0)
      setPaymentDetails({})
      setShowPaymentModal(true)
      return
    }
    // Free plan — subscribe directly
    processSubscription(planId, 'CASH')
  }

  const processSubscription = async (planId, paymentMethod, details = {}) => {
    setSubscribing(true)
    setMessage(null)
    try {
      const res = await subscribe({ user_id: user.id, planId, payment_method: paymentMethod, payment_details: details })
      const data = res?.data
      if (data && !data.error) {
        setCurrentPlanId(planId)
        // Enroll in both medical + financial services only for elite plan with user's selections
        if (planId === PLAN_IDS.ELITE) {
          if (selectedCenterId) {
            enrollUserInService(user.id, { service_type: 'medical', center_id: selectedCenterId })
          }
          if (selectedBankId) {
            enrollUserInService(user.id, { service_type: 'financial', bank_id: selectedBankId })
          }
        }
        refreshUser() // sync AuthContext with upgraded plan + enrollment
        setMessage({ type: 'success', text: 'تم الاشتراك بنجاح! مرحباً بك في الباقة الجديدة' })
      } else {
        setMessage({ type: 'error', text: data?.error || 'حدث خطأ أثناء الاشتراك' })
      }
    } catch {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء الاشتراك' })
    } finally {
      setSubscribing(false)
    }
  }

  const handleMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId)
    setPaymentDetails({})
    setPaymentStep(1)
  }

  const handlePaymentDetailChange = (name, value) => {
    setPaymentDetails(prev => ({ ...prev, [name]: value }))
  }

  const handlePaymentConfirm = () => {
    if (!selectedPaymentMethod) return
    const method = PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod)
    // Validate required fields
    const allFilled = method.fields.every(f => paymentDetails[f.name]?.trim())
    if (!allFilled) return
    setShowPaymentModal(false)
    processSubscription(selectedPlanId, selectedPaymentMethod, paymentDetails)
  }

  return (
    <>
      <Helmet><title>باقات الاشتراك</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-dark mb-2">باقات الاشتراك</h1>
              <p className="text-dark/60">اختر الباقة المناسبة لاحتياجاتك</p>
            </div>

            {/* Message toast */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className={`mb-6 px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 ${
                  message.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
                  message.type === 'info' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                {message.type === 'success' ? <CheckCircle size={18} /> :
                 message.type === 'info' ? <AlertCircle size={18} /> :
                 <AlertCircle size={18} />}
                {message.text}
              </motion.div>
            )}

            {plans.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {plans.map((plan, i) => {
                  const Icon = planIcons[plan.id] || Crown
                  const isCurrent = currentPlanId === plan.id
                  const isFree = plan.price === 0
                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`bg-white rounded-2xl p-6 border shadow-sm transition-all hover:-translate-y-1 flex flex-col ${
                        plan.popular ? 'border-gold/40 ring-1 ring-gold/20 relative' : 'border-gold/10'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white px-4 py-1 rounded-full text-xs font-bold">
                          الأكثر طلباً
                        </div>
                      )}

                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        isFree ? 'bg-gray-100 text-gray-600' :
                        plan.popular ? 'bg-yellow-100 text-yellow-600' :
                        'bg-emerald-100 text-emerald-600'
                      }`}>
                        <Icon size={24} />
                      </div>

                      <h3 className="text-xl font-bold text-dark mb-1">{plan.name}</h3>

                      <div className="mb-6">
                        <span className="text-3xl font-extrabold text-dark">
                          {isFree ? 'مجانًا' : `${plan.price} ر.س`}
                        </span>
                        {!isFree && <span className="text-dark/40 text-sm"> /شهريًا</span>}
                      </div>

                      <ul className="space-y-3 mb-8 flex-1">
                        {(plan.features?.length > 0 ? plan.features : ['لا توجد مميزات محددة']).map((f, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-dark/60">
                            <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={subscribing || isCurrent}
                        className={`w-full py-3 rounded-xl text-sm font-bold transition-all mt-auto ${
                          isCurrent
                            ? 'bg-dark/10 text-dark/40 cursor-not-allowed'
                            : plan.popular
                              ? 'bg-dark text-white hover:bg-darkLight'
                              : 'bg-cream text-dark border border-gold/20 hover:bg-gold/10'
                        }`}
                      >
                        {isCurrent ? 'الباقة الحالية' : subscribing ? 'جاري...' : isFree ? 'البدء مجانًا' : 'اشتراك'}
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            ) : loading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gold/10 animate-pulse">
                    <div className="h-10 bg-gray-200 rounded-xl w-12 mb-4" />
                    <div className="h-5 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-8 bg-gray-200 rounded w-20 mb-6" />
                    <div className="space-y-2 mb-8">
                      {[1,2,3].map(j => <div key={j} className="h-4 bg-gray-200 rounded w-full" />)}
                    </div>
                    <div className="h-10 bg-gray-200 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={32} className="text-gold" />
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">لا توجد باقات متاحة</h3>
                <p className="text-dark/60 mb-6">عذراً، لا توجد باقات اشتراك متاحة حالياً. يرجى المحاولة لاحقاً.</p>
                <button
                  onClick={load}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-dark text-white rounded-xl text-sm font-bold hover:bg-darkLight transition-all"
                >
                  <RefreshCw size={16} />
                  إعادة المحاولة
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Service Enrollment Modal — Plan details + Insurance dropdowns (elite only) ── */}
      {(() => {
        const selectedPlan = plans.find(p => p.id === selectedPlanId)
        if (!selectedPlan) return null
        const canProceed = selectedCenterId && selectedBankId
        return (
          <Modal
            open={showServiceModal}
            onClose={() => setShowServiceModal(false)}
            title={lang === 'ar' ? 'اختيار مقدمي الخدمات التأمينية' : 'Choose Service Providers'}
            size="md"
          >
            <div className="space-y-5">
              {/* Plan details header */}
              <div className="p-4 rounded-2xl bg-dark/5 border border-dark/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-dark text-white flex items-center justify-center">
                    <Crown size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-dark text-lg">{selectedPlan.name}</p>
                    <p className="text-dark/60 text-sm">
                      {selectedPlan.price} ر.س {lang === 'ar' ? '/ شهريًا' : '/month'}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-dark/60 text-sm text-center">
                {lang === 'ar'
                  ? 'باقة النخبة تشمل التأمين الطبي والمالي. يرجى اختيار مقدمي الخدمة:'
                  : 'The Elite plan includes medical and financial insurance. Please select your providers:'}
              </p>

              {/* Medical insurance dropdown */}
              <div>
                <label className="block text-sm font-bold text-dark mb-2 flex items-center gap-2">
                  <Stethoscope size={18} className="text-emerald-600" />
                  {lang === 'ar' ? 'التأمين الطبي' : 'Medical Insurance'}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCenterId}
                  onChange={(e) => setSelectedCenterId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-dark/20 bg-cream/30 text-dark focus:outline-none focus:ring-2 focus:ring-gold/40 appearance-none cursor-pointer"
                >
                  <option value="">{lang === 'ar' ? '-- اختر مركزاً طبياً --' : '-- Select a medical center --'}</option>
                  {medicalCenters.map(c => (
                    <option key={c.id} value={c.id}>{c.name} - {c.governorate}</option>
                  ))}
                </select>
                {selectedCenterId && (
                  <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                    <CheckCircle size={12} />
                    {lang === 'ar' ? 'تم اختيار مقدم التأمين الطبي' : 'Medical insurance provider selected'}
                  </p>
                )}
              </div>

              {/* Financial insurance dropdown */}
              <div>
                <label className="block text-sm font-bold text-dark mb-2 flex items-center gap-2">
                  <PiggyBank size={18} className="text-amber-600" />
                  {lang === 'ar' ? 'التأمين المالي' : 'Financial Insurance'}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedBankId}
                  onChange={(e) => setSelectedBankId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-dark/20 bg-cream/30 text-dark focus:outline-none focus:ring-2 focus:ring-gold/40 appearance-none cursor-pointer"
                >
                  <option value="">{lang === 'ar' ? '-- اختر بنكاً --' : '-- Select a bank --'}</option>
                  {banks.map(b => (
                    <option key={b.id} value={b.id}>{b.name} - {b.governorate}</option>
                  ))}
                </select>
                {selectedBankId && (
                  <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                    <CheckCircle size={12} />
                    {lang === 'ar' ? 'تم اختيار مقدم التأمين المالي' : 'Financial insurance provider selected'}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="flex-1 border-2 border-dark/30 text-dark font-bold py-3 px-4 rounded-xl hover:bg-dark/5 transition-all"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  disabled={!canProceed}
                  onClick={() => {
                    setShowServiceModal(false)
                    setSelectedPaymentMethod('')
                    setPaymentStep(0)
                    setPaymentDetails({})
                    setShowPaymentModal(true)
                  }}
                  className={`flex-[2] font-bold py-3 px-4 rounded-xl transition-all ${
                    canProceed
                      ? 'bg-gradient-to-r from-dark to-darkLight text-white hover:shadow-lg hover:shadow-dark/20'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {lang === 'ar' ? 'متابعة إلى الدفع' : 'Continue to Payment'}
                </button>
              </div>
            </div>
          </Modal>
        )
      })()}

      {/* Payment Gateway Modal — Dark theme (second color) */}
      <Modal
        open={showPaymentModal}
        onClose={() => { if (!subscribing) resetPaymentModal() }}
        title={
          paymentStep === 0
            ? (lang === 'ar' ? 'اختيار طريقة الدفع' : 'Select Payment Method')
            : (lang === 'ar' ? 'بيانات الدفع' : 'Payment Details')
        }
        size="md"
      >
        {paymentStep === 0 ? (
          /* ── Step 1: Payment Method Selection ── */
          <div className="space-y-4">
            {/* Plan summary */}
            {(() => {
              const p = plans.find(pl => pl.id === selectedPlanId)
              if (!p) return null
              return (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-dark/5 border border-dark/10">
                  <div className="w-10 h-10 rounded-lg bg-dark text-white flex items-center justify-center shrink-0">
                    <Crown size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-dark text-sm">{p.name}</p>
                    <p className="text-dark/50 text-xs">{p.price} ر.س {lang === 'ar' ? '/ شهريًا' : '/month'}</p>
                  </div>
                </div>
              )
            })()}

            <p className="text-dark/60 text-sm text-center">
              {lang === 'ar' ? 'يرجى اختيار طريقة الدفع للمتابعة' : 'Please select a payment method to continue'}
            </p>

            <div className="space-y-3">
              {PAYMENT_METHODS.map(m => {
                const Icon = m.icon
                const selected = selectedPaymentMethod === m.id
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleMethodSelect(m.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-right transition-all ${
                      selected ? 'border-dark bg-dark/5' : 'border-dark/10 bg-cream/30 hover:border-dark/30'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      selected ? 'bg-dark text-white' : 'bg-dark/10 text-dark'
                    }`}>
                      <Icon size={22} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-sm ${selected ? 'text-dark' : 'text-dark'}`}>
                        {lang === 'ar' ? m.nameAr : m.nameEn}
                      </p>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-dark/20 flex items-center justify-center">
                      <ArrowLeft size={14} className="text-dark/40" />
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex gap-3 pt-4 border-t border-dark/10">
              <button
                type="button"
                onClick={resetPaymentModal}
                className="flex-1 border-2 border-dark/30 text-dark font-bold py-3 px-4 rounded-xl hover:bg-dark/5 transition-all"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        ) : (
          /* ── Step 2: Payment Method Input Form ── */
          (() => {
            const method = PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod)
            if (!method) return null
            const Icon = method.icon
            const allFilled = method.fields.every(f => paymentDetails[f.name]?.trim())
            const p = plans.find(pl => pl.id === selectedPlanId)

            return (
              <div className="space-y-5">
                {/* Plan summary */}
                {p && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-dark/5 border border-dark/10">
                    <div className="w-10 h-10 rounded-lg bg-dark text-white flex items-center justify-center shrink-0">
                      <Crown size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-dark text-sm">{p.name}</p>
                      <p className="text-dark/50 text-xs">{p.price} ر.س {lang === 'ar' ? '/ شهريًا' : '/month'}</p>
                    </div>
                  </div>
                )}

                {/* Method header */}
                <div className="flex items-center gap-3 p-4 bg-dark/5 rounded-xl border border-dark/10">
                  <button
                    type="button"
                    onClick={() => { setPaymentStep(0); setPaymentDetails({}) }}
                    className="p-1.5 rounded-lg hover:bg-dark/10 text-dark transition-all"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-dark/10 flex items-center justify-center text-dark">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-dark text-sm">
                      {lang === 'ar' ? method.nameAr : method.nameEn}
                    </p>
                    <p className="text-dark/40 text-xs">
                      {lang === 'ar' ? 'أدخل بيانات الدفع' : 'Enter payment details'}
                    </p>
                  </div>
                </div>

                {/* Input fields */}
                <div className="space-y-4">
                  {method.fields.map(f => {
                    const FieldIcon = f.icon
                    return (
                      <div key={f.name}>
                        <label className="block text-dark font-semibold mb-1.5 text-sm">
                          {lang === 'ar' ? f.labelAr : f.labelEn}
                          {f.required && <span className="text-red-500 mr-1">*</span>}
                        </label>
                        <div className="relative">
                          <FieldIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/50" size={18} />
                          <input
                            type={f.type}
                            value={paymentDetails[f.name] || ''}
                            onChange={(e) => {
                              let val = e.target.value
                              if (f.type === 'tel') val = val.replace(/\D/g, '')
                              if (f.name === 'expiryDate') {
                                val = val.replace(/[^0-9/]/g, '').slice(0, 5)
                                if (val.length === 2 && !val.includes('/')) val = val.slice(0, 2) + '/' + val.slice(2)
                              }
                              handlePaymentDetailChange(f.name, val)
                            }}
                            maxLength={f.maxLength || 100}
                            placeholder={f.placeholder || ''}
                            inputMode={f.type === 'tel' ? 'numeric' : 'text'}
                            className="w-full bg-cream border border-dark/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-dark/60 transition-all"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-dark/10">
                  <button
                    type="button"
                    onClick={() => { setPaymentStep(0); setPaymentDetails({}) }}
                    className="flex-1 border-2 border-dark/30 text-dark font-bold py-3 px-4 rounded-xl hover:bg-dark/5 transition-all"
                  >
                    {lang === 'ar' ? 'رجوع' : 'Back'}
                  </button>
                  <button
                    type="button"
                    onClick={handlePaymentConfirm}
                    disabled={!allFilled}
                    className={`flex-[2] font-bold py-3 px-4 rounded-xl transition-all ${
                      allFilled
                        ? 'bg-gradient-to-r from-dark to-darkLight text-white hover:shadow-lg hover:shadow-dark/20'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {lang === 'ar' ? 'تأكيد الاشتراك' : 'Confirm Subscription'}
                  </button>
                </div>
              </div>
            )
          })()
        )}
      </Modal>
    </>
  )
}
