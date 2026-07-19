import React from 'react';
import { IconFood, IconTransport, IconHousing, IconBills, IconShopping, IconHealthcare, IconEducation, IconEntertainment, IconTravel, IconFallback } from '../../utils/icons';

const CATEGORY_INFO = [
  { category: 'Food', icon: <IconFood size={14} />, desc: 'Restaurants, dining out, groceries, delivery, and snacks.' },
  { category: 'Transport', icon: <IconTransport size={14} />, desc: 'Fuel refills, cabs, ride-hailing services, and transit passes.' },
  { category: 'Housing', icon: <IconHousing size={14} />, desc: 'Rent fees, property tax, maintenance fees, and home utility fixes.' },
  { category: 'Bills', icon: <IconBills size={14} />, desc: 'Electricity, fiber broadband, mobile bills, and software subscriptions.' },
  { category: 'Shopping', icon: <IconShopping size={14} />, desc: 'Clothing, shoes, gadgets, and personal care accessories.' },
  { category: 'Healthcare', icon: <IconHealthcare size={14} />, desc: 'Medicine, health checkups, clinics, dental, and medical insurance.' },
  { category: 'Education', icon: <IconEducation size={14} />, desc: 'Online coding courses, university books, and learning resources.' },
  { category: 'Entertainment', icon: <IconEntertainment size={14} />, desc: 'Movie tickets, games, console credits, events, and parties.' },
  { category: 'Travel', icon: <IconTravel size={14} />, desc: 'Flights, train booking, hotel lodging, trips, and vacations.' },
  { category: 'Other', icon: <IconFallback size={14} />, desc: 'Miscellaneous expenses, emergency fees, or cash withdrawals.' }
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
