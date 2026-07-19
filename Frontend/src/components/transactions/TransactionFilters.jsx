import { CATEGORY_CONFIGS, PAYMENT_METHODS, DATE_RANGE_OPTIONS, SORT_OPTIONS } from '../../lib/transactions'

const selectStyle = {
  width: '100%', padding: '8px 12px',
  border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
  background: 'var(--surface)', color: 'var(--text)', fontSize: 14,
  outline: 'none', cursor: 'pointer',
}

export default function TransactionFilters({ filters, onFiltersChange, onClearFilters }) {
  const updateFilter = (key, value) => onFiltersChange({ ...filters, [key]: value })

  const hasActiveFilters = filters.type || filters.category || filters.paymentMethod ||
    filters.minAmount !== undefined || filters.maxAmount !== undefined

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>📅 Filters</h3>
        {hasActiveFilters && (
          <button className="btn btn-outline btn-sm" onClick={onClearFilters}>✕ Clear All</button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        <div className="form-group">
          <label>Date Range</label>
          <select value={filters.dateRange} onChange={(e) => updateFilter('dateRange', e.target.value)} style={selectStyle}>
            {DATE_RANGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Transaction Type</label>
          <select value={filters.type || 'all'} onChange={(e) => updateFilter('type', e.target.value === 'all' ? undefined : e.target.value)} style={selectStyle}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select value={filters.category || 'all'} onChange={(e) => updateFilter('category', e.target.value === 'all' ? undefined : e.target.value)} style={selectStyle}>
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_CONFIGS).map(([key, c]) => (
              <option key={key} value={key}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Payment Method</label>
          <select value={filters.paymentMethod || 'all'} onChange={(e) => updateFilter('paymentMethod', e.target.value === 'all' ? undefined : e.target.value)} style={selectStyle}>
            <option value="all">All Methods</option>
            {PAYMENT_METHODS.map(m => (
              <option key={m.value} value={m.value}>{m.icon} {m.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Sort By</label>
          <select value={filters.sortBy} onChange={(e) => updateFilter('sortBy', e.target.value)} style={selectStyle}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Amount Range</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="number" placeholder="Min" value={filters.minAmount || ''}
              onChange={(e) => updateFilter('minAmount', e.target.value ? Number(e.target.value) : undefined)}
              className="form-group" style={{ flex: 1, padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', color: 'var(--text)', outline: 'none' }} />
            <input type="number" placeholder="Max" value={filters.maxAmount || ''}
              onChange={(e) => updateFilter('maxAmount', e.target.value ? Number(e.target.value) : undefined)}
              style={{ flex: 1, padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', color: 'var(--text)', outline: 'none' }} />
          </div>
        </div>
      </div>

      {filters.dateRange === 'custom' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingTop: 16, borderTop: '1px solid var(--border)', marginTop: 16 }}>
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" value={filters.customDateStart ? filters.customDateStart.toISOString().split('T')[0] : ''}
              onChange={(e) => updateFilter('customDateStart', e.target.value ? new Date(e.target.value) : undefined)}
              style={{ width: '100%', padding: '8px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', color: 'var(--text)', outline: 'none' }} />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input type="date" value={filters.customDateEnd ? filters.customDateEnd.toISOString().split('T')[0] : ''}
              onChange={(e) => updateFilter('customDateEnd', e.target.value ? new Date(e.target.value) : undefined)}
              style={{ width: '100%', padding: '8px 12px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', color: 'var(--text)', outline: 'none' }} />
          </div>
        </div>
      )}
    </div>
  )
}
