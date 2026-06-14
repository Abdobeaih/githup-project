import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '../endpoints'
import type { NotificationCreatePayload, NotificationFilters } from '../../types'

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (params?: NotificationFilters) => ['notifications', 'list', params] as const,
  unreadCount: () => ['notifications', 'unreadCount'] as const,
  preferences: () => ['notifications', 'preferences'] as const,
}

export const useNotifications = (params?: NotificationFilters) =>
  useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationsApi.list(params),
  })

export const useUnreadCount = () =>
  useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 30000,
  })

export const useCreateNotification = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: NotificationCreatePayload) => notificationsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.all }),
  })
}

export const useMarkNotificationRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.all })
      qc.invalidateQueries({ queryKey: notificationKeys.unreadCount() })
    },
  })
}

export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.all })
      qc.invalidateQueries({ queryKey: notificationKeys.unreadCount() })
    },
  })
}

export const useDeleteNotification = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notificationsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.all }),
  })
}

export const useNotificationPreferences = () =>
  useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: () => notificationsApi.getPreferences(),
  })

export const useUpdateNotificationPreferences = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => notificationsApi.updatePreferences(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.preferences() }),
  })
}
