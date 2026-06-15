import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Tags, BarChart3, Building2, Eye, MousePointerClick, TrendingUp, Plus } from 'lucide-react'
import { StatCard } from '../../components/ui'
import { useCompanyAnalytics } from '../../api'
import { useAuthStore } from '../../stores'

export const CompanyDashboardPage: React.FC = () => {
  const company = useAuthStore((s) => s.user) // Cast — in real app, company has its own store
  const companyId = company?.id || ''
  const { data: analytics } = useCompanyAnalytics(companyId)

  const stats = [
    { title: 'Total Views', value: analytics?.data?.data?.views ?? 0, icon: <Eye size={20} />, color: 'blue' as const },
    { title: 'Total Uses', value: analytics?.data?.data?.uses ?? 0, icon: <MousePointerClick size={20} />, color: 'emerald' as const },
    { title: 'Conversion Rate', value: `${analytics?.data?.data?.conversionRate ?? 0}%`, icon: <TrendingUp size={20} />, color: 'gold' as const },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-dark mb-2">Company Dashboard</h1>
        <p className="text-dark/50">Overview of your company performance</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold text-dark mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/dashboard/company/discounts/create"
            className="bg-gradient-to-br from-gold to-[#a67c3d] rounded-2xl p-5 text-dark flex items-center gap-3 hover:shadow-lg transition-all">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Plus size={20} /></div>
            <span className="font-bold">Add New Discount</span>
          </Link>
          <Link to="/dashboard/company/analytics"
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-dark flex items-center gap-3 hover:shadow-lg transition-all">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><BarChart3 size={20} /></div>
            <span className="font-bold">View Analytics</span>
          </Link>
          <Link to="/dashboard/company/profile"
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-dark flex items-center gap-3 hover:shadow-lg transition-all">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Building2 size={20} /></div>
            <span className="font-bold">Edit Profile</span>
          </Link>
        </div>
      </div>

      {/* Analytics per discount */}
      {analytics?.data?.data?.perDiscount && (
        <div>
          <h2 className="text-xl font-bold text-dark mb-4">Per Discount Performance</h2>
          <div className="bg-white rounded-2xl border border-gold/10 divide-y divide-gold/10">
            {analytics.data.data.perDiscount.map((d: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-bold text-dark text-sm">{d.name}</p>
                  <p className="text-xs text-dark/40">{d.discount_percent} discount</p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-dark/50">{d.views} views</span>
                  <span className="text-gold font-bold">{d.uses} uses</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
