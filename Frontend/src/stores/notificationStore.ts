import { create } from 'zustand'
import type { Notification, NotificationFilters } from '../types'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  filters: NotificationFilters
  loading: boolean

  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  setFilters: (filters: Partial<NotificationFilters>) => void
  setLoading: (loading: boolean) => void
  recalculateUnread: () => void
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  filters: { page: 1, limit: 20 },
  loading: false,

  setNotifications: (notifications) => {
    set({ notifications })
    get().recalculateUnread()
  },

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.is_read ? state.unreadCount : state.unreadCount + 1,
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        is_read: true,
        read_at: n.read_at || new Date().toISOString(),
      })),
      unreadCount: 0,
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  setLoading: (loading) => set({ loading }),

  recalculateUnread: () =>
    set((state) => ({
      unreadCount: state.notifications.filter((n) => !n.is_read).length,
    })),
}))
