import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { reportAPI } from '../api/client';

const COLORS = ['#10b981', '#ef4444', '#f97316', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#eab308', '#6366f1', '#84cc16'];

export default function Analytics() {
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [incomeAnalytics, setIncomeAnalytics] = useState(null);
  const [expenseAnalytics, setExpenseAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      reportAPI.getMonthly({ month: new Date().getMonth() + 1, year: new Date().getFullYear() }),
      reportAPI.getIncomeAnalytics(),
      reportAPI.getExpenseAnalytics(),
    ]).then(([monRes, incRes, expRes]) => {
      setMonthlyReport(monRes.data.data);
      setIncomeAnalytics(incRes.data.data);
      setExpenseAnalytics(expRes.data.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-body"><p>Loading analytics...</p></div>;

  const comparisonData = monthlyReport ? [
    { name: 'Income', amount: monthlyReport.income, fill: '#10b981' },
    { name: 'Expense', amount: monthlyReport.expense, fill: '#ef4444' },
    { name: 'Savings', amount: monthlyReport.savings > 0 ? monthlyReport.savings : 0, fill: '#3b82f6' },
  ] : [];

  const pieData = expenseAnalytics?.categoryDistribution?.map((c) => ({ name: c.category, value: c.amount })) || [];

  return (
    <div>
      <div className="page-header"><h2>📈 Analytics & Reports</h2></div>
      <div className="page-body">
        {monthlyReport && (
          <div className="grid-4" style={{ marginBottom: 24 }}>
            <div className="card summary-card">
              <div className="sc-icon icon-green">💰</div>
              <div className="sc-label">Monthly Income</div>
              <div className="sc-value">₹{monthlyReport.income.toLocaleString()}</div>
              <div className="sc-change positive">{monthlyReport.month} {monthlyReport.year}</div>
            </div>
            <div className="card summary-card">
              <div className="sc-icon icon-red">💳</div>
              <div className="sc-label">Monthly Expense</div>
              <div className="sc-value">₹{monthlyReport.expense.toLocaleString()}</div>
              <div className="sc-change negative">{monthlyReport.month} {monthlyReport.year}</div>
            </div>
            <div className="card summary-card">
              <div className="sc-icon icon-blue">🏦</div>
              <div className="sc-label">Savings</div>
              <div className="sc-value">₹{monthlyReport.savings.toLocaleString()}</div>
              <div className={`sc-change ${monthlyReport.savings >= 0 ? 'positive' : 'negative'}`}>
                {monthlyReport.savings >= 0 ? '↑ Positive' : '↓ Negative'}
              </div>
            </div>
            <div className="card summary-card">
              <div className="sc-icon icon-orange">📊</div>
              <div className="sc-label">Savings Rate</div>
              <div className="sc-value">{monthlyReport.savingsRate}%</div>
              <div className="sc-change positive">of income saved</div>
            </div>
          </div>
        )}

        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="card">
            <div className="card-header"><h3>Income vs Expense vs Savings</h3></div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={comparisonData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Amount']} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {comparisonData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3>Spending Breakdown</h3></div>
            <div className="chart-container">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieData.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="chart-placeholder">No expense data to display</div>}
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <div className="card-header"><h3>Income Sources</h3></div>
            {incomeAnalytics?.incomeSources?.length > 0 ? (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={incomeAnalytics.incomeSources} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="source" tick={{ fontSize: 12 }} width={80} />
                    <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Amount']} />
                    <Bar dataKey="amount" fill="#10b981" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : <div className="chart-placeholder">No income data</div>}
          </div>
          <div className="card">
            <div className="card-header"><h3>Spending by Category</h3></div>
            {expenseAnalytics?.categoryDistribution?.length > 0 ? (
              <div style={{ padding: '8px 0' }}>
                {expenseAnalytics.categoryDistribution.map((c, i) => (
                  <div key={c.category} className="budget-progress">
                    <div className="bp-header">
                      <span>{c.category}</span>
                      <span>₹{c.amount.toLocaleString()} ({c.percentage}%)</span>
                    </div>
                    <div className="bp-bar">
                      <div className="bp-fill safe" style={{ width: `${c.percentage}%`, background: COLORS[i % COLORS.length] }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="chart-placeholder">No expense data</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
