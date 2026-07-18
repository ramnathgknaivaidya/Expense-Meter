import React from 'react';

const SOURCE_INFO = [
  { category: 'Salary', icon: '💼', desc: 'Regular payroll deposits from your employer or primary job.' },
  { category: 'Freelance', icon: '🧑‍💻', desc: 'Payments from gig work, contracts, or client projects.' },
  { category: 'Business', icon: '🏢', desc: 'Revenue from side ventures, product sales, or consulting services.' },
  { category: 'Investment', icon: '📈', desc: 'Dividends, stock returns, mutual fund payouts, and passive gains.' },
  { category: 'Bonus', icon: '🎁', desc: 'One-time incentive payouts and performance-based rewards.' },
  { category: 'Rental', icon: '🏘️', desc: 'Income from property rentals, leases, or sublets.' },
  { category: 'Other', icon: '✨', desc: 'Miscellaneous income that does not fit the standard categories.' },
];

export default function IncomeCategories() {
  return (
    <section className="card" style={{ padding: '24px' }}>
      <div className="card-header" style={{ padding: 0 }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Income Source Guide</h3>
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Choose the source that best describes the entry you are logging for richer reporting and cleaner analytics.
      </p>

      <div className="category-grid">
        {SOURCE_INFO.map((c, index) => (
          <div key={index} className="category-info-card">
            <div className="category-info-icon">{c.icon}</div>
            <div className="category-info-details">
              <h4>{c.category}</h4>
              <p>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
