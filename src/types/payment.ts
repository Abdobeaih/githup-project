export type PaymentMethod = 'VISA' | 'MASTERCARD' | 'FAWRY' | 'CASH' | 'VODAFONE_CASH' | 'INSTAPAY' | 'BANK_TRANSFER'
export type PaymentStatus = 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED'

export interface Payment {
  id: string
  user_id: string
  subscription_id: string | null
  amount: number
  payment_method: PaymentMethod
  transaction_id: string
  status: PaymentStatus
  paid_at: string
  receipt_url?: string
  notes?: string
  user?: import('./user').User
  subscription?: import('./subscription').UserSubscription
}

export interface PaymentCreatePayload {
  user_id: string
  subscription_id?: string
  amount: number
  payment_method: PaymentMethod
  notes?: string
}

export interface PaymentFilters {
  status?: PaymentStatus
  payment_method?: PaymentMethod
  from_date?: string
  to_date?: string
  user_id?: string
  page?: number
  limit?: number
}
