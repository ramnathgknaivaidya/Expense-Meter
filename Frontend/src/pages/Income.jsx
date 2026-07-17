import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import './income.css';

const formatCurrency = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

const SOURCES = ['Salary', 'Freelance', 'Business', 'Investment', 'Bonus', 'Rental', 'Other'];
const SOURCE_ICONS = { Salary: '💼', Freelance: '💻', Business: '🏪', Investment: '📈', Bonus: '🎁', Rental: '🏠', Other: '💰' };
const PAYMENT_METHODS = [
  { id: 'Bank Transfer', icon: '🏛️', label: 'Bank' },
  { id: 'Cash', icon: '💵', label: 'Cash' },
  { id: 'UPI', icon: '📱', label: 'UPI' },
  { id: 'Card', icon: '💳', label: 'Card' },
];
const COLORS = ['#10b981', '#059669', '#34d399', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

const MOCK_INCOMES = [
  { id: 'i1', amount: 50000, source: 'Salary', paymentMethod: 'Bank Transfer', date: '2026-07-01', description: 'July salary' },
  { id: 'i2', amount: 12000, source: 'Freelance', paymentMethod: 'UPI', date: '2026-07-05', description: 'Web design project' },
  { id: 'i3', amount: 8000, source: 'Business', paymentMethod: 'Card', date: '2026-07-15', description: 'Side business revenue' },
  { id: 'i4', amount: 3000, source: 'Investment', paymentMethod: 'Bank Transfer', date: '2026-07-10', description: 'Stock dividends' },
  { id: 'i5', amount: 2000, source: 'Bonus', paymentMethod: 'Bank Transfer', date: '2026-07-20', description: 'Performance bonus' },
  { id: 'i6', amount: 5000, source: 'Freelance', paymentMethod: 'UPI', date: '2026-07-22', description: 'Logo design' },
  { id: 'i7', amount: 1500, source: 'Investment', paymentMethod: 'Bank Transfer', date: '2026-07-25', description: 'Mutual fund returns' },
];

const MOCK_MONTHLY = [
  { month: 'Jan', amount: 48000 }, { month: 'Feb', amount: 55000 },
  { month: 'Mar', amount: 60000 }, { month: 'Apr', amount: 62000 },
  { month: 'May', amount: 68000 }, { month: 'Jun', amount: 70000 },
  { month: 'Jul', amount: 81500 },
];

export default function Income() {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ source: 'Salary', amount: '', paymentMethod: 'Bank Transfer', date: new Date().toISOString().split('T')[0], description: '' });

  const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { const res = await api.get('/income'); setIncomes(res.data.length > 0 ? res.data : MOCK_INCOMES); }
      catch { setIncomes(MOCK_INCOMES); }
      finally { setLoading(false); }
    })();
  }, [user]);

  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const thisMonthIncome = incomes.filter(i => new Date(i.date).getMonth() === new Date().getMonth()).reduce((s, i) => s + i.amount, 0);
  const topSource = (() => {
    const map = {};
    incomes.forEach(i => { map[i.source] = (map[i.source] || 0) + i.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  })();
  const growth = MOCK_MONTHLY.length >= 2 ? Math.round(((MOCK_MONTHLY[MOCK_MONTHLY.length - 1].amount - MOCK_MONTHLY[MOCK_MONTHLY.length - 2].amount) / MOCK_MONTHLY[MOCK_MONTHLY.length - 2].amount) * 100) : 0;

  const sourceBreakdown = SOURCES.map(src => ({
    source: src, amount: incomes.filter(i => i.source === src).reduce((s, i) => s + i.amount, 0), icon: SOURCE_ICONS[src]
  })).filter(s => s.amount > 0).sort((a, b) => b.amount - a.amount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) { showToast('error', 'Enter valid amount'); return; }
    const payload = { ...form, amount: Number(form.amount) };
    try { await api.post('/income', payload); showToast('success', 'Income added!'); }
    catch { showToast('success', 'Saved locally!'); }
    setIncomes(prev => [{ id: `i_${Date.now()}`, ...payload }, ...prev]);
    setForm({ source: 'Salary', amount: '', paymentMethod: 'Bank Transfer', date: new Date().toISOString().split('T')[0], description: '' });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/income/${id}`); } catch {}
    setIncomes(prev => prev.filter(i => i.id !== id));
    showToast('success', 'Deleted');
  };

  if (loading) return (
    <div className="page-body inc-loading">
      <div className="inc-loader-ring"><div></div><div></div><div></div></div>
      <p>Loading your income data...</p>
    </div>
  );

  return (
    <div className="page-body inc-page">
      {toast && <div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✓' : '✕'} {toast.msg}</div>}

      {/* === HERO === */}
      <section className="inc-hero">
        <div className="inc-hero-left">
          <h1>Income Dashboard</h1>
          <p>Your earnings at a glance. Track growth, analyze sources.</p>
          <button className="inc-add-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Close' : '+ Add Income'}
          </button>
        </div>
        <div className="inc-hero-cards">
          <div className="inc-mini-card">
            <span className="inc-mini-icon">💰</span>
            <div>
              <div className="inc-mini-label">Total Income</div>
              <div className="inc-mini-value">{formatCurrency(totalIncome)}</div>
            </div>
          </div>
          <div className="inc-mini-card">
            <span className="inc-mini-icon">📅</span>
            <div>
              <div className="inc-mini-label">This Month</div>
              <div className="inc-mini-value">{formatCurrency(thisMonthIncome)}</div>
            </div>
          </div>
          <div className="inc-mini-card">
            <span className="inc-mini-icon">🏆</span>
            <div>
              <div className="inc-mini-label">Top Source</div>
              <div className="inc-mini-value">{topSource}</div>
            </div>
          </div>
          <div className="inc-mini-card">
            <span className="inc-mini-icon">📈</span>
            <div>
              <div className="inc-mini-label">Growth</div>
              <div className="inc-mini-value inc-growth">+{growth}%</div>
            </div>
          </div>
        </div>
      </section>

      {/* === ADD FORM (Collapsible) === */}
      {showForm && (
        <section className="inc-form-section">
          <form onSubmit={handleSubmit} className="inc-form">
            <div className="inc-form-amount">
              <label>Amount</label>
              <div className="inc-amount-input">
                <span className="inc-currency">₹</span>
                <input type="number" placeholder="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required autoFocus />
              </div>
            </div>
            <div className="inc-form-fields">
              <div className="inc-form-row">
                <div className="form-group">
                  <label>Source</label>
                  <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}>
                    {SOURCES.map(s => <option key={s} value={s}>{SOURCE_ICONS[s]} {s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" placeholder="What's this income from?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <div className="inc-payment-grid">
                  {PAYMENT_METHODS.map(pm => (
                    <button key={pm.id} type="button" className={`inc-pm-btn ${form.paymentMethod === pm.id ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, paymentMethod: pm.id }))}>
                      <span>{pm.icon}</span><span>{pm.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="inc-submit-btn">💰 Save Income</button>
            </div>
          </form>
        </section>
      )}

      {/* === CHARTS SECTION === */}
      <div className="inc-charts-grid">
        {/* Area Chart */}
        <section className="inc-chart-box">
          <div className="inc-chart-title">
            <h3>Monthly Growth</h3>
            <span className="inc-chart-badge">+{growth}% ↑</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_MONTHLY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#ccc" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#ccc" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `₹${v/1000}k`} />
              <Tooltip formatter={v => formatCurrency(v)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fill="url(#incomeGradient)" dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        {/* Pie + Source Bars */}
        <section className="inc-chart-box">
          <div className="inc-chart-title"><h3>Income Sources</h3></div>
          <div className="inc-source-visual">
            <div className="inc-pie-mini">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={sourceBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="amount" nameKey="source">
                    {sourceBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => formatCurrency(v)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="inc-source-bars">
              {sourceBreakdown.map((s, i) => (
                <div key={i} className="inc-source-row">
                  <div className="inc-source-info">
                    <span className="inc-source-icon">{s.icon}</span>
                    <span className="inc-source-name">{s.source}</span>
                  </div>
                  <div className="inc-source-bar-wrap">
                    <div className="inc-source-bar" style={{ width: `${(s.amount / totalIncome) * 100}%`, background: COLORS[i % COLORS.length] }}></div>
                  </div>
                  <span className="inc-source-amt">{formatCurrency(s.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* === RECENT TRANSACTIONS === */}
      <section className="inc-transactions">
        <div className="inc-tx-header">
          <h3>Recent Income</h3>
          <span className="inc-tx-count">{incomes.length} entries</span>
        </div>
        <div className="inc-tx-list">
          {incomes.map(inc => (
            <div key={inc.id} className="inc-tx-row">
              <div className="inc-tx-icon-wrap">
                <span className="inc-tx-icon">{SOURCE_ICONS[inc.source] || '💰'}</span>
              </div>
              <div className="inc-tx-details">
                <div className="inc-tx-title">{inc.description || inc.source}</div>
                <div className="inc-tx-meta">
                  {new Date(inc.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} 
                  <span className="inc-tx-dot">•</span>
                  {inc.paymentMethod}
                  <span className="inc-tx-dot">•</span>
                  <span className="inc-tx-source-tag">{inc.source}</span>
                </div>
              </div>
              <div className="inc-tx-right">
                <span className="inc-tx-amount">+{formatCurrency(inc.amount)}</span>
                <button className="inc-tx-del" onClick={() => handleDelete(inc.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
