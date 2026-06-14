import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  role: UserRole | null
  loading: boolean

  setAuth: (user: User, token: string) => void
  updateUser: (user: Partial<User>) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  hasRole: (roles: UserRole[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
      loading: false,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          role: user.role,
          loading: false,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          role: null,
          loading: false,
        }),

      setLoading: (loading) => set({ loading }),

      hasRole: (roles) => {
        const { role } = get()
        return role ? roles.includes(role) : false
      },
    }),
    {
      name: 'mustakleen-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
      }),
    }
  )
)
