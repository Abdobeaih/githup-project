export type UserPlan = 'free' | 'premium' | 'elite'
export type UserRole = 'USER' | 'COMPANY_ADMIN' | 'ADMIN' | 'SUPER_ADMIN'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  nationalId: string
  job: string
  password: string
  plan: UserPlan
  governorate: string
  scans: number
  saved: number
  join_date: string
  points: number
  role: UserRole
  isActive: boolean
}

export interface UserCreatePayload {
  name: string
  email: string
  phone?: string
  nationalId?: string
  job: string
  password: string
  plan?: UserPlan
  governorate?: string
}

export interface UserUpdatePayload {
  name?: string
  email?: string
  phone?: string
  nationalId?: string
  job?: string
  plan?: UserPlan
  governorate?: string
  isActive?: boolean
}

export interface UserSession {
  user: User
  token: string
  expiresAt: string
}
