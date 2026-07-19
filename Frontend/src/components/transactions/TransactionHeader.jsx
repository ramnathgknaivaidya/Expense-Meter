import { Search, Filter } from '../icons'
import { debounce } from '../../lib/transactions'

export default function TransactionHeader({
  searchQuery, onSearchChange, onToggleFilters, showFilters
}) {
  const debouncedSearch = debounce((value) => onSearchChange(value), 300)

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Transactions</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>View and track all your financial transactions</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={onToggleFilters}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Filter size={14} /> Filters
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', marginTop: 16 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
          <Search size={16} />
        </span>
        <input
          type="search"
          placeholder="Search transactions by category, merchant, description..."
          defaultValue={searchQuery}
          onChange={(e) => debouncedSearch(e.target.value)}
          style={{
            width: '100%', padding: '12px 16px 12px 40px',
            border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
            background: 'var(--surface)', color: 'var(--text)', fontSize: 15,
            outline: 'none',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--green)'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.1)' }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }}
        />
      </div>
    </div>
  )
}
