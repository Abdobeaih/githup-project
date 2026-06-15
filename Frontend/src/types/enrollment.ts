export type EnrollmentServiceType = 'medical' | 'financial' | 'combined'
export type EnrollmentStatus = 'active' | 'cancelled' | 'expired'

export interface Enrollment {
  id: string
  user_id: string
  service_type: EnrollmentServiceType
  center_id: string | null
  bank_id: string | null
  enrolled_at: string
  status: EnrollmentStatus
  subscription_confirmed: boolean
  subscription_name: string | null
  subscription_dob: string | null
  subscription_phone: string | null
  subscription_data_use_agree: boolean
  subscription_terms_agree: boolean
  subscription_confirmed_at: string | null
  center?: import('./company').Company | null
  bank?: import('./company').Company | null
  user?: import('./user').User
}

export interface EnrollmentCreatePayload {
  service_type: EnrollmentServiceType
  center_id?: string
  bank_id?: string
}

export interface EnrollmentConfirmPayload {
  enrollment_id: string
  name: string
  dob: string
  phone: string
  agreeDataUse: boolean
  agreeTerms: boolean
}

export interface MedicalCenter {
  id: string
  name: string
  governorate: string
  address: string
  phone: string
  rating: number
  img_url: string
  description: string
  services_offered: string[]
  pricing: ServicePricing[]
  reviews: MedicalCenterReview[]
}

export interface MedicalCenterReview {
  id: number
  userName: string
  rating: number
  comment: string
  date: string
}

export interface ServicePricing {
  service: string
  memberPrice: number
  nonMemberPrice: number
}

export interface Bank {
  id: string
  name: string
  governorate: string
  address: string
  phone: string
  rating: number
  img_url: string
  description: string
  services_offered: string[]
  pricing: ServicePricing[]
  reviews: MedicalCenterReview[]
  discount_percent?: string
}
