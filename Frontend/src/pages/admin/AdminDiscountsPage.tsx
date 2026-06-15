import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useDiscounts, useApproveDiscount, useRejectDiscount, useDeleteDiscount, useDiscountScans } from '../../api'
import { DataTable, Button, Modal, StatusBadge, Breadcrumb, StatCard } from '../../components/ui'
import type { Discount, TableState, TableColumn, DiscountFilters } from '../../types'
import { Check, X, Eye, Trash2, BarChart3 } from 'lucide-react'

export const AdminDiscountsPage: React.FC = () => {
  const [tableState, setTableState] = useState<TableState>({ page: 1, limit: 10 })
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null)
  const [showScans, setShowScans] = useState<Discount | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  const filters: DiscountFilters = {
    page: tableState.page,
    limit: tableState.limit,
    status: statusFilter as any || undefined,
    category: categoryFilter as any || undefined,
    search: tableState.search,
    sortBy: tableState.sortBy as any,
    sortOrder: tableState.sortOrder,
  }

  const { data, isLoading } = useDiscounts(filters)
  const approveMutation = useApproveDiscount()
  const rejectMutation = useRejectDiscount()
  const deleteMutation = useDeleteDiscount()
  const { data: scansData } = useDiscountScans(showScans?.id ?? 0)

  const discounts = data?.data?.data ?? []
  const total = data?.data?.total ?? 0
  const scans = scansData?.data?.data ?? []

  const columns: TableColumn<Discount>[] = [
    { key: 'id', label: 'ID', width: '60px' },
    { key: 'company_name', label: 'Company' },
    { key: 'name', label: 'Discount Name' },
    { key: 'category', label: 'Category' },
    { key: 'discount_percent', label: 'Discount', render: (val: string) => <span className="text-gold font-bold">{val}</span> },
    { key: 'tier', label: 'Tier' },
    { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} variant="rounded" /> },
    { key: 'uses', label: 'Uses', sortable: true },
    { key: 'views', label: 'Views', sortable: true },
    { key: 'actions', label: 'Actions', width: '200px', render: (_: any, row: Discount) => (
      <div className="flex items-center gap-1">
        {row.status === 'pending' && (
          <>
            <button onClick={(e) => { e.stopPropagation(); approveMutation.mutate(row.id) }}
              className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-500"><Check size={16} /></button>
            <button onClick={(e) => { e.stopPropagation(); rejectMutation.mutate(row.id) }}
              className="p-1.5 hover:bg-red-50 rounded-lg text-red-400"><X size={16} /></button>
          </>
        )}
        <button onClick={(e) => { e.stopPropagation(); setShowScans(row) }}
          className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500"><BarChart3 size={16} /></button>
        <button onClick={(e) => { e.stopPropagation(); setSelectedDiscount(row) }}
          className="p-1.5 hover:bg-gold/10 rounded-lg text-gold"><Eye size={16} /></button>
        <button onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(row.id) }}
          className="p-1.5 hover:bg-red-50 rounded-lg text-red-400"><Trash2 size={16} /></button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { label: 'Admin Dashboard', href: '/dashboard/admin' },
        { label: 'Discounts' },
      ]} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-dark mb-2">Manage Discounts</h1>
        <p className="text-dark/50">{total} discounts registered</p>
      </motion.div>

      {/* Status / Category Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2">
          {['', 'pending', 'approved', 'rejected'].map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setTableState((p) => ({ ...p, page: 1 })) }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all
                ${statusFilter === s ? 'bg-dark text-white' : 'bg-cream text-dark/60 hover:text-dark'}`}>{s || 'All'}</button>
          ))}
        </div>
        <div className="flex gap-2">
          {['', 'medical', 'gym', 'food', 'fun', 'financial', 'courses'].map((c) => (
            <button key={c} onClick={() => { setCategoryFilter(c); setTableState((p) => ({ ...p, page: 1 })) }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all
                ${categoryFilter === c ? 'bg-dark text-white' : 'bg-cream text-dark/60 hover:text-dark'}`}>{c || 'All'}</button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} data={discounts} total={total}
        tableState={tableState} onStateChange={setTableState} loading={isLoading} />

      {/* Discount Detail Modal */}
      <Modal open={!!selectedDiscount} onClose={() => setSelectedDiscount(null)} title="Discount Details" size="lg">
        {selectedDiscount && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Name', selectedDiscount.name],
                ['Company', selectedDiscount.company_name],
                ['Category', selectedDiscount.category],
                ['Discount', selectedDiscount.discount_percent],
                ['Type', selectedDiscount.discount_type],
                ['Tier', selectedDiscount.tier],
                ['City', selectedDiscount.city],
                ['Uses', selectedDiscount.uses],
                ['Views', selectedDiscount.views],
                ['Status', selectedDiscount.status],
                ['Created', new Date(selectedDiscount.created_at).toLocaleDateString()],
                ['Promo Code', selectedDiscount.promo_code || 'N/A'],
              ].map(([label, value]) => (
                <div key={label as string} className="p-3 bg-cream/50 rounded-xl">
                  <p className="text-xs text-dark/40 mb-1">{label as string}</p>
                  <p className="font-bold text-dark text-sm">{value as string}</p>
                </div>
              ))}
            </div>
            <div className="p-3 bg-cream/50 rounded-xl">
              <p className="text-xs text-dark/40 mb-1">Description</p>
              <p className="text-dark text-sm">{selectedDiscount.description}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Scans Modal */}
      <Modal open={!!showScans} onClose={() => setShowScans(null)} title="Discount Usage Details" size="xl">
        <div className="space-y-3">
          {scans.length === 0 ? (
            <p className="text-center py-8 text-dark/40">No usage data yet</p>
          ) : (
            scans.map((scan: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-4 bg-cream/50 rounded-xl">
                <div>
                  <p className="font-bold text-dark text-sm">{scan.user?.name || 'Unknown'}</p>
                  <p className="text-xs text-dark/40">{new Date(scan.scanned_at).toLocaleString()}</p>
                </div>
                <div className="text-end">
                  <p className="text-gold font-bold">{scan.discount_value} EGP</p>
                  <p className="text-xs text-dark/40">{scan.product}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  )
}
