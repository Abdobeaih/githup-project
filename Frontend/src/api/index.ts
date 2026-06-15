export { api, handleApiError } from './axios'
export {
  authApi, usersApi, companiesApi, discountsApi,
  plansApi, subscriptionsApi, paymentsApi,
  notificationsApi, reviewsApi, enrollmentsApi,
  installmentsApi, cardsApi, featuresApi, analyticsApi,
} from './endpoints'
export {
  useUsers, useUser, useUserStats,
  useCreateUser, useUpdateUser, useDeleteUser,
} from './hooks/useUsers'
export {
  useCompanies, useCompany, useCompanyStats,
  useCreateCompany, useUpdateCompany, useDeleteCompany,
  useApproveCompany, useRejectCompany,
  useCompanyBranches, useCreateBranch, useDeleteBranch,
} from './hooks/useCompanies'
export {
  useDiscounts, useDiscount, useDiscountScans,
  useCreateDiscount, useUpdateDiscount, useDeleteDiscount,
  useApproveDiscount, useRejectDiscount,
  useRecordScan, useIncrementViews,
} from './hooks/useDiscounts'
export {
  usePlans, usePlan, usePlanFeatures,
  useCreatePlan, useUpdatePlan, useDeletePlan, useSetPlanFeatures,
  useMySubscription, useSubscriptionHistory, useAllSubscriptions,
  useCreateSubscription, useCancelSubscription,
} from './hooks/useSubscriptions'
export {
  usePayments, usePayment, useMyPayments, usePaymentStats, useCreatePayment,
} from './hooks/usePayments'
export {
  useNotifications, useUnreadCount,
  useCreateNotification, useMarkNotificationRead,
  useMarkAllNotificationsRead, useDeleteNotification,
  useNotificationPreferences, useUpdateNotificationPreferences,
} from './hooks/useNotifications'
export {
  useReviews, useAllReviews, useCreateReview, useDeleteReview,
  useSocialReviews, useCreateSocialReview,
  useMyEnrollments, useAllEnrollments,
  useEnrollInService, useConfirmEnrollment,
  useMedicalCenters, useBanks,
  useMyInstallments, useCreateInstallment, usePayInstallment,
  useMyCards, useSaveCard, useDeleteCard,
  useDashboardStats, useRevenueDetails, useCompanyAnalytics,
  useFeatures, useCreateFeature, useUpdateFeature, useDeleteFeature,
} from './hooks/useResources'
