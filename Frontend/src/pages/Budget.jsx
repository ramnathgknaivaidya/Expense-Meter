import { useState, useEffect } from 'react';
import { budgetAPI, reportAPI } from '../api/client';

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Bills', 'Shopping', 'Healthcare', 'Education', 'Entertainment', 'Travel', 'Other'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: 'Food', limitAmount: '', month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      budgetAPI.getAll({ month: new Date().getMonth() + 1, year: new Date().getFullYear() }),
      reportAPI.getBudgetStatus(),
    ]).then(([budRes, statRes]) => {
      setBudgets(budRes.data.data || []);
      setStatuses(statRes.data.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) { await budgetAPI.update(editingId, { limitAmount: form.limitAmount }); } else { await budgetAPI.create(form); }
      setShowForm(false); setEditingId(null);
      setForm({ category: 'Food', limitAmount: '', month: new Date().getMonth() + 1, year: new Date().getFullYear() });
      loadData();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this budget?')) return;
    try { await budgetAPI.delete(id); loadData(); } catch (err) { alert('Error deleting'); }
  };

  const getProgressClass = (pct) => pct >= 90 ? 'danger' : pct >= 70 ? 'warning' : 'safe';

  if (loading) return <div className="page-body"><p>Loading budgets...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h2>🎯 Budget Planning & Goals</h2>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ category: 'Food', limitAmount: '', month: new Date().getMonth() + 1, year: new Date().getFullYear() }); }}>
            {showForm ? '✕ Cancel' : '+ Set Budget'}
          </button>
        </div>
      </div>
      <div className="page-body">
        {showForm && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>{editingId ? 'Edit Budget' : 'Create Budget'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} disabled={!!editingId}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Monthly Limit (₹)</label>
                  <input type="number" value={form.limitAmount} onChange={(e) => setForm({ ...form, limitAmount: e.target.value })} placeholder="6000" min="0" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Month</label>
                  <select value={form.month} onChange={(e) => setForm({ ...form, month: parseInt(e.target.value) })} disabled={!!editingId}>
                    {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })} disabled={!!editingId} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" type="submit">{editingId ? 'Update Budget' : 'Create Budget'}</button>
                <button className="btn btn-outline" type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="card">
            <div className="card-header"><h3>Category Budgets</h3></div>
            {statuses.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">🎯</div><p>No budgets set. Create one to track spending!</p></div>
            ) : (
              statuses.map((s) => (
                <div key={s.category} className="budget-progress" style={{ marginBottom: 16 }}>
                  <div className="bp-header">
                    <span style={{ fontWeight: 600 }}>{s.category}</span>
                    <span>₹{s.spent.toLocaleString()} / ₹{s.limit.toLocaleString()}</span>
                  </div>
                  <div className="bp-bar">
                    <div className={`bp-fill ${getProgressClass(s.percentage)}`} style={{ width: `${Math.min(s.percentage, 100)}%` }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    <span>{s.percentage}% used</span>
                    <span>₹{s.remaining.toLocaleString()} remaining</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="card">
            <div className="card-header"><h3>Savings Goals</h3></div>
            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { icon: '🚨', title: 'Emergency Fund', target: 100000, saved: 45000 },
                { icon: '💻', title: 'New Device', target: 80000, saved: 32000 },
                { icon: '✈️', title: 'Vacation', target: 50000, saved: 15000 },
                { icon: '📈', title: 'Investment Goal', target: 200000, saved: 60000 },
              ].map((goal) => {
                const pct = Math.round((goal.saved / goal.target) * 100);
                return (
                  <div key={goal.title} className="card" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <span style={{ fontSize: '1.5rem' }}>{goal.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{goal.title}</div>
                        <div className="goal-amounts">
                          <span>₹{goal.saved.toLocaleString()} saved</span>
                          <span>₹{goal.target.toLocaleString()} target</span>
                        </div>
                      </div>
                    </div>
                    <div className="bp-bar">
                      <div className={`bp-fill ${pct >= 90 ? 'danger' : pct >= 70 ? 'warning' : 'safe'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4, textAlign: 'right' }}>{pct}% complete</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>All Budgets</h3></div>
          {budgets.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📋</div><p>No budgets created yet</p></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Category</th><th>Limit</th><th>Month</th><th>Year</th><th>Actions</th></tr></thead>
                <tbody>
                  {budgets.map((b) => (
                    <tr key={b._id}>
                      <td><span className="badge badge-expense">{b.category}</span></td>
                      <td style={{ fontWeight: 600 }}>₹{b.limitAmount.toLocaleString()}</td>
                      <td>{MONTHS[b.month - 1]}</td>
                      <td>{b.year}</td>
                      <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(b._id)}>🗑️</button></td>
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
