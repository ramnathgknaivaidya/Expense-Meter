import { useState } from 'react'
import { useTransactions } from '../../hooks/useTransactions'
import TransactionHeader from './TransactionHeader'
import TransactionFilters from './TransactionFilters'
import TransactionCard from './TransactionCard'
import TransactionDetailsModal from './TransactionDetailsModal'
import TransactionFormModal from './TransactionFormModal'
import TransactionDeleteDialog from './TransactionDeleteDialog'
import TransactionSummary from './TransactionSummary'
import TransactionSkeleton from './TransactionSkeleton'
import TransactionEmptyState from './TransactionEmptyState'
import TransactionErrorState from './TransactionErrorState'

export default function TransactionPage() {
  const {
    transactions, summary, filters, setFilters,
    addTransaction, updateTransaction, deleteTransaction, duplicateTransaction,
  } = useTransactions()

  const [showFilters, setShowFilters] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [deletingTransaction, setDeletingTransaction] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleView = (t) => setSelectedTransaction(t)
  const handleEdit = (t) => { setSelectedTransaction(null); setEditingTransaction(t) }
  const handleDelete = (t) => { setSelectedTransaction(null); setDeletingTransaction(t) }
  const handleDuplicate = (t) => duplicateTransaction(t.id)

  const handleSaveTransaction = (data) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data)
      setEditingTransaction(null)
    } else {
      addTransaction(data)
      setIsAdding(false)
    }
  }

  const handleClearFilters = () => {
    setFilters({ searchQuery: '', dateRange: 'this_month', sortBy: 'newest' })
  }

  const hasActiveFilters = filters.type || filters.category || filters.paymentMethod ||
    filters.minAmount !== undefined || filters.maxAmount !== undefined

  if (error) {
    return (
      <div className="page-body">
        <TransactionErrorState error={error} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  return (
    <div className="page-body">
      <TransactionHeader
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters({ ...filters, searchQuery: q })}
        onAddTransaction={() => { setIsAdding(true); setEditingTransaction(null) }}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
      />

      {showFilters && (
        <TransactionFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
        />
      )}

      <TransactionSummary summary={summary} />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(5)].map((_, i) => <TransactionSkeleton key={i} />)}
        </div>
      ) : transactions.length === 0 ? (
        <TransactionEmptyState
          onAddTransaction={() => setIsAdding(true)}
          hasFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <div>
          {transactions.map((t) => (
            <TransactionCard
              key={t.id}
              transaction={t}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      )}

      <TransactionDetailsModal
        transaction={selectedTransaction}
        open={!!selectedTransaction}
        onOpenChange={(open) => !open && setSelectedTransaction(null)}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />

      <TransactionFormModal
        transaction={editingTransaction}
        open={!!editingTransaction || isAdding}
        onOpenChange={(open) => { if (!open) { setEditingTransaction(null); setIsAdding(false) } }}
        onSave={handleSaveTransaction}
      />

      <TransactionDeleteDialog
        transaction={deletingTransaction}
        open={!!deletingTransaction}
        onOpenChange={(open) => !open && setDeletingTransaction(null)}
        onConfirm={() => { if (deletingTransaction) deleteTransaction(deletingTransaction.id); setDeletingTransaction(null) }}
      />
    </div>
  )
}
