import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useCompanies, useApproveCompany, useRejectCompany, useDeleteCompany } from '../../api'
import { DataTable, Button, Modal, ConfirmDialog, StatusBadge, Breadcrumb, EmptyState } from '../../components/ui'
import type { Company, TableState, TableColumn } from '../../types'
import { Check, X, Eye, Trash2, Building2 } from 'lucide-react'

export const AdminCompaniesPage: React.FC = () => {
  const [tableState, setTableState] = useState<TableState>({ page: 1, limit: 10 })
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('')

  const params = { ...tableState, status: statusFilter || undefined }
  const { data, isLoading } = useCompanies(params)
  const approveMutation = useApproveCompany()
  const rejectMutation = useRejectCompany()
  const deleteMutation = useDeleteCompany()

  const companies = data?.data?.data ?? []
  const total = data?.data?.total ?? 0

  const columns: TableColumn<Company>[] = [
    { key: 'id', label: 'ID', width: '140px' },
    { key: 'name', label: 'Company', render: (val: string, row: Company) => (
      <span className="flex items-center gap-2">
        <span>{row.emoji}</span>
        <span className="font-bold">{val}</span>
      </span>
    )},
    { key: 'email', label: 'Email' },
    { key: 'category', label: 'Category' },
    { key: 'city', label: 'City' },
    { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} variant="rounded" /> },
    { key: 'uses', label: 'Uses', sortable: true },
    { key: 'views', label: 'Views', sortable: true },
    { key: 'commission', label: 'Commission', render: (val: number) => `${val}%` },
    { key: 'actions', label: 'Actions', width: '160px', render: (_: any, row: Company) => (
      <div className="flex items-center gap-1">
        {row.status === 'pending' && (
          <>
            <button onClick={(e) => { e.stopPropagation(); approveMutation.mutate(row.id) }}
              className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-500 transition-all">
              <Check size={16} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); rejectMutation.mutate(row.id) }}
              className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-all">
              <X size={16} />
            </button>
          </>
        )}
        <button onClick={(e) => { e.stopPropagation(); setSelectedCompany(row) }}
          className="p-1.5 hover:bg-gold/10 rounded-lg text-gold transition-all">
          <Eye size={16} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(row) }}
          className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-all">
          <Trash2 size={16} />
        </button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { label: 'Admin Dashboard', href: '/dashboard/admin' },
        { label: 'Companies' },
      ]} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-dark mb-2">Manage Companies</h1>
        <p className="text-dark/50">{total} companies registered</p>
      </motion.div>

      <div className="flex gap-2">
        {['', 'pending', 'approved', 'rejected'].map((s) => (
          <button key={s}
            onClick={() => { setStatusFilter(s); setTableState((p) => ({ ...p, page: 1 })) }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all capitalize
              ${statusFilter === s ? 'bg-dark text-white' : 'bg-cream text-dark/60 hover:text-dark'}`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={companies}
        total={total}
        tableState={tableState}
        onStateChange={setTableState}
        loading={isLoading}
        emptyMessage="No companies found"
        onRowClick={(row) => setSelectedCompany(row)}
      />

      <Modal open={!!selectedCompany} onClose={() => setSelectedCompany(null)} title="Company Details" size="lg">
        {selectedCompany && (
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Name', selectedCompany.name],
              ['Email', selectedCompany.email],
              ['Category', selectedCompany.category],
              ['City', selectedCompany.city],
              ['Status', selectedCompany.status],
              ['Commission', `${selectedCompany.commission}%`],
              ['Views', selectedCompany.views],
              ['Uses', selectedCompany.uses],
              ['Joined', new Date(selectedCompany.join_date).toLocaleDateString()],
            ].map(([label, value]) => (
              <div key={label as string} className="p-3 bg-cream/50 rounded-xl">
                <p className="text-xs text-dark/40 mb-1">{label as string}</p>
                <p className="font-bold text-dark text-sm">{value as string}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onConfirm={() => { if (deleteTarget) deleteMutation.mutate(deleteTarget.id); setDeleteTarget(null) }}
        onCancel={() => setDeleteTarget(null)}
        title="Delete Company"
        message={`Are you sure? This cannot be undone.`}
        variant="danger"
      />
    </div>
  )
}
