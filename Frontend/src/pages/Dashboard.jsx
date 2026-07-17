import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Custom currency formatter
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

// Category Icon Mapping
const getCategoryIcon = (category) => {
  const cat = category.toLowerCase();
  if (cat.includes('salary') || cat.includes('job')) return '💼';
  if (cat.includes('freelance') || cat.includes('project')) return '💻';
  if (cat.includes('business') || cat.includes('revenue')) return '🏪';
  if (cat.includes('invest') || cat.includes('dividend')) return '📈';
  if (cat.includes('bonus') || cat.includes('gift')) return '🎁';
  if (cat.includes('food') || cat.includes('eat') || cat.includes('swiggy') || cat.includes('cafe')) return '🍔';
  if (cat.includes('transport') || cat.includes('cab') || cat.includes('uber') || cat.includes('fuel')) return '🚗';
  if (cat.includes('housing') || cat.includes('rent') || cat.includes('landlord')) return '🏠';
  if (cat.includes('bill') || cat.includes('electricity') || cat.includes('water')) return '💡';
  if (cat.includes('shopping') || cat.includes('clothes') || cat.includes('amazon')) return '🛍️';
  if (cat.includes('health') || cat.includes('medicine') || cat.includes('pharmacy')) return '🏥';
  if (cat.includes('education') || cat.includes('course') || cat.includes('coursera')) return '🎓';
  if (cat.includes('entertainment') || cat.includes('netflix') || cat.includes('sub')) return '🍿';
  return '💸';
};

// Payment Method Icon Mapping
const getPaymentMethodIcon = (method) => {
  const m = method?.toLowerCase() || '';
  if (m.includes('cash')) return '💵';
  if (m.includes('upi')) return '📱';
  if (m.includes('card')) return '💳';
  if (m.includes('bank') || m.includes('transfer')) return '🏛️';
  return '🔌';
};

// High-fidelity fallback mock data when backend/db is offline or seeding is missing
const MOCK_DATA = {
  summary: {
    totalIncome: 75000,
    totalExpense: 39500,
    balance: 35500,
    savingsRate: 47, // (35500 / 75000) * 100
    incomeGrowth: 15.4,
    expenseChange: 8.2,
    balanceChange: 24.6,
  },
  incomeAnalytics: {
    monthlyIncome: 75000,
    growthPercentage: 15.4,
    highestSource: 'Salary',
    sources: [
      { source: 'Salary', amount: 50000, percentage: 67 },
      { source: 'Freelance', amount: 12000, percentage: 16 },
      { source: 'Business', amount: 8000, percentage: 11 },
      { source: 'Investment', amount: 3000, percentage: 4 },
      { source: 'Bonus', amount: 2000, percentage: 2 },
    ],
  },
  expenseAnalytics: {
    monthlyExpense: 39500,
    highestCategory: 'Housing',
    spendingRate: 53,
    categories: [
      { category: 'Housing', amount: 15000, percentage: 38 },
      { category: 'Food', amount: 5500, percentage: 14 },
      { category: 'Transport', amount: 5500, percentage: 14 },
      { category: 'Education', amount: 5000, percentage: 13 },
      { category: 'Bills', amount: 3000, percentage: 8 },
      { category: 'Shopping', amount: 2500, percentage: 6 },
      { category: 'Entertainment', amount: 2000, percentage: 5 },
      { category: 'Healthcare', amount: 1000, percentage: 2 },
    ],
  },
  budgetStatus: {
    budgets: [
      { category: 'Housing', limit: 15000, spent: 15000, remaining: 0, percentage: 100, status: 'Exceeded' },
      { category: 'Food', limit: 6000, spent: 5500, remaining: 500, percentage: 92, status: 'Warning' },
      { category: 'Transport', limit: 3000, spent: 5500, remaining: -2500, percentage: 183, status: 'Exceeded' },
      { category: 'Shopping', limit: 5000, spent: 2500, remaining: 2500, percentage: 50, status: 'On Track' },
    ],
    summary: {
      totalBudget: 29000,
      totalSpent: 28500,
      totalRemaining: 500,
      overallPercentage: 98,
    },
  },
  transactions: [
    { id: 'tx_1', type: 'income', amount: 2000, category: 'Bonus', paymentMethod: 'Bank Transfer', description: 'Performance bonus', date: '2026-07-20T00:00:00.000Z' },
    { id: 'tx_2', type: 'expense', amount: 3500, category: 'Transport', paymentMethod: 'UPI', merchantOrSource: 'Indian Oil', description: 'Fuel refill', date: '2026-07-20T00:00:00.000Z' },
    { id: 'tx_3', type: 'expense', amount: 1000, category: 'Food', paymentMethod: 'Cash', merchantOrSource: 'Local Cafe', description: 'Lunch', date: '2026-07-18T00:00:00.000Z' },
    { id: 'tx_4', type: 'expense', amount: 2000, category: 'Entertainment', paymentMethod: 'Debit Card', merchantOrSource: 'Netflix', description: 'Subscriptions', date: '2026-07-16T00:00:00.000Z' },
    { id: 'tx_5', type: 'income', amount: 8000, category: 'Business', paymentMethod: 'Card', description: 'Side business revenue', date: '2026-07-15T00:00:00.000Z' },
    { id: 'tx_6', type: 'expense', amount: 5000, category: 'Education', paymentMethod: 'UPI', merchantOrSource: 'Coursera', description: 'Online course', date: '2026-07-14T00:00:00.000Z' },
    { id: 'tx_7', type: 'expense', amount: 1500, category: 'Healthcare', paymentMethod: 'Cash', merchantOrSource: 'Apollo Pharmacy', description: 'Medicine', date: '2026-07-12T00:00:00.000Z' },
    { id: 'tx_8', type: 'income', amount: 3000, category: 'Investment', paymentMethod: 'Bank Transfer', description: 'Stock dividends', date: '2026-07-10T00:00:00.000Z' },
    { id: 'tx_9', type: 'expense', amount: 2500, category: 'Shopping', paymentMethod: 'Credit Card', merchantOrSource: 'Amazon', description: 'Clothes purchase', date: '2026-07-08T00:00:00.000Z' },
    { id: 'tx_10', type: 'income', amount: 12000, category: 'Freelance', paymentMethod: 'UPI', description: 'Web dev project', date: '2026-07-05T00:00:00.000Z' },
    { id: 'tx_11', type: 'income', amount: 50000, category: 'Salary', paymentMethod: 'Bank Transfer', description: 'July salary', date: '2026-07-01T00:00:00.000Z' },
  ],
  trends: [
    { name: 'Feb', income: 55000, expense: 32000, savings: 23000 },
    { name: 'Mar', income: 60000, expense: 34000, savings: 26000 },
    { name: 'Apr', income: 62000, expense: 39000, savings: 23000 },
    { name: 'May', income: 68000, expense: 36000, savings: 32000 },
    { name: 'Jun', income: 70000, expense: 37500, savings: 32500 },
    { name: 'Jul', income: 75000, expense: 39500, savings: 35500 },
  ],
};

