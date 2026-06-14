import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, User, LogOut, Menu, ChevronDown } from 'lucide-react'
import { useAuthStore, useUIStore, useNotificationStore } from '../../stores'

interface NavbarProps {
  onMenuClick?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, isAuthenticated, role, logout } = useAuthStore()
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const navigate = useNavigate()

  return (
    <header className="h-16 bg-white border-b border-gold/10 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-dark/5 rounded-xl">
            <Menu size={20} />
          </button>
        )}
        <Link to="/" className="text-xl font-extrabold text-dark">
          <span className="text-gold">Mustak</span>leen
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-2 hover:bg-dark/5 rounded-xl text-dark/50 hover:text-dark transition-all"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center gap-2 p-2 hover:bg-dark/5 rounded-xl transition-all">
                <div className="w-8 h-8 bg-gradient-to-br from-gold to-[#a67c3d] rounded-full flex items-center justify-center text-dark font-bold text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden md:block text-sm font-bold text-dark">{user?.name}</span>
                <ChevronDown size={14} className="text-dark/40" />
              </button>
              <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-xl border border-gold/10 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link
                  to={role === 'USER' ? '/dashboard/user/profile' : '/dashboard/company/profile'}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-dark/60 hover:text-dark hover:bg-dark/5 transition-all"
                >
                  <User size={16} /> Profile
                </Link>
                <Link
                  to="/dashboard/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-dark/60 hover:text-dark hover:bg-dark/5 transition-all"
                >
                  <User size={16} /> Settings
                </Link>
                <hr className="my-1 border-gold/10" />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl border-2 border-gold/30 text-gold font-bold text-sm hover:bg-gold/5 transition-all"
            >
              Login
            </Link>
            <Link
              to="/join"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold to-[#a67c3d] text-dark font-bold text-sm hover:shadow-md transition-all"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
