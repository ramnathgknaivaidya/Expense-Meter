import { useState, useEffect } from 'react';
import api from '../api/client';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const MOCK_MONTHLY_DATA = [
  { month: 'Feb', income: 55000, expense: 32000 },
  { month: 'Mar', income: 60000, expense: 34000 },
  { month: 'Apr', income: 62000, expense: 39000 },
  { month: 'May', income: 68000, expense: 36000 },
  { month: 'Jun', income: 70000, expense: 37500 },
  { month: 'Jul', income: 75000, expense: 39500 },
];

const MOCK_CATEGORIES = [
  { category: 'Housing', amount: 15000, percentage: 38 },
  { category: 'Food', amount: 5500, percentage: 14 },
  { category: 'Transport', amount: 5500, percentage: 14 },
  { category: 'Education', amount: 5000, percentage: 13 },
  { category: 'Bills', amount: 3000, percentage: 8 },
  { category: 'Shopping', amount: 2500, percentage: 6 },
  { category: 'Entertainment', amount: 2000, percentage: 5 },
  { category: 'Healthcare', amount: 1000, percentage: 2 },
];

const MOCK_TRENDS = [
  { week: 'Week 1', amount: 8500 },
  { week: 'Week 2', amount: 11200 },
  { week: 'Week 3', amount: 9800 },
  { week: 'Week 4', amount: 10000 },
];

const MOCK_QUICK_STATS = {
  highestSpendingDay: 'Monday',
  avgDailyExpense: 1317,
  mostUsedPayment: 'UPI',
  totalTransactions: 47,
};

const PIE_COLORS = ['#f97316', '#ef4444', '#f87171', '#fb923c', '#fca5a5', '#fdba74', '#fecaca', '#fed7aa'];

export default function Analytics() {
  const [monthlyData, setMonthlyData] = useState(MOCK_MONTHLY_DATA);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [trends, setTrends] = useState(MOCK_TRENDS);
  const [quickStats, setQuickStats] = useState(MOCK_QUICK_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          api.get('/analytics/income'),
          api.get('/analytics/expense'),
        ]);

        const incomeData = incomeRes.data;
        const expenseData = expenseRes.data;

        // Build monthly comparison from available data
        if (expenseData.spendingTrends && expenseData.spendingTrends.length > 0) {
          setTrends(expenseData.spendingTrends.map((t, i) => ({ week: `Week ${i + 1}`, amount: t.amount || t })));
        }
        if (expenseData.categoryDistribution) {
          setCategories(expenseData.categoryDistribution);
        }
        if (expenseData.highestCategory) {
          setQuickStats(prev => ({ ...prev, highestCategory: expenseData.highestCategory }));
        }
      } catch (err) {
        console.warn('API offline, using mock analytics data');
        // Already initialized with mock data
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="page-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Analytics & Reports</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Deep insights into your financial habits and patterns</p>
      </div>

      {/* Quick Stats */}
      <div className="grid-4" style={{ marginBottom: '20px' }}>
        <div className="card summary-card">
          <div className="sc-icon icon-red" style={{ marginBottom: '10px' }}>📅</div>
          <div className="sc-label">Highest Spending Day</div>
          <div className="sc-value" style={{ fontSize: '1.2rem' }}>{quickStats.highestSpendingDay}</div>
        </div>
        <div className="card summary-card">
          <div className="sc-icon icon-orange" style={{ marginBottom: '10px' }}>📊</div>
          <div className="sc-label">Avg Daily Expense</div>
          <div className="sc-value" style={{ fontSize: '1.2rem' }}>{formatCurrency(quickStats.avgDailyExpense)}</div>
        </div>
        <div className="card summary-card">
          <div className="sc-icon icon-blue" style={{ marginBottom: '10px' }}>💳</div>
          <div className="sc-label">Most Used Payment</div>
          <div className="sc-value" style={{ fontSize: '1.2rem' }}>{quickStats.mostUsedPayment}</div>
        </div>
        <div className="card summary-card">
          <div className="sc-icon icon-green" style={{ marginBottom: '10px' }}>🔢</div>
          <div className="sc-label">Total Transactions</div>
          <div className="sc-value" style={{ fontSize: '1.2rem' }}>{quickStats.totalTransactions}</div>
        </div>
      </div>

      {/* Charts Row 1: Income vs Expense + Category Breakdown */}
      <div className="grid-2" style={{ marginBottom: '20px' }}>
        {/* Income vs Expense Bar Chart */}
        <div className="card">
          <div className="card-header">
            <h3>Income vs Expense</h3>
            <span className="badge badge-income">Last 6 months</span>
          </div>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={(v) => `₹${(v / 1000)}k`} />
                <Tooltip
                  formatter={(value, name) => [formatCurrency(value), name === 'income' ? 'Income' : 'Expense']}
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="income" fill="var(--green)" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="var(--red)" radius={[4, 4, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="card">
          <div className="card-header">
            <h3>Category Breakdown</h3>
            <span className="badge badge-expense">Expenses</span>
          </div>
          <div style={{ height: '280px', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="amount"
                  nameKey="category"
                >
                  {categories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [formatCurrency(value), name]}
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginTop: '8px' }}>
            {categories.slice(0, 8).map((cat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                <span style={{ color: 'var(--text-secondary)' }}>{cat.category} ({cat.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Spending Trends */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <h3>Weekly Spending Trends</h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>This month</span>
        </div>
        <div style={{ height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--orange)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--orange)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={(v) => `₹${(v / 1000)}k`} />
              <Tooltip
                formatter={(value) => [formatCurrency(value), 'Spent']}
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="amount" stroke="var(--orange)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSpending)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Savings Trend Line Chart */}
      <div className="card">
        <div className="card-header">
          <h3>Savings Trend</h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Net savings per month</span>
        </div>
        <div style={{ height: '240px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData.map(m => ({ ...m, savings: m.income - m.expense }))} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={(v) => `₹${(v / 1000)}k`} />
              <Tooltip
                formatter={(value, name) => [formatCurrency(value), name.charAt(0).toUpperCase() + name.slice(1)]}
                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
              />
              <Legend />
              <Line type="monotone" dataKey="savings" stroke="var(--blue)" strokeWidth={2.5} dot={{ r: 4 }} name="Savings" />
              <Line type="monotone" dataKey="income" stroke="var(--green)" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Income" />
              <Line type="monotone" dataKey="expense" stroke="var(--red)" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Expense" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
