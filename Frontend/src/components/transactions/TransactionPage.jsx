import { useState } from 'react'
import { useTransactions } from '../../hooks/useTransactions'
import TransactionHeader from './TransactionHeader'
import TransactionFilters from './TransactionFilters'
import TransactionCard from './TransactionCard'
import TransactionDetailsModal from './TransactionDetailsModal'
import TransactionSummary from './TransactionSummary'
import TransactionSkeleton from './TransactionSkeleton'
import TransactionEmptyState from './TransactionEmptyState'
import TransactionErrorState from './TransactionErrorState'

export default function TransactionPage() {
  const {
    transactions, summary, loading, error, filters, setFilters, refresh,
  } = useTransactions()

  const [showFilters, setShowFilters] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const handleView = (t) => setSelectedTransaction(t)

  const handleClearFilters = () => {
    setFilters({ searchQuery: '', dateRange: 'this_month', sortBy: 'newest' })
  }

  const hasActiveFilters = filters.type || filters.category || filters.paymentMethod ||
    filters.minAmount !== undefined || filters.maxAmount !== undefined

  if (error) {
    return (
      <div className="page-body">
        <TransactionErrorState error={error} onRetry={refresh} />
      </div>
    )
  }

  return (
    <div className="page-body">
      <TransactionHeader
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters({ ...filters, searchQuery: q })}
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
          hasFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <div>
          {transactions.map((t) => (
            <TransactionCard
              key={t.id || t._id}
              transaction={t}
              onView={handleView}
            />
          ))}
        </div>
      )}

      <TransactionDetailsModal
        transaction={selectedTransaction}
        open={!!selectedTransaction}
        onOpenChange={(open) => !open && setSelectedTransaction(null)}
      />
    </div>
  )
}
