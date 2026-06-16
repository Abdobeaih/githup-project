import { useState, useEffect, useCallback } from 'react'
import {
  getPlansWithFeatures,
  getMySubscription,
  getLocalSubscription,
  peekPlansWithFeaturesCache,
} from '../services/subscriptionsService'
import { PLAN_IDS } from '../types/subscription'

export const FALLBACK_PLANS = [
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

export function normalizeSubscriptionPlans(raw) {
  return raw.map(plan => ({
    ...plan,
    id: plan.id || plan._id,
    features: (plan.features || [])
      .map(f => (typeof f === 'object' ? f?.name || '' : f))
      .filter(Boolean),
    popular: plan.popular ?? (plan.price > 0 && raw.indexOf(plan) === 1),
  }))
}

function readCachedPlans() {
  const cached = peekPlansWithFeaturesCache()
  return cached?.length ? normalizeSubscriptionPlans(cached) : null
}

/**
 * Stale-while-revalidate loader for /subscriptions/plans.
 * Shows cached plans + local subscription instantly, refreshes in background.
 */
export function useSubscriptionPlansData(userId) {
  const [plans, setPlans] = useState(() => readCachedPlans() || FALLBACK_PLANS)
  const [currentPlanId, setCurrentPlanId] = useState(() => {
    const sub = getLocalSubscription(userId)
    return sub?.plan_id || sub?.planId || null
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const load = useCallback(async (forceRefresh = false) => {
    const hasCachedPlans = !forceRefresh && !!peekPlansWithFeaturesCache()?.length
    if (forceRefresh) setLoading(true)
    setMessage(null)

    let plansLoaded = hasCachedPlans

    const [plansResult, subResult] = await Promise.allSettled([
      getPlansWithFeatures({ forceRefresh }),
      userId ? getMySubscription(userId) : Promise.resolve({ data: null }),
    ])

    if (plansResult.status === 'fulfilled') {
      const raw = plansResult.value?.data || []
      if (raw.length > 0) {
        setPlans(normalizeSubscriptionPlans(raw))
        plansLoaded = true
      }
    }

    if (subResult.status === 'fulfilled') {
      const sub = subResult.value?.data
      if (sub) setCurrentPlanId(sub.plan_id || sub.planId)
    }

    if (!plansLoaded) {
      setPlans(FALLBACK_PLANS)
      setMessage({ type: 'info', text: 'تم تحميل الباقات من البيانات المحلية' })
    }

    setLoading(false)
  }, [userId])

  useEffect(() => {
    load()
  }, [load])

  return {
    plans,
    currentPlanId,
    setCurrentPlanId,
    loading,
    message,
    setMessage,
    reload: () => load(true),
  }
}
