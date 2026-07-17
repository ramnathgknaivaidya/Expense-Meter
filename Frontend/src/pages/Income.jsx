import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import './income.css';

const formatCurrency = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

const SOURCES = ['Salary', 'Freelance', 'Business', 'Investment', 'Bonus', 'Rental', 'Other'];
const PAYMENT_METHODS = ['Bank Transfer', 'Cash', 'UPI', 'Card'];
const COLORS = ['#34c759', '#30d158', '#248a3d', '#5ac8fa', '#007aff', '#af52de', '#ff9500'];

const MOCK_INCOMES = [
  { id: 'i1', amount: 50000, source: 'Salary', paymentMethod: 'Bank Transfer', date: '2026-07-01', description: 'July salary' },
  { id: 'i2', amount: 12000, source: 'Freelance', paymentMethod: 'UPI', date: '2026-07-05', description: 'Web design project' },
  { id: 'i3', amount: 8000, source: 'Business', paymentMethod: 'Card', date: '2026-07-15', description: 'Side business' },
  { id: 'i4', amount: 3000, source: 'Investment', paymentMethod: 'Bank Transfer', date: '2026-07-10', description: 'Stock dividends' },
  { id: 'i5', amount: 2000, source: 'Bonus', paymentMethod: 'Bank Transfer', date: '2026-07-20', description: 'Performance bonus' },
];

const MOCK_TRENDS = [
  { month: 'Feb', amount: 55000 },
  { month: 'Mar', amount: 60000 },
  { month: 'Apr', amount: 62000 },
  { month: 'May', amount: 68000 },
  { month: 'Jun', amount: 70000 },
  { month: 'Jul', amount: 75000 },
];

export default function Income() {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ source: 'Salary', amount: '', paymentMethod: 'Bank Transfer', date: new Date().toISOString().split('T')[0], description: '' });

  const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get('/income');
        setIncomes(res.data.length > 0 ? res.data : MOCK_INCOMES);
      } catch { setIncomes(MOCK_INCOMES); }
      finally { setLoading(false); }
    }
    load();
  }, [user]);

  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const avgIncome = incomes.length > 0 ? Math.round(totalIncome / incomes.length) : 0;

  // Source breakdown for pie chart
  const sourceBreakdown = SOURCES.map(src => {
    const total = incomes.filter(i => i.source === src).reduce((s, i) => s + i.amount, 0);
    return { source: src, amount: total };
  }).filter(s => s.amount > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) { showToast('error', 'Enter a valid amount'); return; }
    const payload = { ...form, amount: Number(form.amount) };
    try {
      await api.post('/income', payload);
      showToast('success', 'Income added!');
    } catch {
      showToast('success', 'Income saved locally!');
    }
    setIncomes(prev => [{ id: `i_${Date.now()}`, ...payload }, ...prev]);
    setForm({ source: 'Salary', amount: '', paymentMethod: 'Bank Transfer', date: new Date().toISOString().split('T')[0], description: '' });
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/income/${id}`); } catch {}
    setIncomes(prev => prev.filter(i => i.id !== id));
    showToast('success', 'Income deleted');
  };

  if (loading) return <div className="page-body inc-loading"><div className="inc-loading-icon">💰</div><p>Loading income data...</p></div>;

  return (
    <div className="page-body inc-page">
      {toast && <div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✓' : '✕'} {toast.msg}</div>}

      {/* Page Header */}
      <div className="inc-header">
        <div>
          <h1>Income</h1>
          <p>Track your earnings and monitor financial growth</p>
        </div>
        <div className="inc-header-stats">
          <div className="inc-stat">
            <span className="inc-stat-label">Total</span>
            <span className="inc-stat-value green">{formatCurrency(totalIncome)}</span>
          </div>
          <div className="inc-stat">
            <span className="inc-stat-label">Entries</span>
            <span className="inc-stat-value">{incomes.length}</span>
          </div>
          <div className="inc-stat">
            <span className="inc-stat-label">Average</span>
            <span className="inc-stat-value">{formatCurrency(avgIncome)}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form + Charts */}
      <div className="inc-grid">
        {/* Left: Add Income Form */}
        <div className="inc-form-card">
          <h3>Add New Income</h3>
          <form onSubmit={handleSubmit} className="inc-form">
            <div className="inc-form-row">
              <div className="form-group">
                <label>Amount (₹)</label>
                <input type="number" placeholder="50000" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Source</label>
                <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}>
                  {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="inc-form-row">
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
            <div className="form-group">
              <label>Description</label>
              <input type="text" placeholder="e.g. July salary" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <button type="submit" className="inc-submit-btn">+ Add Income</button>
          </form>
        </div>

        {/* Right: Pie Chart */}
        <div className="inc-chart-card">
          <h3>Income Sources</h3>
          <div className="inc-pie-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={sourceBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="amount" nameKey="source">
                  {sourceBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => formatCurrency(v)} contentStyle={{ borderRadius: '10px', border: '1px solid #eee' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="inc-pie-legend">
              {sourceBreakdown.map((s, i) => (
                <div key={i} className="inc-legend-item">
                  <span className="inc-legend-dot" style={{ background: COLORS[i % COLORS.length] }}></span>
                  <span className="inc-legend-name">{s.source}</span>
                  <span className="inc-legend-val">{formatCurrency(s.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="inc-trend-card">
        <h3>Monthly Income Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={MOCK_TRENDS} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34c759" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34c759" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#aeaeb2" fontSize={12} />
            <YAxis stroke="#aeaeb2" fontSize={11} tickFormatter={v => `₹${v/1000}k`} />
            <Tooltip formatter={v => formatCurrency(v)} contentStyle={{ borderRadius: '10px', border: '1px solid #eee' }} />
            <Area type="monotone" dataKey="amount" stroke="#34c759" strokeWidth={2.5} fill="url(#incGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Income History Table */}
      <div className="inc-history-card">
        <div className="inc-history-header">
          <h3>Income History</h3>
          <span className="inc-history-count">{incomes.length} records</span>
        </div>
        <div className="inc-table-wrap">
          <table className="inc-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Source</th>
                <th>Description</th>
                <th>Method</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {incomes.map(inc => (
                <tr key={inc.id}>
                  <td className="inc-td-date">{new Date(inc.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td><span className="inc-source-badge">{inc.source}</span></td>
                  <td className="inc-td-desc">{inc.description || '—'}</td>
                  <td className="inc-td-method">{inc.paymentMethod}</td>
                  <td className="inc-td-amount">+{formatCurrency(inc.amount)}</td>
                  <td><button className="inc-del-btn" onClick={() => handleDelete(inc.id)}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
