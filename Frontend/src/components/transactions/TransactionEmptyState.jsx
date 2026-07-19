export default function TransactionEmptyState({ hasFilters, onClearFilters }) {
  if (hasFilters) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🧾</div>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>No transactions found</h3>
        <p>Try adjusting your filters or search terms to find what you're looking for.</p>
        <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={onClearFilters}>Clear Filters</button>
      </div>
    )
  }

  return (
    <div className="empty-state">
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <span style={{ fontSize: 28, color: 'var(--green)' }}>+</span>
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>No transactions yet</h3>
      <p>Transactions are automatically created when you add income or expenses. Start by adding your first income or expense entry.</p>
    </div>
  )
}
