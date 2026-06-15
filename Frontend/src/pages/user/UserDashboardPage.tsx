import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Tags, CreditCard, Banknote, ScanLine, TrendingUp, Award,
  ArrowLeft, Settings, Bell, ShoppingBag,
} from 'lucide-react'
import { useAuthStore } from '../../stores'
import { StatCard } from '../../components/ui'

export const UserDashboardPage: React.FC = () => {
  const user = useAuthStore((s) => s.user)

  if (!user) return null

  const quickActions = [
    { label: 'Browse Discounts', icon: <ShoppingBag size={18} />, path: '/dashboard/discounts', color: 'from-gold to-[#a67c3d]' },
    { label: 'My Cards', icon: <CreditCard size={18} />, path: '/dashboard/user/cards', color: 'from-blue-500 to-blue-600' },
    { label: 'Installments', icon: <Banknote size={18} />, path: '/dashboard/user/installments', color: 'from-purple-500 to-purple-600' },
    { label: 'Notifications', icon: <Bell size={18} />, path: '/notifications', color: 'from-emerald-500 to-emerald-600' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-extrabold text-dark mb-2">
          Welcome, {user.name}
        </h1>
        <p className="text-dark/50">Overview of your activity on Freelancer 360</p>
      </motion.div>

      {/* Upgrade Banner */}
      {user.plan === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-bold text-dark mb-1">Great news! 🎉</h3>
              <p className="text-dark/60 text-sm">Upgrade your plan now and get exclusive discounts up to 50%</p>
            </div>
            <Link
              to="/subscriptions/plans"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold to-[#a67c3d] text-dark font-bold text-sm hover:shadow-md transition-all"
            >
              Upgrade My Plan
            </Link>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Scans"
          value={user.scans}
          icon={<ScanLine size={20} />}
          color="gold"
        />
        <StatCard
          title="Total Savings"
          value={`${user.saved.toFixed(2)} EGP`}
          icon={<TrendingUp size={20} />}
          color="emerald"
        />
        <StatCard
          title="Points"
          value={user.points}
          icon={<Award size={20} />}
          color="purple"
        />
        <StatCard
          title="Plan"
          value={user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
          icon={<Tags size={20} />}
          color="blue"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-dark mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              to={action.path}
              className={`bg-gradient-to-br ${action.color} rounded-2xl p-5 text-dark flex flex-col items-start gap-3 hover:shadow-lg transition-all active:scale-[0.98]`}
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                {action.icon}
              </div>
              <span className="font-bold text-sm">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
