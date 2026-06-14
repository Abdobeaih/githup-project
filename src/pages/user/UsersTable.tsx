import React from 'react'
import type { User } from '../../types'
import { DataTable, StatusBadge, Button } from '../../components/ui'
import type { TableColumn, TableState } from '../../types'
import { Eye, Trash2 } from 'lucide-react'

interface UsersTableProps {
  data: User[]
  total: number
  tableState: TableState
  onStateChange: (state: TableState) => void
  loading: boolean
  onView: (user: User) => void
  onDelete: (user: User) => void
}

const planColors: Record<string, string> = {
  free: 'bg-gray-100 text-gray-600',
  premium: 'bg-gold/10 text-gold',
  elite: 'bg-purple-100 text-purple-700',
}

export const UsersTable: React.FC<UsersTableProps> = ({
  data, total, tableState, onStateChange, loading, onView, onDelete,
}) => {
  const columns: TableColumn<User>[] = [
    { key: 'id', label: 'ID', sortable: true, width: '140px' },
    { key: 'name', label: 'Name', sortable: true, searchable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'job', label: 'Specialty', sortable: true },
    {
      key: 'plan',
      label: 'Plan',
      sortable: true,
      render: (val: string) => (
        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${planColors[val] || 'bg-gray-100 text-gray-600'}`}>
          {val}
        </span>
      ),
    },
    { key: 'scans', label: 'Scans', sortable: true },
    { key: 'saved', label: 'Saved', sortable: true, render: (val: number) => `${val.toFixed(2)} EGP` },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      render: (_: any, row: User) => (
        <div className="flex items-center gap-2">
          <button onClick={() => onView(row)} className="p-1.5 hover:bg-gold/10 rounded-lg text-gold transition-all">
            <Eye size={16} />
          </button>
          <button onClick={() => onDelete(row)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-all">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      total={total}
      tableState={tableState}
      onStateChange={onStateChange}
      loading={loading}
      emptyMessage="No users found"
    />
  )
}
