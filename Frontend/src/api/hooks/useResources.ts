import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsApi, enrollmentsApi, installmentsApi, cardsApi, analyticsApi, featuresApi } from '../endpoints'
import type { ReviewCreatePayload, SocialReviewCreatePayload, EnrollmentCreatePayload, EnrollmentConfirmPayload, InstallmentCreatePayload, InstallmentPayPayload, CardCreatePayload } from '../../types'

// ─── Reviews ─────────────────────────────────────────
export const reviewKeys = {
  all: ['reviews'] as const,
  list: (discountId: number) => ['reviews', 'list', discountId] as const,
  social: (targetType: string, targetId: string | number) => ['reviews', 'social', targetType, targetId] as const,
}

export const useReviews = (discountId: number) =>
  useQuery({
    queryKey: reviewKeys.list(discountId),
    queryFn: () => reviewsApi.list(discountId),
    enabled: !!discountId,
  })

export const useAllReviews = () =>
  useQuery({
    queryKey: reviewKeys.all,
    queryFn: () => reviewsApi.getAll(),
  })

export const useCreateReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ReviewCreatePayload) => reviewsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: reviewKeys.all }),
  })
}

export const useDeleteReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => reviewsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: reviewKeys.all }),
  })
}

export const useSocialReviews = (targetType: string, targetId: string | number) =>
  useQuery({
    queryKey: reviewKeys.social(targetType, targetId),
    queryFn: () => reviewsApi.socialList(targetType, targetId),
    enabled: !!targetType && !!targetId,
  })

export const useCreateSocialReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: SocialReviewCreatePayload) => reviewsApi.socialCreate(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: reviewKeys.all }),
  })
}

// ─── Enrollments (Insurance) ─────────────────────────
export const enrollmentKeys = {
  all: ['enrollments'] as const,
  mine: () => ['enrollments', 'mine'] as const,
}

export const useMyEnrollments = () =>
  useQuery({
    queryKey: enrollmentKeys.mine(),
    queryFn: () => enrollmentsApi.getMyEnrollments(),
  })

export const useAllEnrollments = () =>
  useQuery({
    queryKey: enrollmentKeys.all,
    queryFn: () => enrollmentsApi.list(),
  })

export const useEnrollInService = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: EnrollmentCreatePayload) => enrollmentsApi.enroll(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: enrollmentKeys.mine() }),
  })
}

export const useConfirmEnrollment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: EnrollmentConfirmPayload) => enrollmentsApi.confirm(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: enrollmentKeys.all }),
  })
}

export const useMedicalCenters = (params?: Record<string, any>) =>
  useQuery({
    queryKey: ['medicalCenters', params],
    queryFn: () => enrollmentsApi.getMedicalCenters(params),
  })

export const useBanks = (params?: Record<string, any>) =>
  useQuery({
    queryKey: ['banks', params],
    queryFn: () => enrollmentsApi.getBanks(params),
  })

// ─── Installments ────────────────────────────────────
export const installmentKeys = {
  all: ['installments'] as const,
  mine: () => ['installments', 'mine'] as const,
}

export const useMyInstallments = () =>
  useQuery({
    queryKey: installmentKeys.mine(),
    queryFn: () => installmentsApi.getMyInstallments(),
  })

export const useCreateInstallment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: InstallmentCreatePayload) => installmentsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: installmentKeys.all }),
  })
}

export const usePayInstallment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: InstallmentPayPayload }) => installmentsApi.pay(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: installmentKeys.mine() }),
  })
}

// ─── Cards ───────────────────────────────────────────
export const cardKeys = {
  mine: () => ['cards', 'mine'] as const,
}

export const useMyCards = () =>
  useQuery({
    queryKey: cardKeys.mine(),
    queryFn: () => cardsApi.getMyCards(),
  })

export const useSaveCard = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CardCreatePayload) => cardsApi.save(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: cardKeys.mine() }),
  })
}

export const useDeleteCard = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => cardsApi.delete(userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: cardKeys.mine() }),
  })
}

// ─── Analytics ───────────────────────────────────────
export const analyticsKeys = {
  dashboard: () => ['analytics', 'dashboard'] as const,
  revenue: () => ['analytics', 'revenue'] as const,
  company: (id: string) => ['analytics', 'company', id] as const,
}

export const useDashboardStats = () =>
  useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: () => analyticsApi.getDashboardStats(),
  })

export const useRevenueDetails = () =>
  useQuery({
    queryKey: analyticsKeys.revenue(),
    queryFn: () => analyticsApi.getRevenueDetails(),
  })

export const useCompanyAnalytics = (companyId: string) =>
  useQuery({
    queryKey: analyticsKeys.company(companyId),
    queryFn: () => analyticsApi.getCompanyAnalytics(companyId),
    enabled: !!companyId,
  })

// ─── Features ────────────────────────────────────────
export const featureKeys = {
  all: ['features'] as const,
}

export const useFeatures = () =>
  useQuery({
    queryKey: featureKeys.all,
    queryFn: () => featuresApi.list(),
  })

export const useCreateFeature = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; key: string }) => featuresApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: featureKeys.all }),
  })
}

export const useUpdateFeature = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name?: string; key?: string } }) => featuresApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: featureKeys.all }),
  })
}

export const useDeleteFeature = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => featuresApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: featureKeys.all }),
  })
}
