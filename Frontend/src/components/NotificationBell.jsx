import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import NotificationItem from './notifications/NotificationItem'
import NotificationBadge from './notifications/NotificationBadge'

export default function NotificationBell() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  if (!user) return null // only show for logged-in users

  const recent = notifications.slice(0, 5)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 hover:bg-gold/10 rounded-xl transition-all"
        aria-label="الإشعارات"
      >
        <Bell size={20} className="text-gold" />
        <NotificationBadge count={unreadCount} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 w-80 bg-[#041a21] border border-gold/15 rounded-2xl shadow-2xl z-50 overflow-hidden"
          style={{ direction: 'rtl' }}
        >
          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gold/10">
            <h3 className="font-bold text-white text-sm">الإشعارات</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-gold font-bold hover:text-goldLight transition-colors"
              >
                <CheckCheck size={14} /> تحديد الكل
              </button>
            )}
          </div>

          {/* list */}
          <div className="max-h-80 overflow-y-auto py-1 scrollbar-thin">
            {recent.length === 0 ? (
              <div className="text-center py-10">
                <Mail className="text-gold/30 mx-auto mb-2" size={32} />
                <p className="text-gray-500 text-sm">لا توجد إشعارات</p>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                {recent.map(n => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    onMarkRead={markAsRead}
                    compact
                  />
                ))}
              </div>
            )}
          </div>

          {/* footer */}
          {notifications.length > 5 && (
            <button
              onClick={() => { setOpen(false); navigate('/notifications') }}
              className="w-full text-center py-3 text-gold text-sm font-bold hover:bg-gold/5 transition-all border-t border-gold/10"
            >
              عرض الكل ({notifications.length})
            </button>
          )}
        </div>
      )}
    </div>
  )
}
