import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', icon: '📊', label: 'Dashboard' },
    { to: '/income', icon: '💰', label: 'Income' },
    { to: '/expense', icon: '💳', label: 'Expenses' },
    { to: '/transactions', icon: '🔄', label: 'Transactions' },
    { to: '/analytics', icon: '📈', label: 'Analytics' },
    { to: '/budget', icon: '🎯', label: 'Budget' },
    { to: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <>
      <button className="mobile-toggle" onClick={() => setOpen(!open)} style={{ position: 'fixed', top: 16, left: 16, zIndex: 200 }}>
        {open ? '✕' : '☰'}
      </button>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <h1>Expense <span>Meter</span></h1>
          <small>Premium Finance Tracker</small>
        </div>
        <nav className="sidebar-nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setOpen(false)}>
              <span className="nav-icon">{l.icon}</span> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-email">{user?.email || ''}</div>
            </div>
          </div>
        </div>
      </aside>
      {open && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} />}
    </>
  );
}
