import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { paymentsApi } from '../endpoints'
import type { PaymentCreatePayload, PaymentFilters } from '../../types'

export const paymentKeys = {
  all: ['payments'] as const,
  list: (params?: PaymentFilters) => ['payments', 'list', params] as const,
  detail: (id: string) => ['payments', 'detail', id] as const,
  mine: () => ['payments', 'mine'] as const,
  stats: () => ['payments', 'stats'] as const,
}

export const usePayments = (params?: PaymentFilters) =>
  useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: () => paymentsApi.list(params),
  })

export const usePayment = (id: string) =>
  useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => paymentsApi.getById(id),
    enabled: !!id,
  })

export const useMyPayments = () =>
  useQuery({
    queryKey: paymentKeys.mine(),
    queryFn: () => paymentsApi.getMyPayments(),
  })

export const usePaymentStats = () =>
  useQuery({
    queryKey: paymentKeys.stats(),
    queryFn: () => paymentsApi.getStats(),
  })

export const useCreatePayment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: PaymentCreatePayload) => paymentsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: paymentKeys.mine() })
      qc.invalidateQueries({ queryKey: paymentKeys.all })
    },
  })
}
