import api from './axios'
import type {
  User, UserCreatePayload, UserUpdatePayload,
  Company, CompanyCreatePayload, CompanyUpdatePayload,
  CompanyBranch, CompanyBranchCreatePayload,
  Discount, DiscountCreatePayload, DiscountUpdatePayload, DiscountFilters, DiscountScan,
  Payment, PaymentCreatePayload, PaymentFilters,
  Notification, NotificationCreatePayload, NotificationFilters,
  Review, ReviewCreatePayload, SocialReview, SocialReviewCreatePayload,
  Enrollment, EnrollmentCreatePayload, EnrollmentConfirmPayload,
  Installment, InstallmentCreatePayload, InstallmentPayPayload,
  Card, CardCreatePayload,
  MedicalCenter, Bank,
  ApiResponse, PaginatedResponse,
} from '../types'
import type { SubscriptionPlan, SubscriptionPlanCreatePayload, SubscriptionPlanUpdatePayload, UserSubscription, SubscriptionCreatePayload } from '../types/subscription'

// ─── Auth ────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ user: User; token: string; role: string }>>('/auth/login', { email, password }),
  signup: (data: UserCreatePayload) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<ApiResponse<User>>('/auth/me'),
  refreshToken: () => api.post<ApiResponse<{ token: string }>>('/auth/refresh'),

  // Email verification
  sendSignupOtp: (email: string, name: string, role?: string) =>
    api.post<ApiResponse<{ message: string }>>('/auth/send-signup-otp', { email, name, role }),
  verifyEmail: (email: string, code: string, role?: string) =>
    api.post<ApiResponse<{ message: string }>>('/auth/verify-email', { email, code, role }),

  // Forgot password
  forgotPassword: (email: string, role: string) =>
    api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', { email, role }),
  verifyOtp: (email: string, role: string, code: string) =>
    api.post<ApiResponse<{ message: string }>>('/auth/verify-otp', { email, role, code }),
  resetPassword: (email: string, password: string, role: string) =>
    api.put<ApiResponse<{ message: string }>>('/auth/reset-password', { email, password, role }),
}

