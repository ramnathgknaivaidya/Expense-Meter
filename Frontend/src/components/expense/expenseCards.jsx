import React from 'react';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function ExpenseCards({ expenses = [], budgetStatus = null }) {
  // 1. Calculate Total Expense for current month
  const now = new Date();
  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalExpense = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // 2. Remaining Budget from budgetStatus
  const remainingBudget = budgetStatus?.summary?.totalRemaining !== undefined
    ? budgetStatus.summary.totalRemaining
    : (budgetStatus?.summary?.totalBudget || 0) - totalExpense;

  const totalBudget = budgetStatus?.summary?.totalBudget || 0;

  // 3. Daily Average (spent divided by current day of month)
  const currentDay = now.getDate();
  const dailyAverage = totalExpense > 0 ? totalExpense / currentDay : 0;

  // 4. Highest Spending Category
  const categoryTotals = currentMonthExpenses.reduce((acc, curr) => {
    const cat = curr.category;
    acc[cat] = (acc[cat] || 0) + curr.amount;
    return acc;
  }, {});

  let highestCategory = 'N/A';
  let highestAmount = 0;
  Object.entries(categoryTotals).forEach(([cat, val]) => {
    if (val > highestAmount) {
      highestAmount = val;
      highestCategory = cat;
    }
  });

  const cards = [
    {
      title: 'Total Expense',
      value: formatCurrency(totalExpense),
      desc: `${currentMonthExpenses.length} transactions this month`,
      icon: '📉',
      color: 'var(--red)',
      bgIcon: 'var(--red-light)',
    },
    {
      title: 'Remaining Budget',
      value: formatCurrency(Math.max(0, remainingBudget)),
      desc: totalBudget > 0 
        ? `${formatCurrency(remainingBudget)} of ${formatCurrency(totalBudget)} remaining`
        : 'Setup budgets in target tab',
      icon: '🎯',
      color: remainingBudget < 0 ? 'var(--red)' : remainingBudget < totalBudget * 0.15 ? 'var(--orange)' : 'var(--blue)',
      bgIcon: remainingBudget < 0 ? 'var(--red-light)' : remainingBudget < totalBudget * 0.15 ? 'var(--orange-light)' : 'var(--blue-light)',
    },
    {
      title: 'Daily Average',
      value: formatCurrency(dailyAverage),
      desc: `Calculated over ${currentDay} elapsed days`,
      icon: '📅',
      color: 'var(--orange)',
      bgIcon: 'var(--orange-light)',
    },
    {
      title: 'Highest Spending',
      value: highestCategory !== 'N/A' ? highestCategory : 'None',
      desc: highestAmount > 0 ? `Totaled ${formatCurrency(highestAmount)}` : 'No expenses recorded',
      icon: '👑',
      color: 'var(--green)',
      bgIcon: 'var(--green-light)',
    },
  ];

  return (
    <div className="grid-4">
      {cards.map((c, index) => (
        <div key={index} className="card summary-card" style={{ borderTop: `5px solid ${c.color}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header" style={{ padding: 0, marginBottom: 0 }}>
              <span className="sc-label">{c.title}</span>
              <div className="sc-icon" style={{ backgroundColor: c.bgIcon, color: c.color }}>{c.icon}</div>
            </div>
            <h2 className="sc-value" style={{ marginTop: '8px', fontSize: '1.5rem' }}>{c.value}</h2>
          </div>
          <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {c.desc}
          </div>
        </div>
      ))}
    </div>
  );
}
