import { useState, useCallback, lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import BackButton from '../../components/BackButton'
import PlanCard from '../../components/PlanCard'
import { subscribe } from '../../services/subscriptionsService'
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PLAN_IDS } from '../../types/subscription'
import { enrollUserInService } from '../../data/db'
import { getMedicalCenters, getBanks } from '../../services/enrollmentService'
import { useSubscriptionPlansData } from '../../hooks/useSubscriptionPlansData'

const SubscriptionPlansModals = lazy(() => import('../../components/SubscriptionPlansModals'))

export default function SubscriptionPlans() {
  const { lang } = useLanguage()
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const {
    plans,
    currentPlanId,
    setCurrentPlanId,
    loading,
    message,
    setMessage,
    reload,
  } = useSubscriptionPlansData(user?.id)

  const [subscribing, setSubscribing] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [paymentStep, setPaymentStep] = useState(0)
  const [paymentDetails, setPaymentDetails] = useState({})
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [medicalCenters, setMedicalCenters] = useState([])
  const [banks, setBanks] = useState([])
  const [selectedCenterId, setSelectedCenterId] = useState('')
  const [selectedBankId, setSelectedBankId] = useState('')

  const resetPaymentModal = useCallback(() => {
    setSelectedPaymentMethod('')
    setPaymentStep(0)
    setPaymentDetails({})
    setShowPaymentModal(false)
  }, [])

  const loadProvidersForEliteModal = useCallback(async () => {
    if (medicalCenters.length > 0 && banks.length > 0) return
    const [centers, bks] = await Promise.all([getMedicalCenters(), getBanks()])
    setMedicalCenters(centers)
    setBanks(bks)
  }, [medicalCenters.length, banks.length])

  const processSubscription = useCallback(async (planId, paymentMethod, details = {}) => {
    setSubscribing(true)
    setMessage(null)
    try {
      const res = await subscribe({ user_id: user.id, planId, payment_method: paymentMethod, payment_details: details })
      const data = res?.data
      if (data && !data.error) {
        setCurrentPlanId(planId)
        if (planId === PLAN_IDS.ELITE) {
          if (selectedCenterId) {
            enrollUserInService(user.id, { service_type: 'medical', center_id: selectedCenterId })
          }
          if (selectedBankId) {
            enrollUserInService(user.id, { service_type: 'financial', bank_id: selectedBankId })
          }
        }
        refreshUser()
        setMessage({ type: 'success', text: 'تم الاشتراك بنجاح! مرحباً بك في الباقة الجديدة' })
      } else {
        setMessage({ type: 'error', text: data?.error || 'حدث خطأ أثناء الاشتراك' })
      }
    } catch {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء الاشتراك' })
    } finally {
      setSubscribing(false)
    }
  }, [user.id, selectedCenterId, selectedBankId, refreshUser, setCurrentPlanId, setMessage])

  const handleSubscribe = useCallback((planId) => {
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
      setSelectedCenterId('')
      setSelectedBankId('')
      setSelectedPlanId(planId)
      setShowServiceModal(true)
      loadProvidersForEliteModal()
      return
    }
    if (plan.price > 0) {
      setSelectedPlanId(planId)
      setSelectedPaymentMethod('')
      setPaymentStep(0)
      setPaymentDetails({})
      setShowPaymentModal(true)
      return
    }
    processSubscription(planId, 'CASH')
  }, [currentPlanId, user?.id, navigate, plans, loadProvidersForEliteModal, processSubscription, setMessage])

  const handlePaymentConfirm = useCallback(() => {
    if (!selectedPaymentMethod) return
    const methodFields = {
      vodafone_cash: ['phone'],
      credit_card: ['cardNumber', 'expiryDate', 'cvv'],
      bank_transfer: ['bankName', 'accountNumber', 'accountHolder'],
      instapay: ['instapayId'],
    }
    const required = methodFields[selectedPaymentMethod] || []
    if (!required.every(f => paymentDetails[f]?.trim())) return
    setShowPaymentModal(false)
    processSubscription(selectedPlanId, selectedPaymentMethod, paymentDetails)
  }, [selectedPaymentMethod, paymentDetails, selectedPlanId, processSubscription])

  const modalsOpen = showPaymentModal || showServiceModal

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

            {loading ? (
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gold/10 animate-pulse">
                    <div className="h-10 bg-gray-200 rounded-xl w-12 mb-4" />
                    <div className="h-5 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-8 bg-gray-200 rounded w-20 mb-6" />
                    <div className="space-y-2 mb-8">
                      {[1, 2, 3].map(j => <div key={j} className="h-4 bg-gray-200 rounded w-full" />)}
                    </div>
                    <div className="h-10 bg-gray-200 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : plans.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {plans.map((plan, i) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    index={i}
                    isCurrent={currentPlanId === plan.id}
                    subscribing={subscribing}
                    onSubscribe={handleSubscribe}
                  />
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
                  onClick={reload}
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

      {modalsOpen && (
        <Suspense fallback={null}>
          <SubscriptionPlansModals
            lang={lang}
            plans={plans}
            selectedPlanId={selectedPlanId}
            showServiceModal={showServiceModal}
            showPaymentModal={showPaymentModal}
            subscribing={subscribing}
            paymentStep={paymentStep}
            selectedPaymentMethod={selectedPaymentMethod}
            paymentDetails={paymentDetails}
            medicalCenters={medicalCenters}
            banks={banks}
            selectedCenterId={selectedCenterId}
            selectedBankId={selectedBankId}
            onCloseServiceModal={() => setShowServiceModal(false)}
            onClosePaymentModal={() => { if (!subscribing) resetPaymentModal() }}
            onSelectCenter={setSelectedCenterId}
            onSelectBank={setSelectedBankId}
            onContinueToPayment={() => {
              setShowServiceModal(false)
              setSelectedPaymentMethod('')
              setPaymentStep(0)
              setPaymentDetails({})
              setShowPaymentModal(true)
            }}
            onMethodSelect={(methodId) => {
              setSelectedPaymentMethod(methodId)
              setPaymentDetails({})
              setPaymentStep(1)
            }}
            onPaymentDetailChange={(name, value) => {
              setPaymentDetails(prev => ({ ...prev, [name]: value }))
            }}
            onPaymentConfirm={handlePaymentConfirm}
            onPaymentBack={() => { setPaymentStep(0); setPaymentDetails({}) }}
          />
        </Suspense>
      )}
    </>
  )
}
