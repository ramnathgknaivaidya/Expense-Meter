import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { formatCurrency, fetchExchangeRates } from '../utils/format';

const NOTIFICATIONS_KEY = 'notification_prefs';

const defaultNotifs = { budgetAlerts: true, expenseReminders: false, incomeReminders: false };

const loadNotifs = () => {
  try { return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY)) || defaultNotifs; } catch { return defaultNotifs; }
};

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || user?.currency || 'INR');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [notifications, setNotifications] = useState(loadNotifs);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const showToast = (type, message) => { setToast({ type, message }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => { localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications)); }, [notifications]);

  useEffect(() => { fetchExchangeRates(); }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/auth/profile', { name, email, currency });
      localStorage.setItem('currency', currency);
      showToast('success', 'Profile saved');
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem('avatar', reader.result);
      showToast('success', 'Avatar updated');
    };
    reader.readAsDataURL(file);
  };

  const handleExportCSV = () => {
    try {
      const raw = localStorage.getItem('token');
      if (!raw) { showToast('error', 'No data to export'); return; }
      const rows = [['Type', 'Category', 'Amount', 'Date', 'Payment Method', 'Description']];
      const stored = localStorage.getItem('transactions');
      if (stored) {
        JSON.parse(stored).forEach(tx => {
          rows.push([tx.type, tx.category, tx.amount, tx.date, tx.paymentMethod, tx.description]);
        });
      }
      const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `expense-meter-export-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
      URL.revokeObjectURL(url);
      showToast('success', 'Data exported as CSV');
    } catch { showToast('error', 'Export failed'); }
  };

  const handleBackup = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.startsWith('avatar')) data[key] = localStorage.getItem(key);
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `expense-meter-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Backup downloaded');
  };

  const handleResetData = () => {
    if (!window.confirm('Reset all data to demo seed? This will clear your local changes.')) return;
    localStorage.clear();
    showToast('success', 'Data reset. Refresh the page.');
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleDeleteAccount = () => {
    if (!window.confirm('Delete all account data? This cannot be undone.')) return;
    localStorage.clear();
    showToast('success', 'Account data cleared');
    setTimeout(() => { logout(); navigate('/login'); }, 1000);
  };

  const toggleNotif = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="page-body">
      {toast && <div className={`toast ${toast.type}`} style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999 }}>{toast.type === 'success' ? '✓' : '✕'} {toast.message}</div>}

      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Profile & Settings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Personalized user management and application configuration</p>
      </div>

      <div className="grid-2" style={{ gap: '24px' }}>
        {/* User Information */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>User Information</h3>
          <div className="form-group">
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ padding: '8px' }} />
          </div>
          <div className="form-group">
            <label>Currency</label>
            <select value={currency} onChange={e => { setCurrency(e.target.value); localStorage.setItem('currency', e.target.value); fetchExchangeRates(); showToast('success', `Currency set to ${e.target.value}`); }}>
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="CAD">CAD (C$)</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

        {/* Appearance & Notifications */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>Appearance</h3>
          <div className="theme-toggle" style={{ marginBottom: '24px' }}>
            <button className={`theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>☀️ Light Mode</button>
            <button className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>🌙 Dark Mode</button>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>Notifications</h3>
          {[
            { key: 'budgetAlerts', label: '🔔 Budget alerts', desc: 'Get notified when nearing budget limits' },
            { key: 'expenseReminders', label: '📊 Expense reminders', desc: 'Daily expense logging reminders' },
            { key: 'incomeReminders', label: '💰 Income reminders', desc: 'Reminders to log new income' },
          ].map(item => (
            <div key={item.key} className="settings-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
              </div>
              <button
                type="button"
                onClick={() => toggleNotif(item.key)}
                style={{
                  width: '44px', height: '24px', borderRadius: '24px', border: 'none', cursor: 'pointer', position: 'relative', transition: '0.3s',
                  background: notifications[item.key] ? 'var(--green)' : 'var(--border)',
                }}
                aria-label={item.label}
              >
                <span style={{
                  position: 'absolute', top: '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', transition: '0.3s',
                  left: notifications[item.key] ? '23px' : '3px',
                }} />
              </button>
            </div>
          ))}
        </div>

        {/* Data Management - full width */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>Data Management</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-outline" onClick={handleExportCSV}>📤 Export Data</button>
            <button className="btn btn-outline" onClick={handleBackup}>💾 Backup Data</button>
            <button className="btn btn-outline" onClick={handleResetData}>🔄 Reset Demo Data</button>
            <button className="btn btn-danger" onClick={handleDeleteAccount} style={{ background: 'var(--red)', color: '#fff', border: 'none' }}>🗑️ Delete Account Data</button>
          </div>
        </div>
      </div>
    </div>
  );
}
