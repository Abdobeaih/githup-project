export type CompanyCategory = 'medical' | 'gym' | 'food' | 'fun' | 'financial' | 'training'
export type CompanyStatus = 'pending' | 'approved' | 'rejected'

export interface Company {
  id: string
  name: string
  email: string
  password: string
  category: CompanyCategory
  city: string
  governorate: string
  emoji: string
  status: CompanyStatus
  approved_at: string | null
  join_date: string
  views: number
  uses: number
  commission: number
  plan: string
  description: string
  logo: string
  website: string
  phone: string
}

export interface CompanyCreatePayload {
  name: string
  email: string
  password: string
  category: CompanyCategory
  city: string
  governorate?: string
  emoji?: string
  description?: string
  phone?: string
}

export interface CompanyUpdatePayload {
  name?: string
  email?: string
  category?: CompanyCategory
  city?: string
  governorate?: string
  emoji?: string
  description?: string
  phone?: string
  website?: string
  commission?: number
  status?: CompanyStatus
}

export interface CompanyBranch {
  id: string
  company_id: string
  name: string
  address: string
  city: string
  governorate: string
  phone: string
  working_hours: string
  is_active: boolean
  created_at: string
}

export interface CompanyBranchCreatePayload {
  company_id: string
  name: string
  address: string
  city: string
  phone: string
  working_hours?: string
}

export interface CompanyStats {
  totalDiscounts: number
  activeDiscounts: number
  totalViews: number
  totalUses: number
  pendingApproval: number
  conversionRate: number
  totalEarnings: number
}
