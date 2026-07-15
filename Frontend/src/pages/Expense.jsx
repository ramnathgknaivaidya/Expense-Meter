import { useState, useEffect } from 'react';
import { expenseAPI, reportAPI } from '../api/client';

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Bills', 'Shopping', 'Healthcare', 'Education', 'Entertainment', 'Travel', 'Other'];
const PAYMENT_METHODS = ['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Bank Transfer'];

export default function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: '', category: 'Food', paymentMethod: 'UPI', merchant: '', date: new Date().toISOString().split('T')[0], description: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([expenseAPI.getAll({ limit: 100 }), reportAPI.getExpenseAnalytics()])
      .then(([expRes, anaRes]) => {
        setExpenses(expRes.data.data.expenses || []);
        setAnalytics(anaRes.data.data);
      }).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await expenseAPI.update(editing, form); } else { await expenseAPI.create(form); }
      setShowForm(false); setEditing(null); setForm({ amount: '', category: 'Food', paymentMethod: 'UPI', merchant: '', date: new Date().toISOString().split('T')[0], description: '' });
      loadData();
    } catch (err) { alert(err.response?.data?.message || 'Error saving expense'); }
  };

  const handleEdit = (exp) => {
    setForm({ amount: exp.amount, category: exp.category, paymentMethod: exp.paymentMethod, merchant: exp.merchant || '', date: new Date(exp.date).toISOString().split('T')[0], description: exp.description });
    setEditing(exp._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this expense?')) return;
    try { await expenseAPI.delete(id); loadData(); } catch (err) { alert('Error deleting'); }
  };

  if (loading) return <div className="page-body"><p>Loading...</p></div>;
  const highest = analytics?.highestCategory;
  const highestCat = CATEGORIES.find((c) => c === highest);

  return (
    <div>
      <div className="page-header">
        <h2>💳 Control Your Spending</h2>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ amount: '', category: 'Food', paymentMethod: 'UPI', merchant: '', date: new Date().toISOString().split('T')[0], description: '' }); }}>
            {showForm ? '✕ Cancel' : '+ Add Expense'}
          </button>
        </div>
      </div>
      <div className="page-body">
        {analytics && (
          <div className="grid-4" style={{ marginBottom: 24 }}>
            <div className="card summary-card">
              <div className="sc-icon icon-red">📊</div>
              <div className="sc-label">Total Expense</div>
              <div className="sc-value">₹{(analytics.totalExpense || 0).toLocaleString()}</div>
              <div className="sc-change negative">↓ This month</div>
            </div>
            <div className="card summary-card">
              <div className="sc-icon icon-orange">🏆</div>
              <div className="sc-label">Highest Category</div>
              <div className="sc-value" style={{ fontSize: '1.1rem' }}>{highestCat || 'N/A'}</div>
              <div className="sc-change negative">Top spender</div>
            </div>
            <div className="card summary-card">
              <div className="sc-icon icon-blue">📋</div>
              <div className="sc-label">Categories Used</div>
              <div className="sc-value" style={{ fontSize: '1.1rem' }}>{analytics.categoryDistribution?.length || 0}</div>
              <div className="sc-change">Active categories</div>
            </div>
            <div className="card summary-card">
              <div className="sc-icon icon-green">📈</div>
              <div className="sc-label">Daily Average</div>
              <div className="sc-value" style={{ fontSize: '1.1rem' }}>₹{Math.round((analytics.totalExpense || 0) / 30)}</div>
              <div className="sc-change negative">Per day</div>
            </div>
          </div>
        )}

        {analytics?.categoryDistribution?.length > 0 && (
          <div className="grid-2" style={{ marginBottom: 24 }}>
            {analytics.categoryDistribution.slice(0, 6).map((c) => (
              <div key={c.category} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="sc-icon icon-red" style={{ width: 38, height: 38, fontSize: '1rem' }}>💳</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.category}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{c.percentage}% of spending</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>₹{c.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>{editing ? 'Edit Expense' : 'Add Expense'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="800" min="0" required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
                    {PAYMENT_METHODS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Merchant Name</label>
                <input type="text" value={form.merchant} onChange={(e) => setForm({ ...form, merchant: e.target.value })} placeholder="Store or service name" />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional notes" />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" type="submit">{editing ? 'Update Expense' : 'Add Expense'}</button>
                <button className="btn btn-outline" type="button" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          <div className="card-header"><h3>Expense Records</h3></div>
          {expenses.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">💳</div><p>No expenses recorded yet. Start tracking your spending!</p></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Category</th><th>Amount</th><th>Merchant</th><th>Payment</th><th>Date</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => (
                    <tr key={exp._id}>
                      <td><span className="badge badge-expense">{exp.category}</span></td>
                      <td style={{ fontWeight: 600, color: 'var(--red)' }}>-₹{exp.amount.toLocaleString()}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{exp.merchant || '-'}</td>
                      <td>{exp.paymentMethod}</td>
                      <td>{new Date(exp.date).toLocaleDateString('en-IN')}</td>
                      <td>
                        <div className="tx-actions">
                          <button className="btn btn-sm btn-outline" onClick={() => handleEdit(exp)}>✏️</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(exp._id)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
