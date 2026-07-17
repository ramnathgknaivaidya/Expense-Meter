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
    { to: '/profile', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <>
      <button className="mobile-toggle" onClick={() => setOpen(!open)}>
        {open ? '✕' : '☰'}
      </button>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <h1>Expense<span>Meter</span></h1>
          <small>Finance Manager</small>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">MENU</div>
          {links.slice(0, 4).map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setOpen(false)}>
              <span className="nav-icon">{l.icon}</span>
              <span className="nav-label">{l.label}</span>
            </NavLink>
          ))}
          <div className="sidebar-section-label">INSIGHTS</div>
          {links.slice(4).map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setOpen(false)}>
              <span className="nav-icon">{l.icon}</span>
              <span className="nav-label">{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
            <div className="user-details">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-email">{user?.email || ''}</div>
            </div>
          </div>
        </div>
      </aside>
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
    </>
  );
}
