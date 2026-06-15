import { motion } from 'framer-motion'
import { Inbox } from 'lucide-react'

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'لا توجد بيانات',
  description = '',
  action,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      <div className="w-20 h-20 bg-gold/5 rounded-full flex items-center justify-center mb-6">
        <Icon size={40} className="text-gold/40" />
      </div>
      <h3 className="text-xl font-bold text-dark mb-2">{title}</h3>
      {description && (
        <p className="text-dark/50 max-w-md mb-8 leading-relaxed">{description}</p>
      )}
      {action && action}
    </motion.div>
  )
}
