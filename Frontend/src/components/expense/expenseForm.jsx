import React, { useState, useEffect } from 'react';
import { IconCash, IconUpi, IconCard, IconBank, IconDraft, IconClose, IconCamera, IconFile, IconExpense, IconBackup } from '../../utils/icons';

const CATEGORIES = [
  'Food',
  'Transport',
  'Housing',
  'Bills',
  'Shopping',
  'Healthcare',
  'Education',
  'Entertainment',
  'Travel',
  'Other'
];

const PAYMENT_METHODS = [
  { id: 'Cash', icon: <IconCash size={16} /> },
  { id: 'UPI', icon: <IconUpi size={16} /> },
  { id: 'Debit Card', icon: <IconCard size={16} /> },
  { id: 'Credit Card', icon: <IconCard size={16} /> },
  { id: 'Bank Transfer', icon: <IconBank size={16} /> }
];

export default function ExpenseForm({ onSubmit, onToast }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [merchant, setMerchant] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState(null);
  const [hasDraft, setHasDraft] = useState(false);

  // Check for saved draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('expense_draft');
    if (draft) {
      setHasDraft(true);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setReceiptFile(e.dataTransfer.files[0]);
    }
  };

  const handleSaveDraft = () => {
    const draftData = {
      amount,
      category,
      date,
      paymentMethod,
      merchant,
      notes,
    };
    localStorage.setItem('expense_draft', JSON.stringify(draftData));
    setHasDraft(true);
    onToast('success', 'Draft saved successfully!');
  };

  const handleLoadDraft = () => {
    const draft = localStorage.getItem('expense_draft');
    if (draft) {
      const draftData = JSON.parse(draft);
      setAmount(draftData.amount || '');
      setCategory(draftData.category || 'Food');
      setDate(draftData.date || new Date().toISOString().split('T')[0]);
      setPaymentMethod(draftData.paymentMethod || 'UPI');
      setMerchant(draftData.merchant || '');
      setNotes(draftData.notes || '');
      onToast('success', 'Draft loaded successfully!');
    }
  };

  const handleClearDraft = () => {
    localStorage.removeItem('expense_draft');
    setHasDraft(false);
    onToast('success', 'Draft cleared.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      onToast('error', 'Please enter a valid amount.');
      return;
    }

    const expenseData = {
      amount: parseFloat(amount),
      category,
      date: new Date(date).toISOString(),
      paymentMethod,
      merchant,
      description: notes,
      receipt: receiptFile ? receiptFile.name : null
    };

    onSubmit(expenseData);

    // Reset Form
    setAmount('');
    setCategory('Food');
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('UPI');
    setMerchant('');
    setNotes('');
    setReceiptFile(null);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Record New Expense</h3>
        {hasDraft && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-sm btn-outline" onClick={handleLoadDraft}>
              <IconDraft size={16} /> Load Draft
            </button>
            <button type="button" className="btn btn-sm btn-outline" style={{ color: 'var(--red)' }} onClick={handleClearDraft}>
              ✕
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              required
              style={{ borderLeft: '4px solid var(--orange)' }}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Merchant Name</label>
            <input
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Amazon, Swiggy"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Payment Method</label>
          <div className="payment-options">
            {PAYMENT_METHODS.map(pm => (
              <button
                key={pm.id}
                type="button"
                className={`payment-btn ${paymentMethod === pm.id ? 'active' : ''}`}
                onClick={() => setPaymentMethod(pm.id)}
              >
                <span style={{ fontSize: '1.2rem' }}>{pm.icon}</span>
                <span>{pm.id}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add detailed spending description..."
          />
        </div>

        {/* Drag & Drop Receipt Upload */}
        <div className="form-group">
          <label>Receipt Upload</label>
          <div 
            className="upload-container"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('receipt-file').click()}
          >
            <input 
              id="receipt-file"
              type="file" 
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept="image/*,.pdf"
            />
            <div className="upload-icon"><IconCamera size={16} /></div>
            <div className="upload-text">Drag & drop receipt image or click to browse</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Supports JPG, PNG, PDF up to 2MB</span>
          </div>

          {receiptFile && (
            <div className="upload-preview">
              <span className="upload-filename"><IconFile size={16} /> {receiptFile.name}</span>
              <button type="button" className="remove-upload" onClick={(e) => { e.stopPropagation(); setReceiptFile(null); }}>
              <IconClose size={16} />
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1.5, background: 'var(--orange)', justifyContent: 'center' }}>
            <IconExpense size={16} /> Add Expense
          </button>
          <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSaveDraft}>
            <IconBackup size={16} /> Save Draft
          </button>
        </div>
      </form>
    </div>
  );
}
