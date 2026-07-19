import { CATEGORY_CONFIGS, PAYMENT_METHODS, TRANSACTION_STATUS, formatCurrency, formatDateTime } from '../../lib/transactions'
import { Edit, Copy, Trash2, X, Calendar, CreditCard, Building2, Tag, FileText, Hash } from '../icons'

export default function TransactionDetailsModal({ transaction, open, onOpenChange, onEdit, onDuplicate, onDelete }) {
  if (!open || !transaction) return null

  const cfg = CATEGORY_CONFIGS[transaction.category]
  const pm = PAYMENT_METHODS.find(m => m.value === transaction.paymentMethod)
  const st = TRANSACTION_STATUS[transaction.status]
  const isIncome = transaction.type === 'income'

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
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{transaction.title}</h2>
              <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: 14 }}>{transaction.merchant}</p>
            </div>
          </div>
          <button className="btn btn-outline btn-icon" onClick={() => onOpenChange(false)}><X size={16} /></button>
        </div>

        <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>Amount</p>
            <p style={{ margin: '4px 0 0', fontSize: 28, fontWeight: 700, color: isIncome ? 'var(--green)' : 'var(--orange)' }}>
              {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
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

        {transaction.notes && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}><FileText size={14} /> Notes</p>
            <p style={{ margin: 0, fontSize: 14, background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: 12 }}>{transaction.notes}</p>
          </div>
        )}

        {transaction.tags?.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}><Tag size={14} /> Tags</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {transaction.tags.map((tag, i) => (
                <span key={i} className="badge badge-income" style={{ background: 'var(--bg)', color: 'var(--text)' }}>{tag}</span>
              ))}
            </div>
          </div>
        )}

        {transaction.referenceNumber && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}><Hash size={14} /> Reference Number</p>
            <p style={{ margin: 0, fontSize: 13, fontFamily: 'monospace', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: 12 }}>{transaction.referenceNumber}</p>
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

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-outline btn-sm" style={{ gap: 6 }} onClick={() => { onEdit(transaction); onOpenChange(false) }}><Edit size={14} /> Edit</button>
          <button className="btn btn-outline btn-sm" style={{ gap: 6 }} onClick={() => { onDuplicate(transaction); onOpenChange(false) }}><Copy size={14} /> Duplicate</button>
          <button className="btn btn-danger btn-sm" style={{ gap: 6 }} onClick={() => { onDelete(transaction); onOpenChange(false) }}><Trash2 size={14} /> Delete</button>
        </div>
      </div>
    </div>
  )
}
