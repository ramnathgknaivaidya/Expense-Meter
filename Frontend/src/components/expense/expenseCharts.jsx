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
  Legend,
} from 'recharts';

const COLORS = ['#ef4444', '#f97316', '#fb923c', '#f87171', '#fca5a5', '#fdba74', '#fecaca', '#fed7aa', '#ffedd5', '#fee2e2'];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function ExpenseCharts({ expenses = [], budgetStatus = null, trends = [] }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Filter current month expenses
  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  // 1. Spending Breakdown Data (Pie Chart)
  const categoryTotals = currentMonthExpenses.reduce((acc, curr) => {
    const cat = curr.category;
    acc[cat] = (acc[cat] || 0) + curr.amount;
    return acc;
  }, {});

  const totalExpense = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
    percentage: totalExpense > 0 ? Math.round((value / totalExpense) * 100) : 0
  })).sort((a, b) => b.value - a.value);

  // 2. Budget Comparison Data (Bar Chart)
  const barData = budgetStatus?.budgets?.map(b => ({
    name: b.category,
    Planned: b.limit,
    Actual: b.spent,
  })) || [];

  // 3. Calendar Heatmap Calculations
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...

  // Compute daily totals for heatmap
  const dailyTotals = Array(daysInMonth + 1).fill(0);
  const dailyCounts = Array(daysInMonth + 1).fill(0);
  
  currentMonthExpenses.forEach(e => {
    const day = new Date(e.date).getDate();
    if (day >= 1 && day <= daysInMonth) {
      dailyTotals[day] += e.amount;
      dailyCounts[day] += 1;
    }
  });

  const maxDailyTotal = Math.max(...dailyTotals, 1000); // minimum scale at ₹1,000

  // Calendar cells mapping
  const calendarCells = [];
  // Fill initial empty slots
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push({ empty: true, id: `empty-${i}` });
  }
  // Fill actual days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push({
      empty: false,
      day,
      total: dailyTotals[day],
      count: dailyCounts[day],
      id: `day-${day}`
    });
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="expense-charts-section">
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        
        {/* Widget 1: Spending Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>Category Distribution</h3>
          {pieData.length === 0 ? (
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No expense data recorded this month.
            </div>
          ) : (
            <>
              <div style={{ height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [formatCurrency(value), 'Total Spent']}
                      contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Breakdown List */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '14px' }}>
                {pieData.slice(0, 6).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1, color: 'var(--text-secondary)' }}>
                      {item.name}: <strong>{formatCurrency(item.value)}</strong> ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Widget 2: Budget Comparison */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>Budget vs Actual Spending</h3>
          {barData.length === 0 ? (
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Setup budgets to check targets comparison.
            </div>
          ) : (
            <div style={{ height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
                  <Legend wrapperStyle={{ fontSize: '0.8rem', marginTop: '10px' }} />
                  <Bar dataKey="Planned" fill="var(--border)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Actual" fill="var(--orange)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>

      <div className="grid-2" style={{ marginBottom: '28px' }}>
        
        {/* Widget 3: Monthly Expense Trend */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>Historical Expense Trajectory</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Spent']} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
                <Line type="monotone" dataKey="expense" stroke="var(--red)" strokeWidth={3} dot={{ r: 4, stroke: 'var(--red)', strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Widget 4: Spending Heatmap Calendar */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Daily Spending Density</h3>
            <small style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{now.toLocaleString('default', { month: 'long' })} {year}</small>
          </div>
          
          <div className="heatmap-wrap">
            <div className="heatmap-grid" style={{ marginBottom: '8px' }}>
              {weekdays.map(d => (
                <div key={d} className="heatmap-day-header">{d}</div>
              ))}
            </div>
            
            <div className="heatmap-grid">
              {calendarCells.map((cell) => {
                if (cell.empty) {
                  return <div key={cell.id} style={{ background: 'transparent' }} />;
                }

                // Calculate color intensity (red shade) based on daily spending
                let cellBg = 'var(--bg)';
                let textColor = 'var(--text-secondary)';
                let borderStyle = '1px solid var(--border)';
                
                if (cell.total > 0) {
                  const intensity = Math.min(1.0, cell.total / maxDailyTotal);
                  // Calculate opacity from 0.08 (light red) to 0.95 (strong solid red)
                  const opacity = 0.08 + intensity * 0.87;
                  cellBg = `rgba(239, 68, 68, ${opacity})`;
                  textColor = opacity > 0.5 ? '#fff' : 'var(--text)';
                  borderStyle = '1px solid rgba(239, 68, 68, 0.3)';
                }

                return (
                  <div 
                    key={cell.id} 
                    className="heatmap-cell"
                    style={{ 
                      backgroundColor: cellBg, 
                      color: textColor,
                      border: borderStyle
                    }}
                    title={cell.total > 0 
                      ? `${cell.day} July: Spent ${formatCurrency(cell.total)} (${cell.count} tx)` 
                      : `${cell.day} July: No expenses recorded`
                    }
                  >
                    <span className="heatmap-date" style={{ color: cell.total > 0 && cell.total / maxDailyTotal > 0.5 ? '#fff' : 'var(--text-secondary)' }}>
                      {cell.day}
                    </span>
                    {cell.total > 0 && (
                      <span className="heatmap-amount" style={{ color: cell.total / maxDailyTotal > 0.5 ? '#fff' : 'var(--red)' }}>
                        {formatCurrency(cell.total)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Heatmap Legend */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px', marginTop: '16px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>No spend</span>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--bg)', border: '1px solid var(--border)' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.2)' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(239, 68, 68, 0.45)', border: '1px solid rgba(239, 68, 68, 0.3)' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(239, 68, 68, 0.85)', border: '1px solid rgba(239, 68, 68, 0.5)' }} />
              <span>High spend</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
