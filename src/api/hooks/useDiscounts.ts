import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { discountsApi } from '../endpoints'
import type { DiscountCreatePayload, DiscountUpdatePayload, DiscountFilters, DiscountScan } from '../../types'

export const discountKeys = {
  all: ['discounts'] as const,
  list: (params?: DiscountFilters) => ['discounts', 'list', params] as const,
  detail: (id: number) => ['discounts', 'detail', id] as const,
  scans: (id: number) => ['discounts', 'scans', id] as const,
}

export const useDiscounts = (params?: DiscountFilters) =>
  useQuery({
    queryKey: discountKeys.list(params),
    queryFn: () => discountsApi.list(params),
  })

export const useDiscount = (id: number) =>
  useQuery({
    queryKey: discountKeys.detail(id),
    queryFn: () => discountsApi.getById(id),
    enabled: !!id,
  })

export const useDiscountScans = (id: number) =>
  useQuery({
    queryKey: discountKeys.scans(id),
    queryFn: () => discountsApi.getScans(id),
    enabled: !!id,
  })

export const useCreateDiscount = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: DiscountCreatePayload) => discountsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: discountKeys.all }),
  })
}

export const useUpdateDiscount = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DiscountUpdatePayload }) => discountsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: discountKeys.detail(id) })
      qc.invalidateQueries({ queryKey: discountKeys.all })
    },
  })
}

export const useDeleteDiscount = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => discountsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: discountKeys.all }),
  })
}

export const useApproveDiscount = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => discountsApi.approve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: discountKeys.all }),
  })
}

export const useRejectDiscount = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => discountsApi.reject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: discountKeys.all }),
  })
}

export const useRecordScan = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ discountId, data }: { discountId: number; data: Parameters<typeof discountsApi.recordScan>[1] }) =>
      discountsApi.recordScan(discountId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: discountKeys.all }),
  })
}

export const useIncrementViews = () =>
  useMutation({
    mutationFn: (id: number) => discountsApi.incrementViews(id),
  })
