export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'PUSH'

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string
  type: NotificationType
  channel: NotificationChannel
  link: string
  is_read: boolean
  created_at: string
  read_at: string | null
}

export interface NotificationCreatePayload {
  user_id: string
  title: string
  body?: string
  type?: NotificationType
  link?: string
  channel?: NotificationChannel
}

export interface NotificationFilters {
  is_read?: boolean
  type?: NotificationType
  from_date?: string
  to_date?: string
  page?: number
  limit?: number
}

export interface NotificationPreferences {
  email_notifications: boolean
  push_notifications: boolean
  sms_notifications: boolean
  marketing_emails: boolean
  discount_alerts: boolean
  payment_reminders: boolean
  subscription_expiry: boolean
  review_responses: boolean
}
