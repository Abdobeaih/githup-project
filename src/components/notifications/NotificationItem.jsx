import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import NotificationTypeIcon from './NotificationTypeIcon'

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now - d
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'الآن'
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`
  if (diffHours < 24) return `منذ ${diffHours} ساعة`
  if (diffDays < 2) return 'أمس'
  if (diffDays < 7) return `منذ ${diffDays} أيام`
  return d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })
}

export default function NotificationItem({ notification, onMarkRead, onDelete, compact = false }) {
  const navigate = useNavigate()
  const { id, title, body, type, link, is_read, created_at } = notification

  const handleClick = () => {
    if (!is_read && onMarkRead) onMarkRead(id)
    if (link) navigate(link)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className={`
        group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer
        transition-all duration-200
        ${is_read
          ? 'bg-[#0a2e3a]/30 hover:bg-[#0a2e3a]/50'
          : 'bg-[#0a2e3a]/70 hover:bg-[#0a2e3a] border-r-2 border-gold'
        }
      `}
    >
      {/* unread dot */}
      {!is_read && (
        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gold" />
      )}

      {/* type icon */}
      <div className="shrink-0 mt-0.5">
        <NotificationTypeIcon type={type} />
      </div>

      {/* content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug ${is_read ? 'text-gray-300' : 'text-white'}`}>
          {title}
        </p>
        {!compact && body && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {body}
          </p>
        )}
        <span className="text-[10px] text-gray-500 mt-1.5 block">
          {formatTime(created_at)}
        </span>
      </div>

      {/* delete */}
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(id) }}
          className="shrink-0 p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
          title="حذف"
        >
          <Trash2 size={14} />
        </button>
      )}
    </motion.div>
  )
}
