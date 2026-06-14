import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Download, RefreshCw } from 'lucide-react'
import { UsersTable } from '../user/UsersTable'
import { useUsers, useDeleteUser, useUserStats } from '../../api'
import { Modal, Button, StatCard, ConfirmDialog, Select, Breadcrumb } from '../../components/ui'
import type { User, TableState, UserPlan } from '../../types'

export const AdminUsersPage: React.FC = () => {
  const [tableState, setTableState] = useState<TableState>({ page: 1, limit: 10, sortBy: 'join_date', sortOrder: 'desc' })
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout>>()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [planFilter, setPlanFilter] = useState<string>('')

  const params = {
    ...tableState,
    search: tableState.search || undefined,
    plan: planFilter || undefined,
  }

  const { data, isLoading } = useUsers(params)
  const { data: statsData } = useUserStats()
  const deleteMutation = useDeleteUser()

  const handleSearch = useCallback((value: string) => {
    if (searchTimeout) clearTimeout(searchTimeout)
    const timeout = setTimeout(() => {
      setTableState((prev) => ({ ...prev, search: value, page: 1 }))
    }, 400)
    setSearchTimeout(timeout)
  }, [searchTimeout])

  const users = data?.data?.data ?? []
  const total = data?.data?.total ?? 0
  const stats = statsData?.data?.data

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteMutation.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { label: 'Admin Dashboard', href: '/dashboard/admin' },
        { label: 'Users' },
      ]} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-dark mb-2">Manage Users</h1>
        <p className="text-dark/50">{total} users registered</p>
      </motion.div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total" value={stats.total} icon={<span />} color="blue" />
          <StatCard title="Active" value={stats.active} icon={<span />} color="emerald" />
          {Object.entries(stats.byPlan || {}).map(([plan, count]) => (
            <StatCard key={plan} title={plan} value={count as number} icon={<span />} color="gold" />
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          options={[
            { value: '', label: 'All Plans' },
            { value: 'free', label: 'Free' },
            { value: 'premium', label: 'Premium' },
            { value: 'elite', label: 'Elite' },
          ]}
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          placeholder="All Plans"
          className="w-40"
        />
      </div>

      {/* Table */}
      <UsersTable
        data={users}
        total={total}
        tableState={tableState}
        onStateChange={setTableState}
        loading={isLoading}
        onView={(user) => setSelectedUser(user)}
        onDelete={(user) => setDeleteTarget(user)}
      />

      {/* User Detail Modal */}
      <Modal open={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Details" size="lg">
        {selectedUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'ID', value: selectedUser.id },
                { label: 'Name', value: selectedUser.name },
                { label: 'Email', value: selectedUser.email },
                { label: 'Phone', value: selectedUser.phone },
                { label: 'Specialty', value: selectedUser.job },
                { label: 'Plan', value: selectedUser.plan },
                { label: 'Governorate', value: selectedUser.governorate },
                { label: 'Scans', value: selectedUser.scans },
                { label: 'Saved', value: `${selectedUser.saved} EGP` },
                { label: 'Points', value: selectedUser.points },
                { label: 'Joined', value: new Date(selectedUser.join_date).toLocaleDateString() },
              ].map((field) => (
                <div key={field.label} className="p-3 bg-cream/50 rounded-xl">
                  <p className="text-xs text-dark/40 mb-1">{field.label}</p>
                  <p className="font-bold text-dark text-sm">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
