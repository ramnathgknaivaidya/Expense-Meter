import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, incomeAPI, expenseAPI, transactionAPI } from '../api/client';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState(user?.currency || 'INR');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await authAPI.updateProfile({ name, currency });
      setUser(res.data.data);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) { setMessage('Password must be at least 6 characters'); return; }
    setLoading(true);
    setMessage('');
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      setMessage('Password changed successfully');
      setCurrentPassword(''); setNewPassword('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Password change failed');
    } finally { setLoading(false); }
  };

  const handleExport = async () => {
    try {
      const allData = [];
      const incRes = await incomeAPI.getAll({ limit: 10000 });
      const expRes = await expenseAPI.getAll({ limit: 10000 });
      const txRes = await transactionAPI.getAll({ limit: 10000 });
      allData.push('=== EXPENSE METER EXPORT ===');
      allData.push(`Exported: ${new Date().toISOString()}`);
      allData.push(`User: ${user?.name} (${user?.email})`);
      allData.push('');
      allData.push('--- INCOME ---');
      incRes.data.data.incomes?.forEach(i => allData.push(`${i.date},${i.source},${i.amount},${i.paymentMethod}`));
      allData.push('');
      allData.push('--- EXPENSES ---');
      expRes.data.data.expenses?.forEach(e => allData.push(`${e.date},${e.category},${e.amount},${e.merchant},${e.paymentMethod}`));
      allData.push('');
      allData.push('--- TRANSACTIONS ---');
      txRes.data.data.transactions?.forEach(t => allData.push(`${t.date},${t.type},${t.category},${t.amount},${t.paymentMethod}`));
      const blob = new Blob([allData.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `expense-meter-export-${Date.now()}.csv`; a.click();
      URL.revokeObjectURL(url);
      setMessage('Data exported successfully');
    } catch (err) { setMessage('Export failed'); }
  };

  return (
    <div>
      <div className="page-header"><h2>👤 Profile & Settings</h2></div>
      <div className="page-body">
        {message && <div className={`toast ${message.includes('fail') || message.includes('Error') ? 'error' : 'success'}`} style={{ position: 'static', marginBottom: 20, animation: 'none' }}>{message}</div>}

        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
            <div className="avatar" style={{ width: 60, height: 60, fontSize: '1.5rem' }}>{user?.name?.charAt(0) || 'U'}</div>
            <div>
              <h3 style={{ margin: 0 }}>{user?.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user?.email}</p>
            </div>
          </div>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>

        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="card">
            <div className="settings-section">
              <h3>Appearance</h3>
              <div className="theme-toggle">
                <button className={`theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>☀️ Light</button>
                <button className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>🌙 Dark</button>
              </div>
            </div>
            <div className="settings-section">
              <h3>Notifications</h3>
              <div className="settings-row">
                <div><div className="sr-label">Budget Alerts</div><div className="sr-desc">Get notified when nearing budget limits</div></div>
                <span style={{ color: 'var(--green)', fontSize: '0.9rem' }}>✅ Enabled</span>
              </div>
              <div className="settings-row">
                <div><div className="sr-label">Expense Reminders</div><div className="sr-desc">Reminders for recurring expenses</div></div>
                <span style={{ color: 'var(--green)', fontSize: '0.9rem' }}>✅ Enabled</span>
              </div>
              <div className="settings-row">
                <div><div className="sr-label">Income Reminders</div><div className="sr-desc">Expected income notifications</div></div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>⏸️ Paused</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="settings-section">
              <h3>Change Password</h3>
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} required />
                </div>
                <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</button>
              </form>
            </div>
            <div className="settings-section" style={{ marginTop: 24 }}>
              <h3>Data Management</h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn btn-outline" onClick={handleExport}>📥 Export Data</button>
                <button className="btn btn-outline" onClick={() => setMessage('Backup feature coming soon')}>💾 Backup Data</button>
                <button className="btn btn-danger" onClick={() => { if (confirm('This will delete your account and all data. Continue?')) setMessage('Account deletion is not yet available in this demo.'); }}>🗑️ Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
