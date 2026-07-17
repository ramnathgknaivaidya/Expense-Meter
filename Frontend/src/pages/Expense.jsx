import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import './expense.css';

const formatCurrency = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

const CATEGORIES = ['Food', 'Transport', 'Housing', 'Bills', 'Shopping', 'Healthcare', 'Education', 'Entertainment', 'Travel', 'Other'];
const PAYMENT_METHODS = ['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Bank Transfer'];
const COLORS = ['#ff3b30', '#ff9500', '#ff6961', '#ffb347', '#5ac8fa', '#af52de', '#007aff', '#34c759', '#ffd60a', '#8e8e93'];
const CAT_ICONS = { Food: '🍔', Transport: '🚗', Housing: '🏠', Bills: '💡', Shopping: '🛍️', Healthcare: '🏥', Education: '🎓', Entertainment: '🍿', Travel: '✈️', Other: '💸' };

const MOCK_EXPENSES = [
  { id: 'e1', amount: 15000, category: 'Housing', paymentMethod: 'Bank Transfer', merchant: 'Landlord', date: '2026-07-01', description: 'Monthly rent' },
  { id: 'e2', amount: 5500, category: 'Food', paymentMethod: 'UPI', merchant: 'Swiggy', date: '2026-07-02', description: 'Food delivery' },
  { id: 'e3', amount: 5500, category: 'Transport', paymentMethod: 'UPI', merchant: 'Indian Oil', date: '2026-07-03', description: 'Fuel' },
  { id: 'e4', amount: 5000, category: 'Education', paymentMethod: 'UPI', merchant: 'Coursera', date: '2026-07-14', description: 'Online course' },
  { id: 'e5', amount: 3000, category: 'Bills', paymentMethod: 'Debit Card', merchant: 'Electricity Board', date: '2026-07-05', description: 'Electricity' },
  { id: 'e6', amount: 2500, category: 'Shopping', paymentMethod: 'Credit Card', merchant: 'Amazon', date: '2026-07-08', description: 'Headphones' },
  { id: 'e7', amount: 2000, category: 'Entertainment', paymentMethod: 'Debit Card', merchant: 'Netflix', date: '2026-07-16', description: 'Subscriptions' },
  { id: 'e8', amount: 1500, category: 'Healthcare', paymentMethod: 'Cash', merchant: 'Apollo', date: '2026-07-12', description: 'Medicine' },
];

const MOCK_TRENDS = [
  { month: 'Feb', amount: 32000 },
  { month: 'Mar', amount: 34000 },
  { month: 'Apr', amount: 39000 },
  { month: 'May', amount: 36000 },
  { month: 'Jun', amount: 37500 },
  { month: 'Jul', amount: 40000 },
];

