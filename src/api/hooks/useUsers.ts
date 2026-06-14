import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../endpoints'
import type { UserCreatePayload, UserUpdatePayload } from '../../types'

export const userKeys = {
  all: ['users'] as const,
  list: (params?: Record<string, any>) => ['users', 'list', params] as const,
  detail: (id: string) => ['users', 'detail', id] as const,
  stats: () => ['users', 'stats'] as const,
}

export const useUsers = (params?: Record<string, any>) =>
  useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersApi.list(params),
  })

export const useUser = (id: string) =>
  useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  })

export const useUserStats = () =>
  useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => usersApi.getStats(),
  })

export const useCreateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UserCreatePayload) => usersApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  })
}

export const useUpdateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserUpdatePayload }) => usersApi.update(id, data),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: userKeys.detail(id) }),
  })
}

export const useDeleteUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  })
}
