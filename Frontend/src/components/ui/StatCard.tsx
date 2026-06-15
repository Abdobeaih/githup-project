import React from 'react'
import { motion } from 'framer-motion'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: number
  trendLabel?: string
  color?: 'gold' | 'emerald' | 'blue' | 'red' | 'purple'
}

const colorMap = {
  gold: { bg: 'from-gold to-[#a67c3d]', shadow: 'shadow-gold/20' },
  emerald: { bg: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-200' },
  blue: { bg: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-200' },
  red: { bg: 'from-red-500 to-red-600', shadow: 'shadow-red-200' },
  purple: { bg: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-200' },
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendLabel, color = 'gold' }) => {
  const c = colorMap[color]
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-gold/10 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${c.bg} rounded-xl flex items-center justify-center text-dark shadow-lg ${c.shadow}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full
            ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}
          >
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-dark/50 text-sm mb-1">{title}</p>
      <p className="text-2xl font-extrabold text-dark">{value}</p>
      {trendLabel && <p className="text-xs text-dark/40 mt-1">{trendLabel}</p>}
    </motion.div>
  )
}
