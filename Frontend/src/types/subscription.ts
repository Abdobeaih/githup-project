export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING'

export interface SubscriptionPlan {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  price: number
  durationDays: number
  features: string[]
  maxCompanies: number
  maxDiscounts: number
  maxScans: number
  priority: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SubscriptionPlanCreatePayload {
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  price: number
  durationDays: number
  features: string[]
  maxCompanies: number
  maxDiscounts: number
  maxScans: number
  priority: number
}

export interface SubscriptionPlanUpdatePayload {
  name?: string
  nameAr?: string
  description?: string
  descriptionAr?: string
  price?: number
  durationDays?: number
  features?: string[]
  maxCompanies?: number
  maxDiscounts?: number
  maxScans?: number
  priority?: number
  isActive?: boolean
}

export interface UserSubscription {
  id: string
  userId: string
  planId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  startDate: string
  endDate: string
  autoRenew: boolean
  paymentMethod?: string
  price: number
  createdAt: string
  updatedAt: string
}

export interface SubscriptionCreatePayload {
  planId: string
  paymentMethod: string
  autoRenew?: boolean
}
