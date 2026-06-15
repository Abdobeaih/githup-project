export type DiscountCategory = 'medical' | 'gym' | 'food' | 'fun' | 'financial' | 'courses'
export type DiscountType = 'INSURANCE_FORM' | 'PROMO_CODE' | 'EXTERNAL_LINK'
export type DiscountStatus = 'pending' | 'approved' | 'rejected'
export type DiscountTier = 'free' | 'premium' | 'elite'

export interface Discount {
  id: number
  name: string
  category: DiscountCategory
  discount_percent: string
  discount_type: DiscountType
  promo_code: string | null
  description: string
  city: string
  governorate: string
  tier_required: DiscountTier
  tier: string
  company_id: string
  company_name: string
  uses: number
  views: number
  status: DiscountStatus
  start_date: string
  end_date: string
  created_at: string
  approved_at: string | null
  image_url: string
  terms_conditions: string
  max_usage_per_user: number
}

export interface DiscountCreatePayload {
  name: string
  category: DiscountCategory
  discount_percent: string
  discount_type: DiscountType
  promo_code?: string
  description: string
  city: string
  governorate?: string
  tier_required?: DiscountTier
  tier?: string
  company_id: string
  company_name: string
  start_date?: string
  end_date?: string
  image_url?: string
  terms_conditions?: string
  max_usage_per_user?: number
}

export interface DiscountUpdatePayload {
  name?: string
  category?: DiscountCategory
  discount_percent?: string
  discount_type?: DiscountType
  promo_code?: string
  description?: string
  city?: string
  governorate?: string
  tier_required?: DiscountTier
  tier?: string
  status?: DiscountStatus
  start_date?: string
  end_date?: string
  image_url?: string
  terms_conditions?: string
  max_usage_per_user?: number
}

export interface DiscountFilters {
  category?: DiscountCategory
  city?: string
  governorate?: string
  tier?: DiscountTier
  status?: DiscountStatus
  search?: string
  sortBy?: 'uses' | 'views' | 'created_at' | 'discount_percent'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface DiscountScan {
  id: string
  user_id: string
  discount_id: number
  scanned_at: string
  invoice_id: string
  product: string
  original_price: number
  discount_percent: string
  discount_value: number
  final_price: number
  promo_code: string
  amount_paid: number
  invoice_last4: string
  user?: import('./user').User
  discount?: Discount
}
