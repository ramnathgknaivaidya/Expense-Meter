import React from 'react';
import { IconWallet, IconTarget, IconCalendar, IconPin } from '../../utils/icons';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function IncomeCards({ income = [], budgetStatus = null }) {
  const now = new Date();
  const currentMonthIncome = income.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalIncome = currentMonthIncome.reduce((sum, e) => sum + e.amount, 0);
  const currentDay = now.getDate();
  const dailyAverage = totalIncome > 0 ? totalIncome / currentDay : 0;

  const sourceTotals = currentMonthIncome.reduce((acc, curr) => {
    const key = curr.source || 'Other';
    acc[key] = (acc[key] || 0) + curr.amount;
    return acc;
  }, {});

  let topSource = 'N/A';
  let topSourceAmount = 0;
  Object.entries(sourceTotals).forEach(([source, value]) => {
    if (value > topSourceAmount) {
      topSourceAmount = value;
      topSource = source;
    }
  });

  const remainingBudget = budgetStatus?.summary?.totalRemaining !== undefined
    ? budgetStatus.summary.totalRemaining
    : 0;

  const totalBudget = budgetStatus?.summary?.totalBudget || 0;

  const cards = [
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      desc: `${currentMonthIncome.length} transactions this month`,
      icon: <IconWallet size={20} />,
      color: 'var(--green)',
      bgIcon: 'var(--green-light)',
    },
    {
      title: 'Budget Balance',
      value: formatCurrency(Math.max(0, remainingBudget)),
      desc: totalBudget > 0
        ? `${formatCurrency(remainingBudget)} remaining`
        : 'Set monthly targets for better planning',
      icon: <IconTarget size={20} />,
      color: remainingBudget < totalBudget * 0.15 ? 'var(--orange)' : 'var(--blue)',
      bgIcon: remainingBudget < totalBudget * 0.15 ? 'var(--orange-light)' : 'var(--blue-light)',
    },
    {
      title: 'Average Daily',
      value: formatCurrency(dailyAverage),
      desc: `Based on ${currentDay} days`,
      icon: <IconCalendar size={20} />,
      color: 'var(--orange)',
      bgIcon: 'var(--orange-light)',
    },
    {
      title: 'Primary Source',
      value: topSource !== 'N/A' ? topSource : 'None',
      desc: topSourceAmount > 0 ? `₹${topSourceAmount} this month` : 'No records yet',
      icon: <IconPin size={20} />,
      color: 'var(--blue)',
      bgIcon: 'var(--blue-light)',
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