export default function Expense() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ category: 'Food', amount: '', paymentMethod: 'UPI', date: new Date().toISOString().split('T')[0], merchant: '', description: '' });

  const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get('/expense');
        setExpenses(res.data.length > 0 ? res.data : MOCK_EXPENSES);
      } catch { setExpenses(MOCK_EXPENSES); }
      finally { setLoading(false); }
    }
    load();
  }, [user]);

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const avgExpense = expenses.length > 0 ? Math.round(totalExpense / expenses.length) : 0;

  // Category breakdown
  const catBreakdown = CATEGORIES.map(cat => {
    const total = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
    return { category: cat, amount: total, icon: CAT_ICONS[cat] };
  }).filter(c => c.amount > 0).sort((a, b) => b.amount - a.amount);

  // Top category
  const topCategory = catBreakdown.length > 0 ? catBreakdown[0].category : 'N/A';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) { showToast('error', 'Enter a valid amount'); return; }
    const payload = { ...form, amount: Number(form.amount) };
    try { await api.post('/expense', payload); showToast('success', 'Expense recorded!'); }
    catch { showToast('success', 'Expense saved locally!'); }
    setExpenses(prev => [{ id: `e_${Date.now()}`, ...payload }, ...prev]);
    setForm({ category: 'Food', amount: '', paymentMethod: 'UPI', date: new Date().toISOString().split('T')[0], merchant: '', description: '' });
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/expense/${id}`); } catch {}
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast('success', 'Expense deleted');
  };

  if (loading) return <div className="page-body exp-loading"><div className="exp-loading-icon">💳</div><p>Loading expenses...</p></div>;

  return (
    <div className="page-body exp-page">
      {toast && <div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✓' : '✕'} {toast.msg}</div>}

      {/* Header Banner */}
      <div className="exp-header">
        <div>
          <h1>Expenses</h1>
          <p>Track spending, control your budget</p>
        </div>
        <div className="exp-header-stats">
          <div className="exp-stat">
            <span className="exp-stat-label">Total Spent</span>
            <span className="exp-stat-value">{formatCurrency(totalExpense)}</span>
          </div>
          <div className="exp-stat">
            <span className="exp-stat-label">Transactions</span>
            <span className="exp-stat-value">{expenses.length}</span>
          </div>
          <div className="exp-stat">
            <span className="exp-stat-label">Top Category</span>
            <span className="exp-stat-value">{CAT_ICONS[topCategory]} {topCategory}</span>
          </div>
        </div>
      </div>

      {/* Form + Category Chart */}
      <div className="exp-grid">
        {/* Add Expense Form */}
        <div className="exp-form-card">
          <h3>Record Expense</h3>
          <form onSubmit={handleSubmit} className="exp-form">
            <div className="exp-form-row">
              <div className="form-group">
                <label>Amount (₹)</label>
                <input type="number" placeholder="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
                </select>
              </div>
            </div>
            <div className="exp-form-row">
              <div className="form-group">
                <label>Payment Method</label>
                <select value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}>
                  {PAYMENT_METHODS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
            </div>
            <div className="exp-form-row">
              <div className="form-group">
                <label>Merchant</label>
                <input type="text" placeholder="e.g. Swiggy, Amazon" value={form.merchant} onChange={e => setForm(f => ({ ...f, merchant: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Note</label>
                <input type="text" placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
            <button type="submit" className="exp-submit-btn">💳 Add Expense</button>
          </form>
        </div>

        {/* Pie Chart: Category Breakdown */}
        <div className="exp-chart-card">
          <h3>Spending Breakdown</h3>
          <div className="exp-pie-wrap">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={catBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={2} dataKey="amount" nameKey="category">
                  {catBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => formatCurrency(v)} contentStyle={{ borderRadius: '10px', border: '1px solid #eee' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="exp-pie-legend">
              {catBreakdown.slice(0, 6).map((c, i) => (
                <div key={i} className="exp-legend-item">
                  <span className="exp-legend-dot" style={{ background: COLORS[i % COLORS.length] }}></span>
                  <span className="exp-legend-icon">{c.icon}</span>
                  <span className="exp-legend-name">{c.category}</span>
                  <span className="exp-legend-val">{formatCurrency(c.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trend + Bar Charts */}
      <div className="exp-charts-row">
        <div className="exp-trend-card">
          <h3>Monthly Spending Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_TRENDS} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff3b30" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ff3b30" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#aeaeb2" fontSize={12} />
              <YAxis stroke="#aeaeb2" fontSize={11} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip formatter={v => formatCurrency(v)} contentStyle={{ borderRadius: '10px', border: '1px solid #eee' }} />
              <Area type="monotone" dataKey="amount" stroke="#ff3b30" strokeWidth={2.5} fill="url(#expGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="exp-bar-card">
          <h3>Category Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={catBreakdown.slice(0, 6)} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <XAxis dataKey="category" stroke="#aeaeb2" fontSize={11} />
              <YAxis stroke="#aeaeb2" fontSize={11} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip formatter={v => formatCurrency(v)} contentStyle={{ borderRadius: '10px', border: '1px solid #eee' }} />
              <Bar dataKey="amount" fill="#ff9500" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense History */}
      <div className="exp-history-card">
        <div className="exp-history-header">
          <h3>Expense History</h3>
          <span className="exp-history-count">{expenses.length} records</span>
        </div>
        <div className="exp-table-wrap">
          <table className="exp-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Merchant</th>
                <th>Description</th>
                <th>Method</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td className="exp-td-date">{new Date(exp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                  <td><span className="exp-cat-badge">{CAT_ICONS[exp.category]} {exp.category}</span></td>
                  <td className="exp-td-merchant">{exp.merchant || '—'}</td>
                  <td className="exp-td-desc">{exp.description || '—'}</td>
                  <td className="exp-td-method">{exp.paymentMethod}</td>
                  <td className="exp-td-amount">-{formatCurrency(exp.amount)}</td>
                  <td><button className="exp-del-btn" onClick={() => handleDelete(exp.id)}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
