import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from './AuthContext'
import * as notifService from '../services/notificationsService'

const NotificationContext = createContext(null)

const POLL_INTERVAL = 30000 // 30s

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const intervalRef = useRef(null)

  const refreshNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      return
    }
    setLoading(true)
    try {
      const [notifRes, countRes] = await Promise.all([
        notifService.getNotifications(user.id),
        notifService.getUnreadCount(user.id),
      ])
      setNotifications(notifRes.data || [])
      setUnreadCount(countRes.count ?? 0)
    } catch (_) {
      // silent fail
    } finally {
      setLoading(false)
    }
  }, [user])

  // Initial fetch + polling
  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      return
    }
    refreshNotifications()
    intervalRef.current = setInterval(refreshNotifications, POLL_INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [user, refreshNotifications])

  const markAsRead = useCallback(async (id) => {
    await notifService.markAsRead(id)
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(async () => {
    if (!user) return
    await notifService.markAllAsRead(user.id)
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }, [user])

  const deleteNotif = useCallback(async (id) => {
    const wasUnread = notifications.find(n => n.id === id)?.is_read === false
    await notifService.deleteNotification(id)
    setNotifications(prev => prev.filter(n => n.id !== id))
    if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1))
  }, [notifications])

  const value = {
    unreadCount,
    notifications,
    loading,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotif,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider')
  return ctx
}
