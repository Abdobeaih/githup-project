import { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import BackButton from '../../components/BackButton'
import { getMySubscription, getLocalSubscription, cancelSubscription } from '../../services/subscriptionsService'
import { Crown, Calendar, CreditCard, AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  SUBSCRIPTION_STATUS,
  SUBSCRIPTION_STATUS_LABELS,
  SUBSCRIPTION_STATUS_COLORS,
} from '../../types/subscription'

const statusIcons = {
  [SUBSCRIPTION_STATUS.ACTIVE]: CheckCircle,
  [SUBSCRIPTION_STATUS.CANCELLED]: XCircle,
  [SUBSCRIPTION_STATUS.EXPIRED]: XCircle,
  [SUBSCRIPTION_STATUS.PENDING]: RefreshCw,
}

function formatDate(dateStr) {
  if (!dateStr) return 'غير محدد'
  try {
    return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dateStr
  }
}

function isExpired(endDate) {
  if (!endDate) return false
  return new Date(endDate) < new Date()
}

export default function MySubscription() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [sub, setSub] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  const fetchSub = useCallback(async () => {
    if (!user?.id) return
    const local = getLocalSubscription(user.id)
    if (local) {
      const data = { ...local }
      if (data.status === SUBSCRIPTION_STATUS.ACTIVE && isExpired(data.end_date)) {
        data.status = SUBSCRIPTION_STATUS.EXPIRED
      }
      setSub(data)
      setLoading(false)
    } else {
      setLoading(true)
    }
    try {
      const res = await getMySubscription(user.id, { preferLocal: false })
      const data = res?.data || null
      if (data) {
        if (data.status === SUBSCRIPTION_STATUS.ACTIVE && isExpired(data.end_date)) {
          data.status = SUBSCRIPTION_STATUS.EXPIRED
        }
        setSub(data)
      } else if (!local) {
        setSub(null)
      }
    } catch {
      if (!local) setSub(null)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchSub()
  }, [fetchSub])

  const handleCancel = async () => {
    if (!window.confirm('هل أنت متأكد من إلغاء الاشتراك؟')) return
    setCancelling(true)
    try {
      const res = await cancelSubscription(sub.id)
      if (res?.data) {
        setSub(prev => ({ ...prev, status: SUBSCRIPTION_STATUS.CANCELLED, cancelled_at: new Date().toISOString() }))
      }
    } finally {
      setCancelling(false)
    }
  }

  // ── Loading skeleton ──
  if (loading) {
    return (
      <>
        <Helmet><title>اشتراكي</title></Helmet>
        <section className="pt-28 pb-20 bg-cream min-h-screen">
          <div className="container mx-auto px-6">
            <BackButton />
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-48" />
              <div className="bg-white rounded-2xl p-8 border border-gold/10">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-64" />
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  const StatusIcon = sub ? statusIcons[sub.status] || Crown : Crown

  return (
    <>
      <Helmet><title>اشتراكي</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-dark mb-8">اشتراكي</h1>

            {!sub ? (
              // ── No subscription ──
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-16 border border-gold/10 shadow-sm text-center"
              >
                <Crown className="text-gold/30 mx-auto mb-4" size={64} />
                <p className="text-dark/50 text-lg mb-2">ليس لديك اشتراك نشط</p>
                <p className="text-dark/30 text-sm mb-6">اشترك في إحدى باقاتنا للاستفادة من الميزات الحصرية</p>
                <button onClick={() => navigate('/subscriptions/plans')}
                  className="bg-dark text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-darkLight transition-all">
                  عرض الباقات
                </button>
              </motion.div>
            ) : (
              // ── Active subscription ──
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl overflow-hidden border border-gold/10 shadow-sm"
              >
                {/* Header */}
                <div className="bg-gradient-to-l from-dark to-darkLight p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{sub.plan?.name || 'الباقة الحالية'}</h2>
                      <p className="text-white/60 text-sm">الباقة الحالية</p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${SUBSCRIPTION_STATUS_COLORS[sub.status] || 'bg-gray-100 text-gray-600'}`}
                      style={sub.status === SUBSCRIPTION_STATUS.ACTIVE ? { backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981' } : {}}>
                      <StatusIcon size={16} />
                      {SUBSCRIPTION_STATUS_LABELS[sub.status] || sub.status}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-8 space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 bg-cream rounded-xl p-4">
                      <Calendar size={20} className="text-gold shrink-0" />
                      <div>
                        <p className="text-dark/50 text-xs">تاريخ البدء</p>
                        <p className="text-dark font-bold text-sm">{formatDate(sub.start_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-cream rounded-xl p-4">
                      <Calendar size={20} className="text-gold shrink-0" />
                      <div>
                        <p className="text-dark/50 text-xs">تاريخ الانتهاء</p>
                        <p className="text-dark font-bold text-sm">{formatDate(sub.end_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-cream rounded-xl p-4">
                      <CreditCard size={20} className="text-gold shrink-0" />
                      <div>
                        <p className="text-dark/50 text-xs">سعر الباقة</p>
                        <p className="text-dark font-bold text-sm">{sub.plan?.price || 0} ر.س</p>
                      </div>
                    </div>
                  </div>

                  {/* Features list */}
                  {sub.plan && (
                    <div>
                      <h3 className="font-bold text-dark mb-3">مميزات الباقة</h3>
                      <div className="grid md:grid-cols-2 gap-2">
                        {sub.plan.features?.length > 0 ? sub.plan.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-dark/60">
                            <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                            {f.name || f}
                          </div>
                        )) : (
                          <p className="text-dark/40 text-sm">لا توجد مميزات محددة</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cancel section */}
                  {sub.status === SUBSCRIPTION_STATUS.ACTIVE && (
                    <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 flex items-start gap-3 mt-6">
                      <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-amber-700 font-bold">إلغاء الاشتراك</p>
                        <p className="text-xs text-amber-600 mt-1">سيتم إلغاء الاشتراك ولن يتم تجديده في نهاية الدورة الحالية</p>
                      </div>
                      <button onClick={handleCancel} disabled={cancelling}
                        className="bg-red-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-red-600 transition-all shrink-0 disabled:opacity-50">
                        {cancelling ? 'جاري...' : 'إلغاء'}
                      </button>
                    </div>
                  )}

                  {/* Expired info */}
                  {sub.status === SUBSCRIPTION_STATUS.EXPIRED && (
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 flex items-start gap-3 mt-6">
                      <AlertCircle size={20} className="text-gray-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 font-bold">الاشتراك منتهي</p>
                        <p className="text-xs text-gray-600 mt-1">انتهت صلاحية اشتراكك. جدد الآن للاستفادة من الميزات</p>
                      </div>
                      <button onClick={() => navigate('/subscriptions/plans')}
                        className="bg-dark text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-darkLight transition-all shrink-0">
                        تجديد
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}
