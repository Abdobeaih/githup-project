import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const userSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{11}$/, 'Phone must be 11 digits').optional().or(z.literal('')),
  nationalId: z.string().length(14, 'National ID must be 14 digits').regex(/^\d+$/, 'Numbers only').optional().or(z.literal('')),
  job: z.string().min(2, 'Specialty is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
  plan: z.enum(['free', 'premium', 'elite']),
  governorate: z.string().min(1, 'Governorate is required'),
  medicalCenter: z.string().optional(),
  bank: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type UserSignupFormData = z.infer<typeof userSignupSchema>

export const companySignupSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  category: z.enum(['medical', 'gym', 'food', 'fun']),
  city: z.string().min(1, 'City is required'),
  emoji: z.string().optional(),
  fullName: z.string().min(2, 'Full name is required'),
  jobTitle: z.string().min(2, 'Job title is required'),
  phone: z.string().length(11, 'Phone must be 11 digits'),
  branchName: z.string().min(2, 'Branch name is required'),
  contactLink: z.string().url('Invalid URL'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  hasCommercialReg: z.boolean(),
  hasTaxCard: z.boolean(),
})

export type CompanySignupFormData = z.infer<typeof companySignupSchema>

export const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  job: z.string().optional(),
  governorate: z.string().optional(),
})

export const discountCreateSchema = z.object({
  name: z.string().min(3, 'Discount name is required'),
  category: z.enum(['medical', 'gym', 'food', 'fun', 'financial', 'courses']),
  discount_percent: z.string().min(1, 'Discount percentage is required'),
  discount_type: z.enum(['INSURANCE_FORM', 'PROMO_CODE', 'EXTERNAL_LINK']),
  promo_code: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  city: z.string().min(1, 'City is required'),
  tier_required: z.enum(['free', 'premium', 'elite']).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  terms_conditions: z.string().optional(),
  max_usage_per_user: z.number().min(1).optional(),
})

export type DiscountCreateFormData = z.infer<typeof discountCreateSchema>

export const planCreateSchema = z.object({
  name: z.string().min(2, 'Plan name is required'),
  price: z.number().min(0, 'Price must be 0 or more'),
  duration_months: z.number().min(1, 'Duration must be at least 1 month'),
  max_discount_usage: z.number().optional(),
  max_monthly_promo_uses: z.number().optional(),
  popular: z.boolean().optional(),
})

export const subscriptionCreateSchema = z.object({
  plan_id: z.string().min(1, 'Plan is required'),
  payment_method: z.enum(['VISA', 'MASTERCARD', 'FAWRY', 'CASH', 'VODAFONE_CASH', 'INSTAPAY', 'BANK_TRANSFER']),
})

export const paymentCreateSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  payment_method: z.enum(['VISA', 'MASTERCARD', 'FAWRY', 'CASH', 'VODAFONE_CASH', 'INSTAPAY', 'BANK_TRANSFER']),
  subscription_id: z.string().optional(),
  notes: z.string().optional(),
})

export const enrollmentConfirmSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phone: z.string().length(11, 'Phone must be 11 digits'),
  agreeDataUse: z.literal(true, { message: 'You must agree to data use' }),
  agreeTerms: z.literal(true, { message: 'You must agree to terms' }),
})

export type EnrollmentConfirmFormData = z.infer<typeof enrollmentConfirmSchema>

export const cardCreateSchema = z.object({
  card_holder_name: z.string().min(2, 'Card holder name is required'),
  card_number: z.string().regex(/^\d{14}$/, 'Card number must be 14 digits'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry must be MM/YY'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Invalid CVV').optional(),
  is_default: z.boolean().optional(),
})

export const reviewCreateSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, 'Comment must be at least 5 characters').max(500),
})

export const branchCreateSchema = z.object({
  name: z.string().min(2, 'Branch name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  phone: z.string().length(11, 'Phone must be 11 digits'),
  working_hours: z.string().optional(),
})

export const companyUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  category: z.enum(['medical', 'gym', 'food', 'fun']).optional(),
  city: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  commission: z.number().min(0).max(100).optional(),
})

export const featureCreateSchema = z.object({
  name: z.string().min(2, 'Feature name is required'),
  key: z.string().min(2, 'Feature key is required').regex(/^[a-z_]+$/, 'Must be lowercase with underscores'),
})

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const notificationCreateSchema = z.object({
  title: z.string().min(2),
  body: z.string().optional(),
  type: z.enum(['INFO', 'SUCCESS', 'WARNING', 'ERROR']).optional(),
  link: z.string().optional(),
  user_id: z.string().min(1),
})