const COLORS = {
  income: ['#10b981', '#34d399', '#059669', '#6ee7b7', '#a7f3d0'],
  expense: ['#f97316', '#ef4444', '#f87171', '#fb923c', '#fca5a5', '#fdba74', '#fecaca', '#fed7aa'],
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('income'); // 'income' | 'expense'
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);
  const [dashboardData, setDashboardData] = useState(MOCK_DATA);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        // Attempt to fetch all resources in parallel from the running backend
        const [
          summaryRes,
          incomeAnalyticsRes,
          expenseAnalyticsRes,
          budgetRes,
          transactionsRes,
        ] = await Promise.all([
          api.get('/dashboard'),
          api.get('/analytics/income'),
          api.get('/analytics/expense'),
          api.get('/budget/status'),
          api.get('/transactions?limit=20'),
        ]);

        // Synthesize API responses into the dashboard data structure
        const summary = summaryRes.data;
        const incomeAnalytics = incomeAnalyticsRes.data;
        const expenseAnalytics = expenseAnalyticsRes.data;
        const budgetStatus = budgetRes.data;
        const transactions = transactionsRes.data.results || [];

        // Build active trends from dynamic transactions or fallback
        const trends = MOCK_DATA.trends; // Standard historical representation

        setDashboardData({
          summary: {
            totalIncome: summary.totalIncome || 0,
            totalExpense: summary.totalExpense || 0,
            balance: summary.balance || 0,
            savingsRate: summary.savings || 0,
            incomeGrowth: incomeAnalytics.growthPercentage || 0,
            expenseChange: MOCK_DATA.summary.expenseChange, // fallback for comparison percentage
            balanceChange: MOCK_DATA.summary.balanceChange, // fallback for comparison percentage
          },
          incomeAnalytics: {
            monthlyIncome: incomeAnalytics.monthlyIncome || 0,
            growthPercentage: incomeAnalytics.growthPercentage || 0,
            highestSource: incomeAnalytics.incomeSources?.[0]?.source || 'N/A',
            sources: incomeAnalytics.incomeSources?.map(s => ({
              source: s.source,
              amount: s.amount,
              percentage: s.percentage,
            })) || [],
          },
          expenseAnalytics: {
            monthlyExpense: expenseAnalytics.categoryDistribution?.reduce((a, b) => a + b.amount, 0) || 0,
            highestCategory: expenseAnalytics.highestCategory || 'N/A',
            spendingRate: summary.totalIncome > 0 ? Math.round((summary.totalExpense / summary.totalIncome) * 100) : 0,
            categories: expenseAnalytics.categoryDistribution?.map(c => ({
              category: c.category,
              amount: c.amount,
              percentage: c.percentage,
            })) || [],
          },
          budgetStatus: {
            budgets: budgetStatus.budgets || [],
            summary: budgetStatus.summary || { totalBudget: 0, totalSpent: 0, totalRemaining: 0, overallPercentage: 0 },
          },
          transactions: transactions,
          trends: trends,
        });
        setIsMockMode(false);
      } catch (error) {
        console.warn('⚠️ API connection failed, falling back to offline Mock Mode.');
        console.error(error);
        setDashboardData(MOCK_DATA);
        setIsMockMode(true);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  const { summary, incomeAnalytics, expenseAnalytics, budgetStatus, transactions, trends } = dashboardData;

  // Filter transactions based on selection for Toggleable List
  const filteredTransactions = transactions
    .filter((tx) => (activeTab === 'income' ? tx.type === 'income' : tx.type === 'expense'))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '16px' }}>
        <div className="avatar" style={{ width: '60px', height: '60px', fontSize: '2rem', animation: 'pulse 1.5s infinite ease-in-out' }}>📊</div>
        <h3>Loading your financial dashboard...</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Compiling live ledger records</p>
      </div>
    );
  }

  return (
    <div className="page-body">
      {/* Top Banner with Alert for Database Connectivity */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Control Room</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, <strong>{user?.name || 'User'}</strong>. Here is your overview.</p>
        </div>
        
        {isMockMode ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(249, 115, 22, 0.1)', border: '1px solid var(--orange)', color: 'var(--orange)', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>⚡ Demo Data Mode (Offline)</span>
          </div>
        ) : (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--green)', color: 'var(--green)', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>● Live Database Sync</span>
          </div>
        )}
      </div>

      {/* 1.1 Hero Dashboard Section */}
      <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', lgDirection: 'row', gap: '30px', justifyContent: 'space-between', zIndex: 2, position: 'relative' }}>
          <div style={{ flex: 1.2 }}>
            <h1>Manage Your Money. Track Your Growth.</h1>
            <p>
              Expense Meter helps users track income, monitor expenses, analyze spending habits, and build better
              financial management practices through simple and visual financial insights.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary-hero" onClick={() => navigate('/income')}>
                💰 Add Income
              </button>
              <button className="btn" onClick={() => navigate('/expense')}>
                💳 Add Expense
              </button>
            </div>
          </div>

          {/* Premium Financial Flow Visual */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '280px' }}>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', borderRadius: 'var(--radius)', border: '1px solid rgba(255,255,255,0.15)', padding: '20px', gap: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
              
              {/* Income Node */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '8px' }}>💰</div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Income</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6ee7b7' }}>100%</span>
              </div>

              {/* Connecting Dot Flow */}
              <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold', fontSize: '1.2rem' }}>➔</div>

              {/* Expense Node */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '8px' }}>💸</div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Expense</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fca5a5' }}>{expenseAnalytics.spendingRate}%</span>
              </div>

              {/* Connecting Dot Flow */}
              <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold', fontSize: '1.2rem' }}>➔</div>

              {/* Savings Node */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '8px' }}>🐷</div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Savings</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#93c5fd' }}>{summary.savingsRate}%</span>
              </div>

              {/* Connecting Dot Flow */}
              <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold', fontSize: '1.2rem' }}>➔</div>

              {/* Growth Node */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '8px' }}>🚀</div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Growth</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fbbf24' }}>+{summary.balanceChange}%</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 1.3 Financial Summary Cards */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {/* Card 01 — Total Balance */}
        <div className="card summary-card" style={{ borderTop: '5px solid var(--blue)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header" style={{ padding: 0, marginBottom: 0 }}>
              <span className="sc-label">TOTAL BALANCE</span>
              <div className="sc-icon icon-blue">👛</div>
            </div>
            <h2 className="sc-value" style={{ marginTop: '8px' }}>{formatCurrency(summary.balance)}</h2>
          </div>
          <div className="sc-change positive" style={{ marginTop: '12px' }}>
            <span>▲</span>
            <span>+{summary.balanceChange}% growth this month</span>
          </div>
        </div>

        {/* Card 02 — Total Income */}
        <div className="card summary-card" style={{ borderTop: '5px solid var(--green)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header" style={{ padding: 0, marginBottom: 0 }}>
              <span className="sc-label">TOTAL INCOME</span>
              <div className="sc-icon icon-green">📈</div>
            </div>
            <h2 className="sc-value" style={{ marginTop: '8px' }}>{formatCurrency(summary.totalIncome)}</h2>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div className="sc-change positive" style={{ marginBottom: '4px' }}>
              <span>▲</span>
              <span>+{summary.incomeGrowth}% vs prev month</span>
            </div>
            <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Top Source: <strong>{incomeAnalytics.highestSource}</strong></small>
          </div>
        </div>

        {/* Card 03 — Total Expense */}
        <div className="card summary-card" style={{ borderTop: '5px solid var(--red)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header" style={{ padding: 0, marginBottom: 0 }}>
              <span className="sc-label">TOTAL EXPENDITURE</span>
              <div className="sc-icon icon-red">📉</div>
            </div>
            <h2 className="sc-value" style={{ marginTop: '8px' }}>{formatCurrency(summary.totalExpense)}</h2>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div className="sc-change negative" style={{ marginBottom: '4px', color: 'var(--orange)' }}>
              <span>▼</span>
              <span>Spent {expenseAnalytics.spendingRate}% of Income</span>
            </div>
            <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Highest: <strong>{expenseAnalytics.highestCategory}</strong></small>
          </div>
        </div>

        {/* Card 04 — Savings */}
        <div className="card summary-card" style={{ borderTop: '5px solid var(--orange)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header" style={{ padding: 0, marginBottom: 0 }}>
              <span className="sc-label">TOTAL SAVINGS</span>
              <div className="sc-icon icon-orange">🐷</div>
            </div>
            <h2 className="sc-value" style={{ marginTop: '8px' }}>{formatCurrency(summary.totalIncome - summary.totalExpense)}</h2>
          </div>
          <div style={{ marginTop: '12px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
              <span style={{ fontWeight: 600, color: 'var(--green)' }}>Savings Rate: {summary.savingsRate}%</span>
              <span style={{ color: 'var(--text-secondary)' }}>Goal: 30%</span>
            </div>
            <div className="budget-progress" style={{ margin: 0 }}>
              <div className="bp-bar" style={{ height: '6px' }}>
                <div 
                  className="bp-fill safe" 
                  style={{ 
                    width: `${Math.min(100, (summary.savingsRate / 30) * 100)}%`,
                    backgroundColor: summary.savingsRate >= 30 ? 'var(--green)' : 'var(--blue)' 
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1.2 Income / Expenditure Toggle Section */}
      <section className="toggle-section card" style={{ padding: '24px' }}>
        <div className="toggle-header">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Financial Overview</h3>
          
          {/* Animated Toggle Switch */}
          <div className="toggle-switch" style={{ width: '280px' }}>
            <div className={`toggle-slider ${activeTab}`} />
            <button
              className={`toggle-btn income ${activeTab === 'income' ? 'active' : ''}`}
              onClick={() => setActiveTab('income')}
              style={{ flex: 1, border: 'none', background: 'none' }}
            >
              Income Streams
            </button>
            <button
              className={`toggle-btn expense ${activeTab === 'expense' ? 'active' : ''}`}
              onClick={() => setActiveTab('expense')}
              style={{ flex: 1, border: 'none', background: 'none' }}
            >
              Expenditures
            </button>
          </div>
        </div>

        {/* Dynamic Content Switching grid */}
        <div className="grid-2" style={{ marginTop: '24px' }}>
          
          {/* LEFT WIDGET: Charts */}
          <div className="card" style={{ boxShadow: 'none', border: '1px solid var(--border)', background: 'var(--bg)', padding: '20px' }}>
            <h4 style={{ marginBottom: '16px', fontWeight: 600, color: 'var(--text)' }}>
              {activeTab === 'income' ? 'Income Stream Contribution' : 'Expense Category Distribution'}
            </h4>
            
            <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeTab === 'income' ? incomeAnalytics.sources : expenseAnalytics.categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="amount"
                    nameKey={activeTab === 'income' ? 'source' : 'category'}
                  >
                    {(activeTab === 'income' ? incomeAnalytics.sources : expenseAnalytics.categories).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={activeTab === 'income' ? COLORS.income[index % COLORS.income.length] : COLORS.expense[index % COLORS.expense.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), activeTab === 'income' ? 'Source' : 'Category']}
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Premium Legend */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '16px' }}>
              {(activeTab === 'income' ? incomeAnalytics.sources : expenseAnalytics.categories).slice(0, 6).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: activeTab === 'income' ? COLORS.income[idx % COLORS.income.length] : COLORS.expense[idx % COLORS.expense.length] }} />
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1, color: 'var(--text-secondary)' }}>
                    {activeTab === 'income' ? item.source : item.category}: <strong>{item.percentage}%</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT WIDGET: Analytics Trends / Budget Progress */}
          <div className="card" style={{ boxShadow: 'none', border: '1px solid var(--border)', background: 'var(--bg)', padding: '20px' }}>
            {activeTab === 'income' ? (
              // Income Mode: Growth & Historical Area Chart
              <>
                <h4 style={{ marginBottom: '16px', fontWeight: 600, color: 'var(--text)' }}>Monthly Income Growth Trend</h4>
                <div style={{ height: '240px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--green)" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="var(--green)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                      <YAxis stroke="var(--text-muted)" fontSize={11} />
                      <Tooltip formatter={(value) => [formatCurrency(value), 'Income']} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
                      <Area type="monotone" dataKey="income" stroke="var(--green)" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Showing income trajectory over the last 6 months
                </div>
              </>
            ) : (
              // Expenditure Mode: Budgets Usage Progress Bars
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontWeight: 600, color: 'var(--text)', margin: 0 }}>Monthly Budget Usage</h4>
                  <small style={{ color: 'var(--text-secondary)' }}>Overall: <strong>{budgetStatus.summary.overallPercentage}% used</strong></small>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                  {budgetStatus.budgets.length === 0 ? (
                    <div className="empty-state" style={{ padding: '20px' }}>
                      <div className="empty-icon">🎯</div>
                      <p>No monthly category budgets set yet.</p>
                      <button className="btn btn-sm btn-outline" style={{ marginTop: '10px' }} onClick={() => navigate('/budget')}>Setup Budgets</button>
                    </div>
                  ) : (
                    budgetStatus.budgets.map((b, index) => {
                      let fillClass = 'safe';
                      if (b.percentage >= 100) fillClass = 'danger';
                      else if (b.percentage >= 80) fillClass = 'warning';

                      return (
                        <div key={index} className="budget-progress" style={{ margin: 0 }}>
                          <div className="bp-header" style={{ fontSize: '0.82rem' }}>
                            <span style={{ fontWeight: 600 }}>{getCategoryIcon(b.category)} {b.category}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>
                              {formatCurrency(b.spent)} / <strong>{formatCurrency(b.limit)}</strong>
                            </span>
                          </div>
                          <div className="bp-bar" style={{ height: '8px', marginTop: '4px' }}>
                            <div className={`bp-fill ${fillClass}`} style={{ width: `${Math.min(100, b.percentage)}%` }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginTop: '2px', color: 'var(--text-muted)' }}>
                            <span>{b.percentage}% used</span>
                            <span style={{ 
                              color: b.status === 'Exceeded' ? 'var(--red)' : b.status === 'Warning' ? 'var(--orange)' : 'var(--green)',
                              fontWeight: 600
                            }}>
                              {b.status === 'Exceeded' ? 'Limit Exceeded!' : b.status === 'Warning' ? 'Approaching Limit' : 'On Track'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 1.4 Recent Activity Section */}
      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent {activeTab === 'income' ? 'Income Stream' : 'Expenditure'} Transactions</h3>
          <button className="btn btn-sm btn-outline" onClick={() => navigate('/transactions')}>
            View All Ledger
          </button>
        </div>

        <div>
          {filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💸</div>
              <p>No recent {activeTab === 'income' ? 'income' : 'expense'} transactions found.</p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div key={tx.id} className="transaction-card">
                <div className="tx-icon" style={{ 
                  backgroundColor: tx.type === 'income' ? 'var(--green-light)' : 'var(--red-light)', 
                  color: tx.type === 'income' ? 'var(--green)' : 'var(--red)'
                }}>
                  {getCategoryIcon(tx.category)}
                </div>
                
                <div className="tx-info">
                  <div className="tx-title">{tx.category}</div>
                  <div className="tx-meta">
                    <span>{new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>{getPaymentMethodIcon(tx.paymentMethod)} {tx.paymentMethod}</span>
                    {tx.merchantOrSource && (
                      <>
                        <span>•</span>
                        <span>{tx.merchantOrSource}</span>
                      </>
                    )}
                    {tx.description && (
                      <>
                        <span>•</span>
                        <span style={{ fontStyle: 'italic' }}>{tx.description}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className={`tx-amount ${tx.type === 'income' ? 'income' : 'expense'}`} style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
