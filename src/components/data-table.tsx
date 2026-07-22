import { useState, useMemo, type ReactNode } from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, SlidersHorizontal, Download, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  hidden?: boolean
  render?: (item: T) => ReactNode
  cellClassName?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  total?: number
  page?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  onSort?: (key: string, order: 'asc' | 'desc') => void
  onSearch?: (query: string) => void
  onExport?: () => void
  searchPlaceholder?: string
  sortKey?: string
  sortOrder?: 'asc' | 'desc'
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  idKey?: string
  isLoading?: boolean
  emptyMessage?: string
  bulkActions?: ReactNode
  filters?: ReactNode
  children?: ReactNode
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onSort,
  onSearch,
  onExport,
  searchPlaceholder = 'Search...',
  sortKey,
  sortOrder,
  selectedIds = [],
  onSelectionChange,
  idKey = 'id',
  isLoading,
  emptyMessage = 'No data found',
  bulkActions,
  filters,
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = useState('')
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.filter((c) => !c.hidden).map((c) => c.key)),
  )
  const totalPages = Math.ceil(total / pageSize)

  const visibleCols = useMemo(
    () => columns.filter((c) => visibleColumns.has(c.key)),
    [columns, visibleColumns],
  )

  const handleSearch = (value: string) => {
    setSearchValue(value)
    onSearch?.(value)
  }

  const toggleColumn = (key: string) => {
    const next = new Set(visibleColumns)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setVisibleColumns(next)
  }

  const selectAll = () => {
    if (selectedIds.length === data.length) {
      onSelectionChange?.([])
    } else {
      onSelectionChange?.(data.map((item) => item[idKey] as string))
    }
  }

  const selectOne = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id]
    onSelectionChange?.(next)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {filters && <div className="flex items-center gap-2">{filters}</div>}
        </div>
        <div className="flex items-center gap-2">
          {bulkActions && selectedIds.length > 0 && (
            <div className="flex items-center gap-2 mr-2">{bulkActions}</div>
          )}
          <DropdownMenu
            trigger={
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Columns
              </Button>
            }
          >
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map((col) => (
              <DropdownMenuItem key={col.key} onClick={() => toggleColumn(col.key)}>
                {visibleColumns.has(col.key) ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
                {col.header}
              </DropdownMenuItem>
            ))}
          </DropdownMenu>
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                {onSelectionChange && (
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={data.length > 0 && selectedIds.length === data.length}
                      onChange={selectAll}
                      className="rounded border-border"
                    />
                  </th>
                )}
                {visibleCols.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground',
                      col.sortable && 'cursor-pointer select-none hover:text-foreground',
                    )}
                    onClick={() => {
                      if (col.sortable && onSort) {
                        const order = sortKey === col.key && sortOrder === 'asc' ? 'desc' : 'asc'
                        onSort(col.key, order)
                      }
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {col.sortable && (
                        <span className="inline-flex">
                          {sortKey === col.key ? (
                            sortOrder === 'asc' ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )
                          ) : (
                            <ChevronsUpDown className="h-3 w-3 opacity-30" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {onSelectionChange && <td className="px-4 py-3" />}
                    {visibleCols.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleCols.length + (onSelectionChange ? 1 : 0)}
                    className="px-4 py-12 text-center text-sm text-muted-foreground"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item[idKey] as string}
                    className={cn(
                      'transition-colors hover:bg-muted/50',
                      selectedIds.includes(item[idKey] as string) && 'bg-primary/5',
                    )}
                  >
                    {onSelectionChange && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item[idKey] as string)}
                          onChange={() => selectOne(item[idKey] as string)}
                          className="rounded border-border"
                        />
                      </td>
                    )}
                    {visibleCols.map((col) => (
                      <td
                        key={col.key}
                        className={cn('px-4 py-3 text-sm', col.cellClassName)}
                      >
                        {col.render ? col.render(item) : (item[col.key] as ReactNode) ?? '-'}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {Math.min((page - 1) * pageSize + 1, total)} to {Math.min(page * pageSize, total)} of {total} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const pageNum = page <= 3 ? i + 1 : page + i - 2
                if (pageNum < 1 || pageNum > totalPages) return null
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? 'default' : 'outline'}
                    size="sm"
                    className="w-9"
                    onClick={() => onPageChange?.(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
