import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'
type Direction = 'ltr' | 'rtl'
type SidebarState = 'expanded' | 'collapsed'

interface UIState {
  theme: Theme
  direction: Direction
  sidebar: SidebarState
  mobileMenuOpen: boolean
  modalStack: string[]

  setTheme: (theme: Theme) => void
  setDirection: (dir: Direction) => void
  toggleSidebar: () => void
  setSidebar: (state: SidebarState) => void
  setMobileMenuOpen: (open: boolean) => void
  pushModal: (id: string) => void
  popModal: () => void
  clearModals: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      direction: 'rtl',
      sidebar: 'expanded',
      mobileMenuOpen: false,
      modalStack: [],

      setTheme: (theme) => set({ theme }),
      setDirection: (direction) => {
        set({ direction })
        document.documentElement.dir = direction
        document.documentElement.lang = direction === 'rtl' ? 'ar' : 'en'
      },
      toggleSidebar: () =>
        set((state) => ({
          sidebar: state.sidebar === 'expanded' ? 'collapsed' : 'expanded',
        })),
      setSidebar: (sidebar) => set({ sidebar }),
      setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
      pushModal: (id) =>
        set((state) => ({ modalStack: [...state.modalStack, id] })),
      popModal: () =>
        set((state) => ({ modalStack: state.modalStack.slice(0, -1) })),
      clearModals: () => set({ modalStack: [] }),
    }),
    {
      name: 'mustakleen-ui',
      partialize: (state) => ({
        theme: state.theme,
        direction: state.direction,
        sidebar: state.sidebar,
      }),
    }
  )
)
