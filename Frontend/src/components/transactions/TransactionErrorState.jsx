import { AlertCircle, RefreshCw } from '../icons'

export default function TransactionErrorState({ error, onRetry }) {
  return (
    <div className="empty-state">
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <AlertCircle size={28} color="var(--red)" />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>Something went wrong</h3>
      <p>{error || 'Failed to load transactions. Please try again.'}</p>
      <button className="btn btn-outline" style={{ marginTop: 16, gap: 8 }} onClick={onRetry}>
        <RefreshCw size={16} /> Try Again
      </button>
    </div>
  )
}
