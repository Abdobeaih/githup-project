import React, { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react'
import type { TableColumn, TableState } from '../../types'

interface DataTableProps<T extends Record<string, any>> {
  columns: TableColumn<T>[]
  data: T[]
  total?: number
  tableState: TableState
  onStateChange: (state: TableState) => void
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  rowKey?: keyof T | ((row: T) => string)
  filters?: React.ReactNode
  actions?: React.ReactNode
  selectable?: boolean
  selectedRows?: Set<string>
  onSelectionChange?: (selected: Set<string>) => void
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  total = 0,
  tableState,
  onStateChange,
  loading = false,
  emptyMessage = 'No data found',
  onRowClick,
  rowKey = 'id' as keyof T,
  filters,
  actions,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
}: DataTableProps<T>) {
  const [searchInput, setSearchInput] = useState(tableState.search || '')
  const totalPages = Math.ceil(total / tableState.limit) || 1

  const handleSort = (key: string) => {
    const order = tableState.sortBy === key && tableState.sortOrder === 'asc' ? 'desc' : 'asc'
    onStateChange({ ...tableState, sortBy: key, sortOrder: order })
  }

  const handleSearch = () => {
    onStateChange({ ...tableState, search: searchInput, page: 1 })
  }

  const handlePageChange = (page: number) => {
    onStateChange({ ...tableState, page })
  }

  const getRowKey = (row: T): string => {
    if (typeof rowKey === 'function') return rowKey(row)
    return String(row[rowKey])
  }

  const toggleRow = (key: string) => {
    if (!onSelectionChange) return
    const next = new Set(selectedRows)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    onSelectionChange(next)
  }

  const toggleAll = () => {
    if (!onSelectionChange) return
    if (selectedRows.size === data.length) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(data.map(getRowKey)))
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search..."
            className="w-full pl-4 pr-10 py-2 rounded-xl border border-gold/20 bg-cream/30 text-sm text-dark placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>
        {filters && (
          <div className="flex items-center gap-2 text-sm text-dark/60">
            <SlidersHorizontal size={16} />
            {filters}
          </div>
        )}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gold/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-dark/5 border-b border-gold/10">
              {selectable && (
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selectedRows.size === data.length}
                    onChange={toggleAll}
                    className="rounded border-gold/40 text-gold focus:ring-gold/30"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`p-4 text-start font-bold text-dark/60 text-xs uppercase tracking-wider
                    ${col.sortable ? 'cursor-pointer select-none hover:text-dark' : ''}
                    ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-end' : ''}`}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && tableState.sortBy === col.key && (
                      tableState.sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gold/5">
                  {selectable && <td className="p-4"><div className="h-4 w-4 bg-dark/5 rounded animate-pulse" /></td>}
                  {columns.map((col) => (
                    <td key={col.key} className="p-4"><div className="h-4 bg-dark/5 rounded animate-pulse w-3/4" /></td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="p-12 text-center text-dark/40">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const key = getRowKey(row)
                return (
                  <tr
                    key={key}
                    className={`border-b border-gold/5 transition-colors
                      ${onRowClick ? 'cursor-pointer hover:bg-gold/5' : ''}
                      ${selectedRows.has(key) ? 'bg-gold/5' : ''}`}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {selectable && (
                      <td className="p-4 w-10" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedRows.has(key)}
                          onChange={() => toggleRow(key)}
                          className="rounded border-gold/40 text-gold focus:ring-gold/30"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`p-4 ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-end' : ''}`}
                      >
                        {col.render
                          ? col.render(row[col.key], row, rowIndex)
                          : String(row[col.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-dark/50">
            {total} total
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(tableState.page - 1)}
              disabled={tableState.page <= 1}
              className="p-2 rounded-xl hover:bg-dark/5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let page: number
              if (totalPages <= 7) {
                page = i + 1
              } else if (tableState.page <= 4) {
                page = i + 1
              } else if (tableState.page >= totalPages - 3) {
                page = totalPages - 6 + i
              } else {
                page = tableState.page - 3 + i
              }
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded-xl font-bold text-sm transition-colors
                    ${page === tableState.page
                      ? 'bg-gold text-white'
                      : 'hover:bg-dark/5 text-dark/60'
                    }`}
                >
                  {page}
                </button>
              )
            })}
            <button
              onClick={() => handlePageChange(tableState.page + 1)}
              disabled={tableState.page >= totalPages}
              className="p-2 rounded-xl hover:bg-dark/5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
