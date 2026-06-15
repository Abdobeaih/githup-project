import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, Building2, Tags, CreditCard,
  Bell, Settings, LogOut, ChevronLeft, ChevronRight,
  BarChart3, Shield, FileText, Receipt, Banknote,
  ShoppingBag, Star, Layers, Megaphone, Menu,
} from 'lucide-react'
import { useAuthStore, useUIStore } from '../../stores'
import type { UserRole } from '../../types'

interface SidebarItem {
  label: string
  icon: React.ReactNode
  path?: string
  roles: UserRole[]
  children?: { label: string; path: string; roles: UserRole[] }[]
}

const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    path: '/dashboard',
    roles: ['USER', 'COMPANY_ADMIN', 'ADMIN', 'SUPER_ADMIN'],
  },
  {
    label: 'Discounts',
    icon: <Tags size={20} />,
    path: '/dashboard/discounts',
    roles: ['USER'],
  },
  {
    label: 'Subscriptions',
    icon: <CreditCard size={20} />,
    path: '/subscriptions',
    roles: ['USER'],
  },
  {
    label: 'Payments',
    icon: <Receipt size={20} />,
    path: '/subscriptions/payments',
    roles: ['USER'],
  },
  {
    label: 'My Cards',
    icon: <CreditCard size={20} />,
    path: '/dashboard/user/cards',
    roles: ['USER'],
  },
  {
    label: 'Installments',
    icon: <Banknote size={20} />,
    path: '/dashboard/user/installments',
    roles: ['USER'],
  },
  {
    label: 'Notifications',
    icon: <Bell size={20} />,
    path: '/notifications',
    roles: ['USER'],
  },
  {
    label: 'My Company',
    icon: <Building2 size={20} />,
    path: '/dashboard/company',
    roles: ['COMPANY_ADMIN'],
  },
  {
    label: 'Discounts',
    icon: <Tags size={20} />,
    path: '/dashboard/company/discounts',
    roles: ['COMPANY_ADMIN'],
  },
  {
    label: 'Analytics',
    icon: <BarChart3 size={20} />,
    path: '/dashboard/company/analytics',
    roles: ['COMPANY_ADMIN'],
  },
  {
    label: 'Users',
    icon: <Users size={20} />,
    path: '/dashboard/admin/users',
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  {
    label: 'Companies',
    icon: <Building2 size={20} />,
    path: '/dashboard/admin/companies',
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  {
    label: 'Discounts',
    icon: <Tags size={20} />,
    path: '/dashboard/admin/discounts',
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  {
    label: 'Plans',
    icon: <Layers size={20} />,
    path: '/dashboard/admin/subscriptions/plans',
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  {
    label: 'Features',
    icon: <Megaphone size={20} />,
    path: '/dashboard/admin/features',
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  {
    label: 'Categories',
    icon: <Shield size={20} />,
    path: '/dashboard/admin/categories',
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  {
    label: 'Analytics',
    icon: <BarChart3 size={20} />,
    path: '/dashboard/admin/analytics',
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  {
    label: 'Audit Logs',
    icon: <FileText size={20} />,
    path: '/dashboard/admin/audit-logs',
    roles: ['SUPER_ADMIN'],
  },
  {
    label: 'Settlements',
    icon: <Banknote size={20} />,
    path: '/dashboard/admin/settlements',
    roles: ['SUPER_ADMIN'],
  },
  {
    label: 'Settings',
    icon: <Settings size={20} />,
    path: '/dashboard/settings',
    roles: ['USER', 'COMPANY_ADMIN'],
  },
]

interface SidebarProps {
  role: UserRole
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const { sidebar, toggleSidebar, direction } = useUIStore()
  const logout = useAuthStore((s) => s.logout)
  const isCollapsed = sidebar === 'collapsed'

  const filteredItems = sidebarItems.filter(
    (item) => item.roles.includes(role) && (!item.children || item.children.some((c) => c.roles.includes(role)))
  )

  return (
    <aside
      className={`fixed top-0 right-0 h-screen bg-white border-l border-gold/10 z-40 transition-all duration-300
        ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gold/10">
          {isCollapsed ? (
            <span className="text-xl font-extrabold text-gold">M</span>
          ) : (
            <span className="text-xl font-extrabold text-dark">
              <span className="text-gold">Mustak</span>leen
            </span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredItems.map((item) => (
            <NavLink
              key={item.path || item.label}
              to={item.path || '#'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all
                ${isActive
                  ? 'bg-gold/10 text-gold'
                  : 'text-dark/50 hover:text-dark hover:bg-dark/5'
                }
                ${isCollapsed ? 'justify-center' : ''}`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Toggle & Logout */}
        <div className="p-3 border-t border-gold/10 space-y-1">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-dark/40 hover:text-dark hover:bg-dark/5 transition-all"
          >
            {direction === 'rtl' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            {!isCollapsed && <span>Collapse</span>}
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
