import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Building2, Tags, ScanLine, TrendingUp,
  DollarSign, BarChart3, ShieldAlert,
} from 'lucide-react'
import { StatCard, Button, Modal } from '../../components/ui'
import { useDashboardStats, useRevenueDetails } from '../../api'
import { Link } from 'react-router-dom'

export const AdminDashboardPage: React.FC = () => {
  const { data: statsRes, isLoading, error } = useDashboardStats()
  const [showRevenue, setShowRevenue] = useState(false)

  const stats = statsRes?.data?.data

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-dark mb-2">Admin Panel</h1>
        <p className="text-dark/50">Platform overview</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={<Users size={20} />} color="blue" />
        <StatCard title="Companies" value={stats?.totalCompanies ?? 0} icon={<Building2 size={20} />} color="purple" />
        <StatCard title="Total Discounts" value={stats?.totalDiscounts ?? 0} icon={<Tags size={20} />} color="gold" />
        <StatCard title="Total Scans" value={stats?.totalScans ?? 0} icon={<ScanLine size={20} />} color="emerald" />
        <StatCard title="Pending Companies" value={stats?.pendingCompanies ?? 0} icon={<ShieldAlert size={20} />} color="red" />
        <StatCard title="Pending Discounts" value={stats?.pendingDiscounts ?? 0} icon={<ShieldAlert size={20} />} color="red" />
        <StatCard title="Monthly Revenue" value={`${stats?.totalRevenue ?? 0} EGP`} icon={<DollarSign size={20} />} color="gold" />
        <StatCard title="Approved Discounts" value={stats?.approvedDiscounts ?? 0} icon={<BarChart3 size={20} />} color="emerald" />
      </div>

      {/* Quick Management */}
      <div>
        <h2 className="text-xl font-bold text-dark mb-4">Quick Management</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Manage Users', icon: <Users size={20} />, path: '/dashboard/admin/users', color: 'from-blue-500 to-blue-600' },
            { label: 'Manage Companies', icon: <Building2 size={20} />, path: '/dashboard/admin/companies', color: 'from-purple-500 to-purple-600' },
            { label: 'Manage Discounts', icon: <Tags size={20} />, path: '/dashboard/admin/discounts', color: 'from-gold to-[#a67c3d]' },
            { label: 'Revenue Details', icon: <DollarSign size={20} />, onClick: () => setShowRevenue(true), color: 'from-emerald-500 to-emerald-600' },
          ].map((item, i) => (
            item.path ? (
              <Link
                key={i}
                to={item.path}
                className={`bg-gradient-to-br ${item.color} rounded-2xl p-5 text-dark flex flex-col items-start gap-3 hover:shadow-lg transition-all active:scale-[0.98]`}
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">{item.icon}</div>
                <span className="font-bold text-sm">{item.label}</span>
              </Link>
            ) : (
              <button
                key={i}
                onClick={item.onClick}
                className={`bg-gradient-to-br ${item.color} rounded-2xl p-5 text-dark flex flex-col items-start gap-3 hover:shadow-lg transition-all active:scale-[0.98] text-start`}
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">{item.icon}</div>
                <span className="font-bold text-sm">{item.label}</span>
              </button>
            )
          ))}
        </div>
      </div>

      {/* Revenue Modal */}
      <Modal open={showRevenue} onClose={() => setShowRevenue(false)} title="Monthly Revenue Details" size="xl">
        <RevenueDetails />
      </Modal>
    </div>
  )
}

export const RevenueDetails: React.FC = () => {
  const { data, isLoading } = useRevenueDetails()
  const revenues = data?.data?.data ?? []

  if (isLoading) return <div className="text-center py-8 text-dark/50">Loading...</div>

  const total = revenues.reduce((sum: number, r: any) => sum + (r.planRevenue || 0), 0)

  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-gold/5 rounded-xl">
        <p className="text-sm text-dark/50">Total Monthly Revenue</p>
        <p className="text-3xl font-extrabold text-dark">{total.toFixed(2)} EGP</p>
      </div>
      <div className="divide-y divide-gold/10 max-h-96 overflow-y-auto">
        {revenues.length === 0 ? (
          <p className="text-center py-8 text-dark/40">No revenue data available</p>
        ) : (
          revenues.map((r: any, i: number) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div>
                <p className="font-bold text-dark text-sm">{r.name}</p>
                <p className="text-xs text-dark/40">{r.email}</p>
              </div>
              <div className="text-end">
                <p className="font-bold text-gold">{r.planRevenue} EGP</p>
                <p className={`text-xs ${r.subscriptionStatus === 'active' ? 'text-emerald-500' : 'text-red-400'}`}>
                  {r.subscriptionStatus}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
