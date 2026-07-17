import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import './dashboard.css';

const formatCurrency = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

const getCategoryIcon = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('salary')) return '💼';
  if (cat.includes('freelance')) return '�';
  if (cat.includes('business')) return '🏪';
  if (cat.includes('invest')) return '�';
  if (cat.includes('bonus')) return '🎁';
  if (cat.includes('food')) return '🍔';
  if (cat.includes('transport')) return '🚗';
  if (cat.includes('housing')) return '🏠';
  if (cat.includes('bill')) return '�';
  if (cat.includes('shopping')) return '🛍️';
  if (cat.includes('health')) return '�';
  if (cat.includes('education')) return '🎓';
  if (cat.includes('entertainment')) return '🍿';
  return '💸';
};
const getPaymentMethodIcon = (m) => {
  const p = (m || '').toLowerCase();
  if (p.includes('cash')) return '💵';
  if (p.includes('upi')) return '📱';
  if (p.includes('card')) return '💳';
  if (p.includes('bank')) return '�️';
  return '🔌';
};

const MOCK_DATA = {
  summary: { totalIncome: 75000, totalExpense: 39500, balance: 35500, savingsRate: 47, incomeGrowth: 15.4, expenseChange: 8.2, balanceChange: 24.6 },
  incomeAnalytics: { monthlyIncome: 75000, growthPercentage: 15.4, highestSource: 'Salary', sources: [
    { source: 'Salary', amount: 50000, percentage: 67 }, { source: 'Freelance', amount: 12000, percentage: 16 },
    { source: 'Business', amount: 8000, percentage: 11 }, { source: 'Investment', amount: 3000, percentage: 4 },
    { source: 'Bonus', amount: 2000, percentage: 2 },
  ]},
  expenseAnalytics: { monthlyExpense: 39500, highestCategory: 'Housing', spendingRate: 53, categories: [
    { category: 'Housing', amount: 15000, percentage: 38 }, { category: 'Food', amount: 5500, percentage: 14 },
    { category: 'Transport', amount: 5500, percentage: 14 }, { category: 'Education', amount: 5000, percentage: 13 },
    { category: 'Bills', amount: 3000, percentage: 8 }, { category: 'Shopping', amount: 2500, percentage: 6 },
    { category: 'Entertainment', amount: 2000, percentage: 5 }, { category: 'Healthcare', amount: 1000, percentage: 2 },
  ]},
  budgetStatus: { budgets: [
    { category: 'Housing', limit: 15000, spent: 15000, remaining: 0, percentage: 100, status: 'Exceeded' },
    { category: 'Food', limit: 6000, spent: 5500, remaining: 500, percentage: 92, status: 'Warning' },
    { category: 'Transport', limit: 3000, spent: 5500, remaining: -2500, percentage: 183, status: 'Exceeded' },
    { category: 'Shopping', limit: 5000, spent: 2500, remaining: 2500, percentage: 50, status: 'On Track' },
  ], summary: { totalBudget: 29000, totalSpent: 28500, totalRemaining: 500, overallPercentage: 98 }},
  transactions: [
    { id: 'tx_1', type: 'income', amount: 2000, category: 'Bonus', paymentMethod: 'Bank Transfer', description: 'Performance bonus', date: '2026-07-20T00:00:00.000Z' },
    { id: 'tx_2', type: 'expense', amount: 3500, category: 'Transport', paymentMethod: 'UPI', merchantOrSource: 'Indian Oil', description: 'Fuel refill', date: '2026-07-20T00:00:00.000Z' },
    { id: 'tx_3', type: 'expense', amount: 1000, category: 'Food', paymentMethod: 'Cash', merchantOrSource: 'Local Cafe', description: 'Lunch', date: '2026-07-18T00:00:00.000Z' },
    { id: 'tx_4', type: 'expense', amount: 2000, category: 'Entertainment', paymentMethod: 'Debit Card', merchantOrSource: 'Netflix', description: 'Subscriptions', date: '2026-07-16T00:00:00.000Z' },
    { id: 'tx_5', type: 'income', amount: 8000, category: 'Business', paymentMethod: 'Card', description: 'Side business revenue', date: '2026-07-15T00:00:00.000Z' },
    { id: 'tx_6', type: 'expense', amount: 5000, category: 'Education', paymentMethod: 'UPI', merchantOrSource: 'Coursera', description: 'Online course', date: '2026-07-14T00:00:00.000Z' },
    { id: 'tx_8', type: 'income', amount: 3000, category: 'Investment', paymentMethod: 'Bank Transfer', description: 'Stock dividends', date: '2026-07-10T00:00:00.000Z' },
    { id: 'tx_10', type: 'income', amount: 12000, category: 'Freelance', paymentMethod: 'UPI', description: 'Web dev project', date: '2026-07-05T00:00:00.000Z' },
    { id: 'tx_11', type: 'income', amount: 50000, category: 'Salary', paymentMethod: 'Bank Transfer', description: 'July salary', date: '2026-07-01T00:00:00.000Z' },
  ],
  trends: [
    { name: 'Feb', income: 55000, expense: 32000, savings: 23000 }, { name: 'Mar', income: 60000, expense: 34000, savings: 26000 },
    { name: 'Apr', income: 62000, expense: 39000, savings: 23000 }, { name: 'May', income: 68000, expense: 36000, savings: 32000 },
    { name: 'Jun', income: 70000, expense: 37500, savings: 32500 }, { name: 'Jul', income: 75000, expense: 39500, savings: 35500 },
  ],
};

