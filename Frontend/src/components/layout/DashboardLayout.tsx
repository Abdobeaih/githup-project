import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAuthStore, useUIStore } from '../../stores'

export const DashboardLayout: React.FC = () => {
  const role = useAuthStore((s) => s.role)
  const sidebar = useUIStore((s) => s.sidebar)
  const isCollapsed = sidebar === 'collapsed'

  if (!role) return null

  return (
    <div className="min-h-screen bg-cream/30">
      <Sidebar role={role} />
      <main
        className={`transition-all duration-300 ${isCollapsed ? 'mr-20' : 'mr-64'}`}
      >
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
