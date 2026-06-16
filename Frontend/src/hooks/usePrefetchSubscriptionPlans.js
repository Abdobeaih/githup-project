/**
 * Prefetch the Packages page bundle and plans API data on hover.
 * Reduces perceived latency when the user navigates to /subscriptions/plans or /pricing.
 */
import { useCallback } from 'react'
import { prefetchPlansWithFeatures } from '../services/subscriptionsService'

export function usePrefetchSubscriptionPlans() {
  return useCallback(() => {
    import('../pages/dashboard/SubscriptionPlans.jsx').catch(() => {})

    prefetchPlansWithFeatures().catch(() => {})
  }, [])
}

export function usePrefetchPricing() {
  return useCallback(() => {
    import('../pages/Pricing.jsx').catch(() => {})

    prefetchPlansWithFeatures().catch(() => {})
  }, [])
}
