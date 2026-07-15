import { useState, useEffect } from 'react';
import { incomeAPI, reportAPI } from '../api/client';
import { useNavigate } from 'react-router-dom';

const SOURCES = ['Salary', 'Freelance', 'Business', 'Investment', 'Bonus', 'Rental', 'Other'];
const PAYMENT_METHODS = ['Bank Transfer', 'Cash', 'UPI', 'Card'];

export default function Income() {
  const [incomes, setIncomes] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: '', source: 'Salary', paymentMethod: 'Bank Transfer', date: new Date().toISOString().split('T')[0], description: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = () => {
    setLoading(true);
    Promise.all([incomeAPI.getAll({ limit: 100 }), reportAPI.getIncomeAnalytics()])
      .then(([incRes, anaRes]) => {
        setIncomes(incRes.data.data.incomes || []);
        setAnalytics(anaRes.data.data);
      }).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await incomeAPI.update(editing, form); } else { await incomeAPI.create(form); }
      setShowForm(false); setEditing(null); setForm({ amount: '', source: 'Salary', paymentMethod: 'Bank Transfer', date: new Date().toISOString().split('T')[0], description: '' });
      loadData();
    } catch (err) { alert(err.response?.data?.message || 'Error saving income'); }
  };

  const handleEdit = (inc) => {
    setForm({ amount: inc.amount, source: inc.source, paymentMethod: inc.paymentMethod, date: new Date(inc.date).toISOString().split('T')[0], description: inc.description });
    setEditing(inc._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this income record?')) return;
    try { await incomeAPI.delete(id); loadData(); } catch (err) { alert('Error deleting'); }
  };

  if (loading) return <div className="page-body"><p>Loading...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h2>💰 Track Your Income</h2>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ amount: '', source: 'Salary', paymentMethod: 'Bank Transfer', date: new Date().toISOString().split('T')[0], description: '' }); }}>
            {showForm ? '✕ Cancel' : '+ Add Income'}
          </button>
        </div>
      </div>
      <div className="page-body">
        {analytics && (
          <div className="grid-4" style={{ marginBottom: 24 }}>
            <div className="card summary-card">
              <div className="sc-icon icon-blue">📊</div>
              <div className="sc-label">Total Income</div>
              <div className="sc-value">₹{(analytics.monthlyIncome || 0).toLocaleString()}</div>
              <div className="sc-change positive">↑ This month</div>
            </div>
            <div className="card summary-card">
              <div className="sc-icon icon-green">📈</div>
              <div className="sc-label">Monthly Growth</div>
              <div className="sc-value">{analytics.growthPercentage || 0}%</div>
              <div className={`sc-change ${(analytics.growthPercentage || 0) >= 0 ? 'positive' : 'negative'}`}>
                {analytics.growthPercentage >= 0 ? '↑ Growing' : '↓ Declining'}
              </div>
            </div>
            <div className="card summary-card">
              <div className="sc-icon icon-orange">🏆</div>
              <div className="sc-label">Top Source</div>
              <div className="sc-value" style={{ fontSize: '1.1rem' }}>{analytics.incomeSources?.[0]?.source || 'N/A'}</div>
              <div className="sc-change positive">{analytics.incomeSources?.[0]?.percentage || 0}% contribution</div>
            </div>
            <div className="card summary-card">
              <div className="sc-icon icon-blue">📋</div>
              <div className="sc-label">Income Sources</div>
              <div className="sc-value" style={{ fontSize: '1.1rem' }}>{analytics.incomeSources?.length || 0}</div>
              <div className="sc-change positive">Active sources</div>
            </div>
          </div>
        )}

        {analytics?.incomeSources?.length > 0 && (
          <div className="grid-2" style={{ marginBottom: 24 }}>
            {analytics.incomeSources.map((s) => (
              <div key={s.source} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="sc-icon icon-green" style={{ width: 38, height: 38, fontSize: '1rem' }}>💰</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.source}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.percentage}% contribution</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>₹{s.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>{editing ? 'Edit Income' : 'Add Income'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="50000" min="0" required />
                </div>
                <div className="form-group">
                  <label>Income Source</label>
                  <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                    {SOURCES.map((s) => <option key={s}>{s}</option>)}
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
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional notes" />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" type="submit">{editing ? 'Update Income' : 'Save Income'}</button>
                <button className="btn btn-outline" type="button" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          <div className="card-header"><h3>Income Records</h3></div>
          {incomes.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">💰</div><p>No income records yet. Start tracking your earnings!</p></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Source</th><th>Amount</th><th>Payment</th><th>Date</th><th>Description</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {incomes.map((inc) => (
                    <tr key={inc._id}>
                      <td><span className="badge badge-income">{inc.source}</span></td>
                      <td style={{ fontWeight: 600, color: 'var(--green)' }}>+₹{inc.amount.toLocaleString()}</td>
                      <td>{inc.paymentMethod}</td>
                      <td>{new Date(inc.date).toLocaleDateString('en-IN')}</td>
                      <td style={{ color: 'var(--text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.description || '-'}</td>
                      <td>
                        <div className="tx-actions">
                          <button className="btn btn-sm btn-outline" onClick={() => handleEdit(inc)}>✏️</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(inc._id)}>🗑️</button>
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