const COLORS = {
  income: ['#10b981', '#34d399', '#059669', '#6ee7b7', '#a7f3d0'],
  expense: ['#f97316', '#ef4444', '#f87171', '#fb923c', '#fca5a5', '#fdba74', '#fecaca', '#fed7aa'],
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('income');
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);
  const [dashboardData, setDashboardData] = useState(MOCK_DATA);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const [summaryRes, incomeAnalyticsRes, expenseAnalyticsRes, budgetRes, transactionsRes] = await Promise.all([
          api.get('/dashboard'), api.get('/analytics/income'), api.get('/analytics/expense'),
          api.get('/budget/status'), api.get('/transactions?limit=20'),
        ]);
        const summary = summaryRes.data, incomeAnalytics = incomeAnalyticsRes.data, expenseAnalytics = expenseAnalyticsRes.data;
        const budgetStatus = budgetRes.data, transactions = transactionsRes.data.results || [];
        setDashboardData({
          summary: { totalIncome: summary.totalIncome || 0, totalExpense: summary.totalExpense || 0, balance: summary.balance || 0, savingsRate: summary.savings || 0, incomeGrowth: incomeAnalytics.growthPercentage || 0, expenseChange: MOCK_DATA.summary.expenseChange, balanceChange: MOCK_DATA.summary.balanceChange },
          incomeAnalytics: { monthlyIncome: incomeAnalytics.monthlyIncome || 0, growthPercentage: incomeAnalytics.growthPercentage || 0, highestSource: incomeAnalytics.incomeSources?.[0]?.source || 'N/A', sources: incomeAnalytics.incomeSources?.map(s => ({ source: s.source, amount: s.amount, percentage: s.percentage })) || [] },
          expenseAnalytics: { monthlyExpense: expenseAnalytics.categoryDistribution?.reduce((a, b) => a + b.amount, 0) || 0, highestCategory: expenseAnalytics.highestCategory || 'N/A', spendingRate: summary.totalIncome > 0 ? Math.round((summary.totalExpense / summary.totalIncome) * 100) : 0, categories: expenseAnalytics.categoryDistribution?.map(c => ({ category: c.category, amount: c.amount, percentage: c.percentage })) || [] },
          budgetStatus: { budgets: budgetStatus.budgets || [], summary: budgetStatus.summary || { totalBudget: 0, totalSpent: 0, totalRemaining: 0, overallPercentage: 0 } },
          transactions, trends: MOCK_DATA.trends,
        });
        setIsMockMode(false);
      } catch (error) {
        setDashboardData(MOCK_DATA); setIsMockMode(true);
      } finally { setLoading(false); }
    }
    fetchDashboardData();
  }, [user]);

  const { summary, incomeAnalytics, expenseAnalytics, budgetStatus, transactions, trends } = dashboardData;
  const filteredTransactions = transactions.filter((tx) => (activeTab === 'income' ? tx.type === 'income' : tx.type === 'expense')).slice(0, 5);
  const savings = summary.totalIncome - summary.totalExpense;

  if (loading) {
    return (
      <div className="page-body dsh-loading">
        <div className="dsh-orb"></div>
        <h3>Loading your financial universe</h3>
        <p>Compiling live ledger records...</p>
      </div>
    );
  }

  return (
    <div className="page-body dsh">
      {/* ===== HERO ===== */}
      <section className="dsh-hero">
        <div className="dsh-hero-glow dsh-glow-1"></div>
        <div className="dsh-hero-glow dsh-glow-2"></div>
        <div className="dsh-hero-inner">
          <div className="dsh-hero-left">
            <div className="dsh-hero-badge">
              {isMockMode ? <><span className="dsh-dot-pulse orange"></span>Demo Data Mode</> : <><span className="dsh-dot-pulse green"></span>Live Sync</>}
            </div>
            <h1 className="dsh-hero-title">Manage Your Money.<br/><span>Track Your Growth.</span></h1>
            <p className="dsh-hero-sub">Welcome back, <strong>{user?.name || 'User'}</strong>. Here's your complete financial overview.</p>
            <div className="dsh-hero-actions">
              <button className="dsh-btn dsh-btn-light" onClick={() => navigate('/income')}>💰 Add Income</button>
              <button className="dsh-btn dsh-btn-ghost" onClick={() => navigate('/expense')}>💳 Add Expense</button>
            </div>
          </div>
          <div className="dsh-flow">
            {[
              { icon: '💰', label: 'Income', val: '100%', cls: 'green' },
              { icon: '💸', label: 'Expense', val: `${expenseAnalytics.spendingRate}%`, cls: 'red' },
              { icon: '🐷', label: 'Savings', val: `${summary.savingsRate}%`, cls: 'blue' },
              { icon: '🚀', label: 'Growth', val: `+${summary.balanceChange}%`, cls: 'gold' },
            ].map((n, i, arr) => (
              <div key={i} className="dsh-flow-wrap">
                <div className="dsh-flow-node">
                  <div className="dsh-flow-icon">{n.icon}</div>
                  <span className="dsh-flow-label">{n.label}</span>
                  <span className={`dsh-flow-val ${n.cls}`}>{n.val}</span>
                </div>
                {i < arr.length - 1 && <span className="dsh-flow-arrow">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUMMARY CARDS ===== */}
      <section className="dsh-cards">
        <div className="dsh-card dsh-card-blue">
          <div className="dsh-card-glow"></div>
          <div className="dsh-card-head">
            <span className="dsh-card-icon">👛</span>
            <span className="dsh-card-tag positive">▲ +{summary.balanceChange}%</span>
          </div>
          <div className="dsh-card-value">{formatCurrency(summary.balance)}</div>
          <div className="dsh-card-label">Total Balance</div>
        </div>

        <div className="dsh-card dsh-card-green">
          <div className="dsh-card-glow"></div>
          <div className="dsh-card-head">
            <span className="dsh-card-icon">📈</span>
            <span className="dsh-card-tag positive">▲ +{summary.incomeGrowth}%</span>
          </div>
          <div className="dsh-card-value">{formatCurrency(summary.totalIncome)}</div>
          <div className="dsh-card-label">Total Income · Top: {incomeAnalytics.highestSource}</div>
        </div>

        <div className="dsh-card dsh-card-red">
          <div className="dsh-card-glow"></div>
          <div className="dsh-card-head">
            <span className="dsh-card-icon">📉</span>
            <span className="dsh-card-tag negative">▼ {expenseAnalytics.spendingRate}%</span>
          </div>
          <div className="dsh-card-value">{formatCurrency(summary.totalExpense)}</div>
          <div className="dsh-card-label">Total Spent · High: {expenseAnalytics.highestCategory}</div>
        </div>

        <div className="dsh-card dsh-card-purple">
          <div className="dsh-card-glow"></div>
          <div className="dsh-card-head">
            <span className="dsh-card-icon">🐷</span>
            <span className="dsh-card-tag neutral">Goal 30%</span>
          </div>
          <div className="dsh-card-value">{formatCurrency(savings)}</div>
          <div className="dsh-card-label">Savings · {summary.savingsRate}% rate</div>
          <div className="dsh-card-progress"><div className="dsh-card-progress-fill" style={{ width: `${Math.min(100, (summary.savingsRate / 30) * 100)}%` }}></div></div>
        </div>
      </section>

      {/* ===== ANALYTICS TOGGLE SECTION ===== */}
      <section className="dsh-panel">
        <div className="dsh-panel-head">
          <div>
            <h2 className="dsh-panel-title">Financial Overview</h2>
            <p className="dsh-panel-sub">Switch between income streams and expenditure analysis</p>
          </div>
          <div className="dsh-toggle">
            <div className={`dsh-toggle-pill ${activeTab}`}></div>
            <button className={`dsh-toggle-btn ${activeTab === 'income' ? 'active' : ''}`} onClick={() => setActiveTab('income')}>Income</button>
            <button className={`dsh-toggle-btn ${activeTab === 'expense' ? 'active' : ''}`} onClick={() => setActiveTab('expense')}>Expense</button>
          </div>
        </div>

        <div className="dsh-panel-grid">
          {/* Pie */}
          <div className="dsh-sub-card">
            <h4 className="dsh-sub-title">{activeTab === 'income' ? 'Income Sources' : 'Expense Categories'}</h4>
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie data={activeTab === 'income' ? incomeAnalytics.sources : expenseAnalytics.categories} cx="50%" cy="50%" innerRadius={62} outerRadius={92} paddingAngle={4} dataKey="amount" nameKey={activeTab === 'income' ? 'source' : 'category'} stroke="none">
                  {(activeTab === 'income' ? incomeAnalytics.sources : expenseAnalytics.categories).map((_, i) => (
                    <Cell key={i} fill={activeTab === 'income' ? COLORS.income[i % COLORS.income.length] : COLORS.expense[i % COLORS.expense.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="dsh-legend">
              {(activeTab === 'income' ? incomeAnalytics.sources : expenseAnalytics.categories).slice(0, 6).map((item, idx) => (
                <div key={idx} className="dsh-legend-item">
                  <span className="dsh-legend-dot" style={{ background: activeTab === 'income' ? COLORS.income[idx % COLORS.income.length] : COLORS.expense[idx % COLORS.expense.length] }}></span>
                  <span className="dsh-legend-name">{activeTab === 'income' ? item.source : item.category}</span>
                  <span className="dsh-legend-pct">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Area chart or budget */}
          <div className="dsh-sub-card">
            {activeTab === 'income' ? (
              <>
                <h4 className="dsh-sub-title">Monthly Income Growth</h4>
                <ResponsiveContainer width="100%" height={230}>
                  <AreaChart data={trends} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dshIncome" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/><stop offset="100%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#c7c7cc" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#c7c7cc" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `₹${v/1000}k`} />
                    <Tooltip formatter={v => formatCurrency(v)} contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
                    <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fill="url(#dshIncome)" dot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7 }} />
                  </AreaChart>
                </ResponsiveContainer>
                <p className="dsh-sub-note">📈 Income up {summary.incomeGrowth}% over the last 6 months</p>
              </>
            ) : (
              <>
                <div className="dsh-sub-title-row">
                  <h4 className="dsh-sub-title">Budget Usage</h4>
                  <span className="dsh-overall-tag">{budgetStatus.summary.overallPercentage}% used</span>
                </div>
                <div className="dsh-budgets">
                  {budgetStatus.budgets.length === 0 ? (
                    <div className="dsh-empty"><span>🎯</span><p>No budgets set yet.</p><button className="dsh-btn-mini" onClick={() => navigate('/budget')}>Setup</button></div>
                  ) : budgetStatus.budgets.map((b, i) => {
                    const cls = b.percentage >= 100 ? 'danger' : b.percentage >= 80 ? 'warning' : 'safe';
                    return (
                      <div key={i} className="dsh-budget">
                        <div className="dsh-budget-top">
                          <span className="dsh-budget-cat">{getCategoryIcon(b.category)} {b.category}</span>
                          <span className="dsh-budget-nums">{formatCurrency(b.spent)} / {formatCurrency(b.limit)}</span>
                        </div>
                        <div className="dsh-budget-track"><div className={`dsh-budget-bar ${cls}`} style={{ width: `${Math.min(100, b.percentage)}%` }}></div></div>
                        <div className="dsh-budget-bottom">
                          <span>{b.percentage}%</span>
                          <span className={`dsh-budget-status ${cls}`}>{b.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== RECENT ACTIVITY ===== */}
      <section className="dsh-activity">
        <div className="dsh-activity-head">
          <h2 className="dsh-panel-title">Recent {activeTab === 'income' ? 'Income' : 'Expenses'}</h2>
          <button className="dsh-viewall" onClick={() => navigate('/transactions')}>View All →</button>
        </div>
        <div className="dsh-tx-list">
          {filteredTransactions.length === 0 ? (
            <div className="dsh-empty"><span>💸</span><p>No recent {activeTab} transactions.</p></div>
          ) : filteredTransactions.map((tx) => (
            <div key={tx.id} className="dsh-tx">
              <div className={`dsh-tx-icon ${tx.type}`}>{getCategoryIcon(tx.category)}</div>
              <div className="dsh-tx-body">
                <span className="dsh-tx-title">{tx.description || tx.category}</span>
                <span className="dsh-tx-meta">
                  {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  <span className="dsh-tx-sep">•</span>{getPaymentMethodIcon(tx.paymentMethod)} {tx.paymentMethod}
                  {tx.merchantOrSource && <><span className="dsh-tx-sep">•</span>{tx.merchantOrSource}</>}
                </span>
              </div>
              <span className={`dsh-tx-amt ${tx.type}`}>{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== QUICK NAV ===== */}
      <section className="dsh-quicknav">
        {[
          { icon: '💰', label: 'Income', to: '/income' },
          { icon: '💳', label: 'Expenses', to: '/expense' },
          { icon: '📊', label: 'Analytics', to: '/analytics' },
          { icon: '🎯', label: 'Budget', to: '/budget' },
          { icon: '🔄', label: 'History', to: '/transactions' },
          { icon: '⚙️', label: 'Settings', to: '/profile' },
        ].map((n, i) => (
          <button key={i} className="dsh-nav-btn" onClick={() => navigate(n.to)}>
            <span className="dsh-nav-icon">{n.icon}</span>
            <span className="dsh-nav-label">{n.label}</span>
          </button>
        ))}
      </section>
    </div>
  );
}
