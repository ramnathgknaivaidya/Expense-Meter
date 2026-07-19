import { CATEGORY_CONFIGS, PAYMENT_METHODS, TRANSACTION_STATUS, formatCurrency, formatRelativeTime } from '../../lib/transactions'
import { Eye } from '../icons'

const getCategoryConfig = (category) => {
  const key = (category || '').toLowerCase()
  return CATEGORY_CONFIGS[key] || CATEGORY_CONFIGS.other
}

const getPaymentMethod = (method) => {
  const m = (method || '').toLowerCase()
  return PAYMENT_METHODS.find(p => p.value === m) || PAYMENT_METHODS.find(p => p.value === 'other')
}

export default function TransactionCard({ transaction, onView }) {
  const cfg = getCategoryConfig(transaction.category)
  const pm = getPaymentMethod(transaction.paymentMethod)
  const st = TRANSACTION_STATUS[transaction.status] || TRANSACTION_STATUS.completed
  const isIncome = transaction.type === 'income'
  const title = transaction.title || transaction.category || 'Transaction'
  const merchant = transaction.merchant || transaction.merchantOrSource || ''
  const currency = transaction.currency || 'INR'

  return (
    <div className="transaction-card" style={{
      borderLeft: `4px solid ${isIncome ? '#22c55e' : '#f97316'}`,
      borderRadius: 'var(--radius-sm)',
      padding: '14px 16px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderLeftWidth: 4,
      marginBottom: 8,
      transition: 'box-shadow 0.2s',
      cursor: 'default',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
    >
      <div className="tx-icon" style={{ background: cfg.bg, fontSize: 22 }}>{cfg.icon}</div>
      <div className="tx-info" style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="tx-title">{title}</span>
          <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>{isIncome ? 'Income' : 'Expense'}</span>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: st.color, display: 'inline-block' }} />
        </div>
        <div className="tx-meta" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          {merchant && <span>{merchant}</span>}
          {merchant && <span>•</span>}
          <span>{pm?.icon} {pm?.label}</span>
          <span>•</span>
          <span>{formatRelativeTime(transaction.date)}</span>
        </div>
      </div>
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        <div className={`tx-amount ${isIncome ? 'income' : 'expense'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
        </div>
        <div className="tx-actions" style={{ opacity: 0, transition: 'opacity 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0}>
          <button className="btn btn-outline btn-icon" style={{ width: 32, height: 32, padding: 0 }} onClick={() => onView(transaction)} title="View"><Eye size={14} /></button>
        </div>
      </div>
    </div>
  )
}
