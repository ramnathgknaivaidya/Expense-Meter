import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light');
  const [currency, setCurrency] = useState(user?.currency || 'INR');
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [passwordMsg, setPasswordMsg] = useState('');

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwords.old || !passwords.new || !passwords.confirm) {
      setPasswordMsg('Please fill all fields');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setPasswordMsg('New passwords do not match');
      return;
    }
    if (passwords.new.length < 6) {
      setPasswordMsg('Password must be at least 6 characters');
      return;
    }
    // In a real app, call API here
    setPasswordMsg('Password updated successfully!');
    setPasswords({ old: '', new: '', confirm: '' });
    setTimeout(() => setPasswordMsg(''), 3000);
  };

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="page-body">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Profile & Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Manage your account preferences and security</p>
      </div>

      <div className="grid-2">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* User Info Card */}
          <div className="card" style={{ textAlign: 'center', padding: '32px 22px' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'var(--green)', color: '#fff', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
              fontWeight: 700, margin: '0 auto 14px',
            }}>
              {getInitials(user?.name)}
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 650, marginBottom: '4px' }}>{user?.name || 'User'}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>{user?.email || 'user@example.com'}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'var(--green-light)', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', color: 'var(--green)', fontWeight: 550 }}>
              💰 Currency: {currency}
            </div>
          </div>

          {/* Settings Section */}
          <div className="card">
            <div className="settings-section">
              <h3>Preferences</h3>

              {/* Currency */}
              <div className="settings-row">
                <div>
                  <div className="sr-label">Currency</div>
                  <div className="sr-desc">Display format for amounts</div>
                </div>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{ padding: '6px 12px', border: '1px solid var(--border-dark)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', fontSize: '0.82rem' }}
                >
                  <option value="INR">₹ INR</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                </select>
              </div>

              {/* Theme Toggle */}
              <div className="settings-row">
                <div>
                  <div className="sr-label">Theme</div>
                  <div className="sr-desc">Choose app appearance</div>
                </div>
                <div className="theme-toggle">
                  <button
                    className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('light')}
                  >
                    ☀️ Light
                  </button>
                  <button
                    className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    🌙 Dark
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Change Password */}
          <div className="card">
            <div className="settings-section" style={{ marginBottom: 0 }}>
              <h3>Change Password</h3>
              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={passwords.old}
                    onChange={(e) => setPasswords(p => ({ ...p, old: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={passwords.new}
                    onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  />
                </div>
                {passwordMsg && (
                  <div style={{
                    padding: '8px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '12px',
                    fontSize: '0.8rem', fontWeight: 500,
                    background: passwordMsg.includes('success') ? 'var(--green-light)' : 'var(--red-light)',
                    color: passwordMsg.includes('success') ? 'var(--green)' : 'var(--red)',
                  }}>
                    {passwordMsg}
                  </div>
                )}
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Update Password
                </button>
              </form>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card" style={{ borderColor: 'var(--red-light)' }}>
            <div className="settings-section" style={{ marginBottom: 0 }}>
              <h3 style={{ color: 'var(--red)' }}>Danger Zone</h3>

              <div className="settings-row">
                <div>
                  <div className="sr-label">Sign Out</div>
                  <div className="sr-desc">Log out of your account</div>
                </div>
                <button className="btn btn-sm btn-outline" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>

              <div className="settings-row">
                <div>
                  <div className="sr-label">Delete Account</div>
                  <div className="sr-desc">Permanently remove your data</div>
                </div>
                <button className="btn btn-sm btn-danger" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
