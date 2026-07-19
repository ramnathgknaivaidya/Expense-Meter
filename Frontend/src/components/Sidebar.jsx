import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { 
      to: '/', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      ), 
      label: 'Dashboard' 
    },
    { 
      to: '/income', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ), 
      label: 'Income' 
    },
    { 
      to: '/expense', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
      ), 
      label: 'Expenses' 
    },
    { 
      to: '/transactions', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
      ), 
      label: 'Transactions' 
    },
    { 
      to: '/analytics', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"></path>
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
        </svg>
      ), 
      label: 'Analytics' 
    },
    { 
      to: '/budget', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>
      ), 
      label: 'Budget' 
    },
    { 
      to: '/profile', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ), 
      label: 'Profile' 
    },
  ];

  return (
    <>
      <button className="mobile-toggle" onClick={() => setOpen(!open)} style={{ position: 'fixed', top: 16, left: 16, zIndex: 200 }}>
        {open ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>}
      </button>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <button 
          className="desktop-toggle" 
          onClick={() => setCollapsed(!collapsed)} 
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          )}
        </button>

        <div className="sidebar-brand">
          {collapsed ? (
            <h1 className="mini-logo">E<span>M</span></h1>
          ) : (
            <>
              <h1>Expense <span>Meter</span></h1>
              <small>Premium Finance Tracker</small>
            </>
          )}
        </div>
        <nav className="sidebar-nav">
          {links.map((l) => (
            <NavLink 
              key={l.to} 
              to={l.to} 
              end={l.to === '/'} 
              className={({ isActive }) => isActive ? 'active' : ''} 
              onClick={() => setOpen(false)}
              title={collapsed ? l.label : undefined}
            >
              <span className="nav-icon">{l.icon}</span>
              {!collapsed && <span className="nav-label">{l.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info" style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <div className="avatar" title={collapsed ? (user?.name || 'User') : undefined}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="user-name">{user?.name || 'User'}</div>
                <div className="user-email">{user?.email || ''}</div>
              </div>
            )}
          </div>
        </div>
      </aside>
      {open && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} />}
    </>
  );
}
