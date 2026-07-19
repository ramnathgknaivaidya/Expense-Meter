import { useState, useEffect } from 'react'
import { CATEGORY_CONFIGS, PAYMENT_METHODS } from '../../lib/transactions'
import { X, Save } from '../icons'

export default function TransactionFormModal({ transaction, open, onOpenChange, onSave }) {
  const [form, setForm] = useState({
    title: '', description: '', amount: 0, type: 'expense',
    category: 'other', paymentMethod: 'card', merchant: '',
    date: new Date(), currency: 'USD', notes: '', tags: [],
    status: 'completed', referenceNumber: '', userId: 'user-1',
  })
  const [tagInput, setTagInput] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (transaction) {
      setForm({
        title: transaction.title, description: transaction.description,
        amount: transaction.amount, type: transaction.type,
        category: transaction.category, paymentMethod: transaction.paymentMethod,
        merchant: transaction.merchant, date: transaction.date,
        currency: transaction.currency, notes: transaction.notes || '',
        tags: transaction.tags, status: transaction.status,
        referenceNumber: transaction.referenceNumber || '', userId: transaction.userId,
      })
    } else {
      setForm({ title: '', description: '', amount: 0, type: 'expense', category: 'other', paymentMethod: 'card', merchant: '', date: new Date(), currency: 'USD', notes: '', tags: [], status: 'completed', referenceNumber: '', userId: 'user-1' })
    }
    setHasChanges(false)
  }, [transaction, open])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      handleChange('tags', [...form.tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) { alert('Title is required'); return }
    if (!form.merchant.trim()) { alert('Merchant is required'); return }
    if (form.amount <= 0) { alert('Amount must be greater than 0'); return }
    onSave(form)
    onOpenChange(false)
  }

  const handleClose = () => {
    if (hasChanges && !confirm('You have unsaved changes. Are you sure you want to close?')) return
    onOpenChange(false)
  }

  if (!open) return null

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', color: 'var(--text)', outline: 'none', fontSize: 14 }
  const selectStyle = { ...inputStyle, cursor: 'pointer' }
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text)' }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={handleClose} />
      <div className="card" style={{ position: 'relative', zIndex: 1001, maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 24, animation: 'fadeIn 0.2s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{transaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="btn btn-outline btn-icon" onClick={handleClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <button type="button" className={`btn ${form.type === 'income' ? 'btn-primary' : 'btn-outline'}`} style={{ height: 44, justifyContent: 'center' }} onClick={() => handleChange('type', 'income')}>Income</button>
            <button type="button" className={`btn ${form.type === 'expense' ? 'btn-primary' : 'btn-outline'}`} style={{ height: 44, justifyContent: 'center' }} onClick={() => handleChange('type', 'expense')}>Expense</button>
          </div>

          <div className="form-group">
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={form.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Transaction title" required />
          </div>

          <div className="form-group">
            <label style={labelStyle}>Merchant *</label>
            <input style={inputStyle} value={form.merchant} onChange={(e) => handleChange('merchant', e.target.value)} placeholder="Merchant name" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label style={labelStyle}>Amount *</label>
              <input style={inputStyle} type="number" step="0.01" value={form.amount} onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)} placeholder="0.00" required />
            </div>
            <div className="form-group">
              <label style={labelStyle}>Currency</label>
              <select style={selectStyle} value={form.currency} onChange={(e) => handleChange('currency', e.target.value)}>
                <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="INR">INR</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label style={labelStyle}>Category</label>
            <select style={selectStyle} value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
              {Object.entries(CATEGORY_CONFIGS).map(([key, c]) => <option key={key} value={key}>{c.icon} {c.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label style={labelStyle}>Payment Method</label>
            <select style={selectStyle} value={form.paymentMethod} onChange={(e) => handleChange('paymentMethod', e.target.value)}>
              {PAYMENT_METHODS.map(m => <option key={m.value} value={m.value}>{m.icon} {m.label}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label style={labelStyle}>Date</label>
            <input style={inputStyle} type="date" value={form.date instanceof Date ? form.date.toISOString().split('T')[0] : form.date} onChange={(e) => handleChange('date', new Date(e.target.value))} />
          </div>

          <div className="form-group">
            <label style={labelStyle}>Description</label>
            <input style={inputStyle} value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Transaction description" />
          </div>

          <div className="form-group">
            <label style={labelStyle}>Notes</label>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} placeholder="Additional notes..." />
          </div>

          <div className="form-group">
            <label style={labelStyle}>Tags</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={inputStyle} value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} placeholder="Add tag and press Enter" />
              <button type="button" className="btn btn-outline btn-sm" onClick={handleAddTag}>Add</button>
            </div>
            {form.tags.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {form.tags.map((tag, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', fontSize: 13 }}>
                    {tag}
                    <button type="button" onClick={() => handleChange('tags', form.tags.filter(t => t !== tag))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, fontSize: 12 }}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label style={labelStyle}>Reference Number</label>
            <input style={inputStyle} value={form.referenceNumber} onChange={(e) => handleChange('referenceNumber', e.target.value)} placeholder="Optional reference number" />
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
            <button type="button" className="btn btn-outline" onClick={handleClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ gap: 6 }}><Save size={14} /> Save Transaction</button>
          </div>
        </form>
      </div>
    </div>
  )
}
