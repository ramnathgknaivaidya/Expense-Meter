import React, { useState, useEffect } from 'react';
import { IconBank, IconUpi, IconCash, IconCard, IconDraft, IconClose } from '../../utils/icons';

const SOURCE_OPTIONS = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Bonus',
  'Rental',
  'Other'
];

const PAYMENT_METHODS = [
  { id: 'Bank Transfer', icon: <IconBank size={16} /> },
  { id: 'UPI', icon: <IconUpi size={16} /> },
  { id: 'Cash', icon: <IconCash size={16} /> },
  { id: 'Card', icon: <IconCard size={16} /> },
];

export default function IncomeForm({ onSubmit, onToast, editingIncome, onCancelEdit }) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('Salary');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [description, setDescription] = useState('');
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    if (editingIncome) {
      setAmount(editingIncome.amount?.toString() || '');
      setSource(editingIncome.source || 'Salary');
      setDate(editingIncome.date ? new Date(editingIncome.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
      setPaymentMethod(editingIncome.paymentMethod || 'Bank Transfer');
      setDescription(editingIncome.description || '');
    }
  }, [editingIncome]);

  useEffect(() => {
    if (!editingIncome) {
      const draft = localStorage.getItem('income_draft');
      if (draft) {
        setHasDraft(true);
      }
    }
  }, [editingIncome]);

  const handleSaveDraft = () => {
    const draftData = {
      amount,
      source,
      date,
      paymentMethod,
      description,
    };
    localStorage.setItem('income_draft', JSON.stringify(draftData));
    setHasDraft(true);
    onToast('success', 'Draft saved successfully!');
  };

  const handleLoadDraft = () => {
    const draft = localStorage.getItem('income_draft');
    if (draft) {
      const draftData = JSON.parse(draft);
      setAmount(draftData.amount || '');
      setSource(draftData.source || 'Salary');
      setDate(draftData.date || new Date().toISOString().split('T')[0]);
      setPaymentMethod(draftData.paymentMethod || 'Bank Transfer');
      setDescription(draftData.description || '');
      onToast('success', 'Draft loaded successfully!');
    }
  };

  const handleClearForm = () => {
    setAmount('');
    setSource('Salary');
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('Bank Transfer');
    setDescription('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      onToast('error', 'Please enter a valid amount.');
      return;
    }

    const incomeData = {
      amount: parseFloat(amount),
      source,
      date: new Date(date).toISOString(),
      paymentMethod,
      description: description.trim(),
    };

    if (editingIncome) {
      onSubmit({ ...incomeData, id: editingIncome.id });
    } else {
      onSubmit(incomeData);
    }
    handleClearForm();
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingIncome ? 'Edit Income' : 'Add New Income'}</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '520px' }}>
            {editingIncome ? 'Update the income entry details below.' : 'Enter income details with clean fields for amount, source, date, payment method, and a short description.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {!editingIncome && hasDraft && (
            <button type="button" className="btn btn-sm btn-outline" onClick={handleLoadDraft}>
              <IconDraft size={16} /> Load Draft
            </button>
          )}
          <button type="button" className="btn btn-sm btn-outline" onClick={editingIncome ? onCancelEdit : handleClearForm}>
            <IconClose size={16} /> Cancel
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label>Income Source</label>
            <select value={source} onChange={(e) => setSource(e.target.value)} required>
              {SOURCE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
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
            <label>Payment Method</label>
            <div className="payment-options">
              {PAYMENT_METHODS.map((pm) => (
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
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a short note for this income entry"
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1.5, justifyContent: 'center' }}>
            {editingIncome ? 'Update Income' : 'Save Income'}
          </button>
          <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={editingIncome ? onCancelEdit : handleClearForm}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
