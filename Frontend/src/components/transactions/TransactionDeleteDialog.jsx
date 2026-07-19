import { CATEGORY_CONFIGS, formatCurrency } from '../../lib/transactions'
import { AlertTriangle } from '../icons'

export default function TransactionDeleteDialog({ transaction, open, onOpenChange, onConfirm }) {
  if (!open || !transaction) return null

  const cfg = CATEGORY_CONFIGS[transaction.category]
  const isIncome = transaction.type === 'income'

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => onOpenChange(false)} />
      <div className="card" style={{ position: 'relative', zIndex: 1001, maxWidth: 450, width: '100%', padding: 24, animation: 'fadeIn 0.2s ease' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={24} color="var(--red)" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Delete Transaction</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: 14 }}>This action cannot be undone</p>
          </div>
        </div>

        <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{cfg.icon}</div>
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>{transaction.title}</p>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>{transaction.merchant}</p>
            </div>
          </div>
          <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: isIncome ? 'var(--green)' : 'var(--orange)' }}>
              {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
            </p>
          </div>
        </div>

        <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--text-secondary)' }}>
          Are you sure you want to delete this transaction? This action cannot be undone.
        </p>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" onClick={() => onOpenChange(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { onConfirm(); onOpenChange(false) }}>Delete Transaction</button>
        </div>
      </div>
    </div>
  )
}
