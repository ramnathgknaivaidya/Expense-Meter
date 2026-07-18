import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#ef4444', '#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#fb7185', '#f59e0b'];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function IncomeCharts({ income = [], trends = [] }) {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const currentMonthIncome = income.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const totalIncome = currentMonthIncome.reduce((sum, item) => sum + item.amount, 0);

  const sourceTotals = currentMonthIncome.reduce((acc, curr) => {
    const key = curr.source || 'Other';
    acc[key] = (acc[key] || 0) + curr.amount;
    return acc;
  }, {});

  const pieData = Object.entries(sourceTotals)
    .map(([name, value]) => ({
      name,
      value,
      percentage: totalIncome > 0 ? Math.round((value / totalIncome) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);

  const paymentData = Object.entries(
    currentMonthIncome.reduce((acc, curr) => {
      const key = curr.paymentMethod || 'Other';
      acc[key] = (acc[key] || 0) + curr.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({
    name,
    amount: value,
  }));

  const topSource = pieData.length > 0 ? pieData[0].name : 'No data yet';

  return (
    <div className="income-charts-section">
      <div className="income-charts-top" style={{ marginBottom: '24px' }}>
        <div className="chart-stat">
          <span className="chart-label">This month</span>
          <strong>{formatCurrency(totalIncome)}</strong>
          <span className="chart-note">Total income recorded</span>
        </div>
        <div className="chart-stat">
          <span className="chart-label">Top source</span>
          <strong>{topSource}</strong>
          <span className="chart-note">Most frequent income type</span>
        </div>
        <div className="chart-stat">
          <span className="chart-label">Payment mix</span>
          <strong>{paymentData.length} methods</strong>
          <span className="chart-note">Revenue contribution view</span>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '20px', marginBottom: '28px' }}>
        <div className="card">
          <div className="card-header" style={{ padding: 0, marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Income Source Split</h3>
          </div>
          {pieData.length === 0 ? (
            <div className="chart-placeholder">No income data recorded this month.</div>
          ) : (
            <>
              <div style={{ height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={92}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [formatCurrency(value), 'Income']}
                      contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px', marginTop: '18px' }}>
                {pieData.map((item, index) => (
                  <div key={item.name} style={{ display: 'grid', gap: '6px', padding: '12px', background: 'var(--bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[index % COLORS.length] }} />
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.percentage}% of month</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="card">
          <div className="card-header" style={{ padding: 0, marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Payment Method Breakdown</h3>
          </div>
          {paymentData.length === 0 ? (
            <div className="chart-placeholder">No payment method data yet.</div>
          ) : (
            <div style={{ height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentData} margin={{ top: 10, right: 5, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)' }} />
                  <Bar dataKey="amount" fill="var(--orange)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ padding: 0, marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Income Trend Line</h3>
        </div>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" fontSize={11} />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Income']} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)' }} />
              <Line type="monotone" dataKey="income" stroke="var(--green)" strokeWidth={3} dot={{ r: 5, fill: '#fff', stroke: 'var(--green)', strokeWidth: 2 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