// ─── Users ───────────────────────────────────────────
export const usersApi = {
  list: (params?: { page?: number; limit?: number; search?: string; plan?: string }) =>
    api.get<PaginatedResponse<User>>('/users', { params }),
  getById: (id: string) => api.get<ApiResponse<User>>(`/users/${id}`),
  create: (data: UserCreatePayload) => api.post<ApiResponse<User>>('/users', data),
  update: (id: string, data: UserUpdatePayload) => api.put<ApiResponse<User>>(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  getStats: () => api.get<ApiResponse<{ total: number; active: number; byPlan: Record<string, number> }>>('/users/stats'),
}

// ─── Companies ───────────────────────────────────────
export const companiesApi = {
  list: (params?: { page?: number; limit?: number; search?: string; category?: string; status?: string }) =>
    api.get<PaginatedResponse<Company>>('/companies', { params }),
  getById: (id: string) => api.get<ApiResponse<Company>>(`/companies/${id}`),
  create: (data: CompanyCreatePayload) => api.post<ApiResponse<Company>>('/companies', data),
  update: (id: string, data: CompanyUpdatePayload) => api.put<ApiResponse<Company>>(`/companies/${id}`, data),
  delete: (id: string) => api.delete(`/companies/${id}`),
  approve: (id: string) => api.patch<ApiResponse<Company>>(`/companies/${id}/approve`),
  reject: (id: string) => api.patch<ApiResponse<Company>>(`/companies/${id}/reject`),
  getStats: () => api.get<ApiResponse<{ total: number; pending: number; approved: number; byCategory: Record<string, number> }>>('/companies/stats'),

  branches: {
    list: (companyId: string) => api.get<ApiResponse<CompanyBranch[]>>(`/companies/${companyId}/branches`),
    create: (companyId: string, data: CompanyBranchCreatePayload) =>
      api.post<ApiResponse<CompanyBranch>>(`/companies/${companyId}/branches`, data),
    update: (branchId: string, data: Partial<CompanyBranchCreatePayload>) =>
      api.put<ApiResponse<CompanyBranch>>(`/branches/${branchId}`, data),
    delete: (branchId: string) => api.delete(`/branches/${branchId}`),
  },
}

// ─── Discounts ───────────────────────────────────────
export const discountsApi = {
  list: (params?: DiscountFilters) =>
    api.get<PaginatedResponse<Discount>>('/discounts', { params }),
  getById: (id: number) => api.get<ApiResponse<Discount>>(`/discounts/${id}`),
  create: (data: DiscountCreatePayload) => api.post<ApiResponse<Discount>>('/discounts', data),
  update: (id: number, data: DiscountUpdatePayload) => api.put<ApiResponse<Discount>>(`/discounts/${id}`, data),
  delete: (id: number) => api.delete(`/discounts/${id}`),
  approve: (id: number) => api.patch<ApiResponse<Discount>>(`/discounts/${id}/approve`),
  reject: (id: number) => api.patch<ApiResponse<Discount>>(`/discounts/${id}/reject`),
  getScans: (id: number) => api.get<ApiResponse<DiscountScan[]>>(`/discounts/${id}/scans`),
  recordScan: (discountId: number, data: { userId: string; product?: string; priceAfterDiscount?: number; amountPaid?: number; last4Digits?: string }) =>
    api.post<ApiResponse<DiscountScan>>(`/discounts/${discountId}/scan`, data),
  incrementViews: (id: number) => api.patch(`/discounts/${id}/views`),
}

// ─── Subscription Plans ─────────────────────────────
export const plansApi = {
  list: (params?: { is_active?: boolean }) =>
    api.get<ApiResponse<SubscriptionPlan[]>>('/plans', { params }),
  getById: (id: string) => api.get<ApiResponse<SubscriptionPlan>>(`/plans/${id}`),
  create: (data: SubscriptionPlanCreatePayload) => api.post<ApiResponse<SubscriptionPlan>>('/plans', data),
  update: (id: string, data: SubscriptionPlanUpdatePayload) => api.put<ApiResponse<SubscriptionPlan>>(`/plans/${id}`, data),
  delete: (id: string) => api.delete(`/plans/${id}`),
  getFeatures: (planId: string) => api.get<ApiResponse<any[]>>(`/plans/${planId}/features`),
  setFeatures: (planId: string, featureIds: number[]) =>
    api.put(`/plans/${planId}/features`, { featureIds }),
}

// ─── User Subscriptions ─────────────────────────────
export const subscriptionsApi = {
  getMySubscription: () => api.get<ApiResponse<UserSubscription>>('/subscriptions/me'),
  getHistory: () => api.get<ApiResponse<UserSubscription[]>>('/subscriptions/history'),
  create: (data: SubscriptionCreatePayload) => api.post<ApiResponse<UserSubscription>>('/subscriptions', data),
  cancel: (id: string) => api.post(`/subscriptions/${id}/cancel`),
  getAll: (params?: { status?: string }) =>
    api.get<ApiResponse<UserSubscription[]>>('/subscriptions', { params }),
}

// ─── Payments ────────────────────────────────────────
export const paymentsApi = {
  list: (params?: PaymentFilters) =>
    api.get<PaginatedResponse<Payment>>('/payments', { params }),
  getById: (id: string) => api.get<ApiResponse<Payment>>(`/payments/${id}`),
  create: (data: PaymentCreatePayload) => api.post<ApiResponse<Payment>>('/payments', data),
  getMyPayments: () => api.get<ApiResponse<Payment[]>>('/payments/me'),
  getStats: () => api.get<ApiResponse<{ total: number; byMethod: Record<string, number>; byStatus: Record<string, number> }>>('/payments/stats'),
}

// ─── Notifications ──────────────────────────────────
export const notificationsApi = {
  list: (params?: NotificationFilters) =>
    api.get<PaginatedResponse<Notification>>('/notifications', { params }),
  getUnreadCount: () => api.get<ApiResponse<{ count: number }>>('/notifications/unread/count'),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  create: (data: NotificationCreatePayload) => api.post<ApiResponse<Notification>>('/notifications', data),
  delete: (id: string) => api.delete(`/notifications/${id}`),
  getPreferences: () => api.get<ApiResponse<any>>('/notifications/preferences'),
  updatePreferences: (data: any) => api.put('/notifications/preferences', data),
}

// ─── Reviews ─────────────────────────────────────────
export const reviewsApi = {
  list: (discountId: number) => api.get<ApiResponse<Review[]>>(`/discounts/${discountId}/reviews`),
  create: (data: ReviewCreatePayload) => api.post<ApiResponse<Review>>('/reviews', data),
  delete: (id: number) => api.delete(`/reviews/${id}`),
  getAll: () => api.get<ApiResponse<Review[]>>('/reviews'),
  // Social Reviews (generic)
  socialList: (targetType: string, targetId: string | number) =>
    api.get<ApiResponse<SocialReview[]>>(`/reviews/${targetType}/${targetId}`),
  socialCreate: (data: SocialReviewCreatePayload) => api.post<ApiResponse<SocialReview>>('/reviews/social', data),
  socialDelete: (id: string) => api.delete(`/reviews/social/${id}`),
}

// ─── Enrollments (Insurance) ────────────────────────
export const enrollmentsApi = {
  list: () => api.get<ApiResponse<Enrollment[]>>('/enrollments'),
  getMyEnrollments: () => api.get<ApiResponse<Enrollment[]>>('/enrollments/me'),
  enroll: (data: EnrollmentCreatePayload) => api.post<ApiResponse<Enrollment>>('/enrollments', data),
  confirm: (data: EnrollmentConfirmPayload) => api.post<ApiResponse<Enrollment>>(`/enrollments/${data.enrollment_id}/confirm`, data),
  cancel: (id: string) => api.post(`/enrollments/${id}/cancel`),
  // Medical Centers & Banks
  getMedicalCenters: (params?: { governorate?: string }) =>
    api.get<ApiResponse<MedicalCenter[]>>('/medical-centers', { params }),
  getBanks: (params?: { governorate?: string }) =>
    api.get<ApiResponse<Bank[]>>('/banks', { params }),
}

// ─── Installments ────────────────────────────────────
export const installmentsApi = {
  list: (userId?: string) => api.get<ApiResponse<Installment[]>>('/installments', { params: { userId } }),
  getMyInstallments: () => api.get<ApiResponse<Installment[]>>('/installments/me'),
  create: (data: InstallmentCreatePayload) => api.post<ApiResponse<Installment>>('/installments', data),
  pay: (id: string, data: InstallmentPayPayload) => api.post<ApiResponse<Installment>>(`/installments/${id}/pay`, data),
}

// ─── Cards ───────────────────────────────────────────
export const cardsApi = {
  getMyCards: () => api.get<ApiResponse<Card[]>>('/cards/me'),
  save: (data: CardCreatePayload) => api.post<ApiResponse<Card>>('/cards', data),
  delete: (userId: string) => api.delete(`/cards/${userId}`),
  setDefault: (userId: string) => api.patch(`/cards/${userId}/default`),
}

// ─── Features ────────────────────────────────────────
export const featuresApi = {
  list: () => api.get<ApiResponse<any[]>>('/features'),
  create: (data: { name: string; key: string }) => api.post<ApiResponse<any>>('/features', data),
  update: (id: number, data: { name?: string; key?: string }) => api.put<ApiResponse<any>>(`/features/${id}`, data),
  delete: (id: number) => api.delete(`/features/${id}`),
}

// ─── Analytics / Stats ──────────────────────────────
export const analyticsApi = {
  getDashboardStats: () => api.get<ApiResponse<{
    totalUsers: number
    totalCompanies: number
    totalDiscounts: number
    approvedDiscounts: number
    pendingCompanies: number
    pendingDiscounts: number
    totalScans: number
    totalRevenue: number
    scansByDay: { date: string; count: number }[]
  }>>('/analytics/dashboard'),
  getRevenueDetails: () => api.get<ApiResponse<any[]>>('/analytics/revenue'),
  getDiscountUsageDetail: (discountId: number) =>
    api.get<ApiResponse<any[]>>(`/analytics/discounts/${discountId}/usage`),
  getCompanyAnalytics: (companyId: string) =>
    api.get<ApiResponse<{ views: number; uses: number; conversionRate: number; perDiscount: any[] }>>(`/analytics/companies/${companyId}`),
}
