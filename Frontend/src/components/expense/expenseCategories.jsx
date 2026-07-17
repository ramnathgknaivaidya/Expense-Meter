import React from 'react';

const CATEGORY_INFO = [
  { category: 'Food', icon: '🍔', desc: 'Restaurants, dining out, groceries, delivery, and snacks.' },
  { category: 'Transport', icon: '🚗', desc: 'Fuel refills, cabs, ride-hailing services, and transit passes.' },
  { category: 'Housing', icon: '🏠', desc: 'Rent fees, property tax, maintenance fees, and home utility fixes.' },
  { category: 'Bills', icon: '💡', desc: 'Electricity, fiber broadband, mobile bills, and software subscriptions.' },
  { category: 'Shopping', icon: '🛍️', desc: 'Clothing, shoes, gadgets, and personal care accessories.' },
  { category: 'Healthcare', icon: '🏥', desc: 'Medicine, health checkups, clinics, dental, and medical insurance.' },
  { category: 'Education', icon: '🎓', desc: 'Online coding courses, university books, and learning resources.' },
  { category: 'Entertainment', icon: '🍿', desc: 'Movie tickets, games, console credits, events, and parties.' },
  { category: 'Travel', icon: '✈️', desc: 'Flights, train booking, hotel lodging, trips, and vacations.' },
  { category: 'Other', icon: '💸', desc: 'Miscellaneous expenses, emergency fees, or cash withdrawals.' }
];

export default function ExpenseCategories() {
  return (
    <section className="card" style={{ padding: '24px' }}>
      <div className="card-header" style={{ padding: 0 }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Expense Classifications</h3>
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        We automatically sort your transactions into these primary spending groups for detailed analytics:
      </p>

      <div className="category-grid">
        {CATEGORY_INFO.map((c, index) => (
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
