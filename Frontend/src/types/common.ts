export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiError {
  message: string
  code: string
  status: number
  details?: Record<string, string[]>
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface TableColumn<T = any> {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, row: T, index: number) => React.ReactNode
  searchable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface TableState {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
  search?: string
}

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  group?: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface StatCard {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: number
  trendLabel?: string
  color?: 'gold' | 'emerald' | 'blue' | 'red' | 'purple'
}

export interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}
