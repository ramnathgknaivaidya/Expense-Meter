import { CATEGORY_CONFIGS, PAYMENT_METHODS, TRANSACTION_STATUS, formatCurrency, formatRelativeTime } from '../../lib/transactions'
import { Eye, Edit, Trash2, Copy } from '../icons'

export default function TransactionCard({ transaction, onView, onEdit, onDelete, onDuplicate }) {
  const cfg = CATEGORY_CONFIGS[transaction.category]
  const pm = PAYMENT_METHODS.find(m => m.value === transaction.paymentMethod)
  const st = TRANSACTION_STATUS[transaction.status]
  const isIncome = transaction.type === 'income'

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
          <span className="tx-title">{transaction.title}</span>
          <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>{isIncome ? 'Income' : 'Expense'}</span>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: st.color, display: 'inline-block' }} />
        </div>
        <div className="tx-meta" style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          <span>{transaction.merchant}</span>
          <span>•</span>
          <span>{pm?.icon} {pm?.label}</span>
          <span>•</span>
          <span>{formatRelativeTime(transaction.date)}</span>
          {transaction.tags?.length > 0 && (
            <>
              <span>•</span>
              <span>{transaction.tags.slice(0, 2).join(', ')}{transaction.tags.length > 2 ? ` +${transaction.tags.length - 2}` : ''}</span>
            </>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        <div className={`tx-amount ${isIncome ? 'income' : 'expense'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
        </div>
        <div className="tx-actions" style={{ opacity: 0, transition: 'opacity 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0}>
          <button className="btn btn-outline btn-icon" style={{ width: 32, height: 32, padding: 0 }} onClick={() => onView(transaction)} title="View"><Eye size={14} /></button>
          <button className="btn btn-outline btn-icon" style={{ width: 32, height: 32, padding: 0 }} onClick={() => onEdit(transaction)} title="Edit"><Edit size={14} /></button>
          <button className="btn btn-outline btn-icon" style={{ width: 32, height: 32, padding: 0 }} onClick={() => onDuplicate(transaction)} title="Duplicate"><Copy size={14} /></button>
          <button className="btn btn-danger btn-icon" style={{ width: 32, height: 32, padding: 0 }} onClick={() => onDelete(transaction)} title="Delete"><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  )
}
