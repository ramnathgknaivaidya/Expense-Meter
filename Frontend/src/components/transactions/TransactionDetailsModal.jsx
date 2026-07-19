import { CATEGORY_CONFIGS, PAYMENT_METHODS, TRANSACTION_STATUS, formatCurrency, formatDateTime } from '../../lib/transactions'
import { X, Calendar, CreditCard, Building2, Tag, FileText, Hash } from '../icons'

const getCategoryConfig = (category) => {
  const key = (category || '').toLowerCase()
  return CATEGORY_CONFIGS[key] || CATEGORY_CONFIGS.other
}

const getPaymentMethod = (method) => {
  const m = (method || '').toLowerCase()
  return PAYMENT_METHODS.find(p => p.value === m) || PAYMENT_METHODS.find(p => p.value === 'other')
}

export default function TransactionDetailsModal({ transaction, open, onOpenChange }) {
  if (!open || !transaction) return null

  const cfg = getCategoryConfig(transaction.category)
  const pm = getPaymentMethod(transaction.paymentMethod)
  const st = TRANSACTION_STATUS[transaction.status] || TRANSACTION_STATUS.completed
  const isIncome = transaction.type === 'income'
  const title = transaction.title || transaction.category || 'Transaction'
  const merchant = transaction.merchant || transaction.merchantOrSource || ''
  const currency = transaction.currency || 'INR'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => onOpenChange(false)} />
      <div className="card" style={{
        position: 'relative', zIndex: 1001, maxWidth: 600, width: '100%',
        maxHeight: '90vh', overflowY: 'auto', padding: 24,
        animation: 'fadeIn 0.2s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{cfg.icon}</div>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{title}</h2>
              <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: 14 }}>{merchant}</p>
            </div>
          </div>
          <button className="btn btn-outline btn-icon" onClick={() => onOpenChange(false)}><X size={16} /></button>
        </div>

        <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>Amount</p>
            <p style={{ margin: '4px 0 0', fontSize: 28, fontWeight: 700, color: isIncome ? 'var(--green)' : 'var(--orange)' }}>
              {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
            </p>
          </div>
          <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`} style={{ fontSize: 14, padding: '4px 12px' }}>
            {isIncome ? 'Income' : 'Expense'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} /> Date</p>
            <p style={{ margin: '4px 0 0', fontWeight: 500 }}>{formatDateTime(transaction.date)}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}><CreditCard size={14} /> Payment Method</p>
            <p style={{ margin: '4px 0 0', fontWeight: 500 }}>{pm?.icon} {pm?.label}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={14} /> Category</p>
            <p style={{ margin: '4px 0 0', fontWeight: 500 }}>{cfg.icon} {cfg.name}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: st.color, display: 'inline-block' }} /> Status
            </p>
            <p style={{ margin: '4px 0 0', fontWeight: 500 }}>{st.label}</p>
          </div>
        </div>

        {transaction.description && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--text-secondary)' }}>Description</p>
            <p style={{ margin: 0, fontSize: 14, background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: 12 }}>{transaction.description}</p>
          </div>
        )}

        <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--text-secondary)' }}>Timeline</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Created</span>
            <span style={{ fontWeight: 500 }}>{formatDateTime(transaction.createdAt)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Last Updated</span>
            <span style={{ fontWeight: 500 }}>{formatDateTime(transaction.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
