import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { plansApi, subscriptionsApi } from '../endpoints'
import type { SubscriptionPlanCreatePayload, SubscriptionPlanUpdatePayload, SubscriptionCreatePayload } from '../../types'

export const planKeys = {
  all: ['plans'] as const,
  list: (params?: Record<string, any>) => ['plans', 'list', params] as const,
  detail: (id: string) => ['plans', 'detail', id] as const,
  features: (id: string) => ['plans', 'features', id] as const,
}

export const subKeys = {
  all: ['subscriptions'] as const,
  mine: () => ['subscriptions', 'mine'] as const,
  history: () => ['subscriptions', 'history'] as const,
}

export const usePlans = (params?: Record<string, any>) =>
  useQuery({
    queryKey: planKeys.list(params),
    queryFn: () => plansApi.list(params),
  })

export const usePlan = (id: string) =>
  useQuery({
    queryKey: planKeys.detail(id),
    queryFn: () => plansApi.getById(id),
    enabled: !!id,
  })

export const usePlanFeatures = (planId: string) =>
  useQuery({
    queryKey: planKeys.features(planId),
    queryFn: () => plansApi.getFeatures(planId),
    enabled: !!planId,
  })

export const useCreatePlan = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: SubscriptionPlanCreatePayload) => plansApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: planKeys.all }),
  })
}

export const useUpdatePlan = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubscriptionPlanUpdatePayload }) => plansApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: planKeys.detail(id) })
      qc.invalidateQueries({ queryKey: planKeys.all })
    },
  })
}

export const useDeletePlan = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => plansApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: planKeys.all }),
  })
}

export const useSetPlanFeatures = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ planId, featureIds }: { planId: string; featureIds: number[] }) =>
      plansApi.setFeatures(planId, featureIds),
    onSuccess: (_, { planId }) =>
      qc.invalidateQueries({ queryKey: planKeys.features(planId) }),
  })
}

export const useMySubscription = () =>
  useQuery({
    queryKey: subKeys.mine(),
    queryFn: () => subscriptionsApi.getMySubscription(),
  })

export const useSubscriptionHistory = () =>
  useQuery({
    queryKey: subKeys.history(),
    queryFn: () => subscriptionsApi.getHistory(),
  })

export const useAllSubscriptions = (params?: Record<string, any>) =>
  useQuery({
    queryKey: [...subKeys.all, params],
    queryFn: () => subscriptionsApi.getAll(params),
  })

export const useCreateSubscription = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: SubscriptionCreatePayload) => subscriptionsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subKeys.mine() })
      qc.invalidateQueries({ queryKey: subKeys.history() })
    },
  })
}

export const useCancelSubscription = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subKeys.mine() })
      qc.invalidateQueries({ queryKey: subKeys.history() })
    },
  })
}
