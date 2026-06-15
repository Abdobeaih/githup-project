export interface Installment {
  id: string
  user_id: string
  name: string
  total: number
  paid: number
  monthly_amount: number
  next_due: string
  status?: 'active' | 'completed' | 'overdue'
  remaining?: number
}

export interface InstallmentCreatePayload {
  user_id: string
  name: string
  total: number
  monthly_amount: number
}

export interface InstallmentPayPayload {
  amount: number
}

export interface Card {
  user_id: string
  card_holder_name: string
  card_number: string
  expiry: string
  brand?: 'visa' | 'mastercard' | 'amex'
  is_default?: boolean
}

export interface CardCreatePayload {
  card_holder_name: string
  card_number: string
  expiry: string
  cvv?: string
  is_default?: boolean
}
