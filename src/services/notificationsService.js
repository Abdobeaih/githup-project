/**
 * Notifications Service — API-first with db.js fallback
 * Types: INFO, SUCCESS, WARNING, ALERT
 * ERD: user_id, title, body, type, link, is_read, created_at
 */
import api from '../api/axios'
import * as db from '../data/db'

export async function getNotifications(userId) {
  try {
    const res = await api.get(`/notifications?user_id=${userId}`)
    return { data: res.data?.data || res.data }
  } catch {
    return { data: db.getUserNotifications(userId) }
  }
}

export async function getUnreadCount(userId) {
  try {
    const res = await api.get(`/notifications/unread-count?user_id=${userId}`)
    return { count: res.data?.count ?? res.data?.data?.count ?? 0 }
  } catch {
    return { count: db.getUnreadNotificationCount(userId) }
  }
}

export async function createNotification({ user_id, title, body, type, link }) {
  try {
    const res = await api.post('/notifications', { user_id, title, body, type, link })
    return { data: res.data?.data || res.data }
  } catch {
    return { data: db.createNotification({ user_id, title, body, type, link }) }
  }
}

export async function markAsRead(id) {
  try {
    const res = await api.patch(`/notifications/${id}/read`)
    return { data: res.data?.data || res.data }
  } catch {
    return { data: db.markNotificationRead(id) }
  }
}

export async function markAllAsRead(userId) {
  try {
    const res = await api.patch('/notifications/read-all', { user_id: userId })
    return { data: res.data?.data || res.data }
  } catch {
    return { count: db.markAllNotificationsRead(userId).count }
  }
}

export async function deleteNotification(id) {
  try {
    const res = await api.delete(`/notifications/${id}`)
    return { data: res.data?.data || res.data }
  } catch {
    return { data: db.deleteNotification(id) }
  }
}
