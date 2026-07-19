import { useState } from 'react';
import type { AppStore } from '../data/store';

interface Props {
  store: AppStore;
  onToast: (msg: string) => void;
}

export function Settings({ store, onToast }: Props) {
  const { profile, updateProfile, exportCSV, resetData } = store;
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Profile & Settings</h1>
          <p>Personalized user management and application configuration</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-section">
          <h3>User Information</h3>
          <div className="form-group">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  updateProfile({ avatar: String(reader.result) });
                  onToast('Avatar updated');
                };
                reader.readAsDataURL(file);
              }}
            />
          </div>
          <div className="form-group">
            <label>Currency</label>
            <select
              value={profile.currency}
              onChange={(e) => {
                updateProfile({ currency: e.target.value });
                onToast(`Currency set to ${e.target.value}`);
              }}
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              updateProfile({ name, email });
              onToast('Profile saved');
            }}
          >
            Save Profile
          </button>
        </div>

        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="setting-row">
            <span>Light Mode</span>
            <button
              type="button"
              className={`switch ${!profile.darkMode ? 'on' : ''}`}
              onClick={() => updateProfile({ darkMode: false })}
              aria-label="Light mode"
            />
          </div>
          <div className="setting-row">
            <span>Dark Mode</span>
            <button
              type="button"
              className={`switch ${profile.darkMode ? 'on' : ''}`}
              onClick={() => updateProfile({ darkMode: true })}
              aria-label="Dark mode"
            />
          </div>

          <h3 style={{ marginTop: 24 }}>Notifications</h3>
          <div className="setting-row">
            <span>Budget alerts</span>
            <button
              type="button"
              className={`switch ${profile.notifications.budgetAlerts ? 'on' : ''}`}
              onClick={() =>
                updateProfile({
                  notifications: {
                    ...profile.notifications,
                    budgetAlerts: !profile.notifications.budgetAlerts,
                  },
                })
              }
              aria-label="Budget alerts"
            />
          </div>
          <div className="setting-row">
            <span>Expense reminders</span>
            <button
              type="button"
              className={`switch ${profile.notifications.expenseReminders ? 'on' : ''}`}
              onClick={() =>
                updateProfile({
                  notifications: {
                    ...profile.notifications,
                    expenseReminders: !profile.notifications.expenseReminders,
                  },
                })
              }
              aria-label="Expense reminders"
            />
          </div>
          <div className="setting-row">
            <span>Income reminders</span>
            <button
              type="button"
              className={`switch ${profile.notifications.incomeReminders ? 'on' : ''}`}
              onClick={() =>
                updateProfile({
                  notifications: {
                    ...profile.notifications,
                    incomeReminders: !profile.notifications.incomeReminders,
                  },
                })
              }
              aria-label="Income reminders"
            />
          </div>
        </div>

        <div className="settings-section" style={{ gridColumn: '1 / -1' }}>
          <h3>Data Management</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                exportCSV();
                onToast('Data exported as CSV');
              }}
            >
              Export Data
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                const raw = localStorage.getItem('expense-meter-v1');
                if (!raw) return;
                const blob = new Blob([raw], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `expense-meter-backup-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                onToast('Backup downloaded');
              }}
            >
              Backup Data
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                resetData();
                onToast('Data reset to demo seed');
              }}
            >
              Reset Demo Data
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                if (
                  confirm(
                    'Delete all local data and reset the app? This cannot be undone on this device.'
                  )
                ) {
                  localStorage.removeItem('expense-meter-v1');
                  localStorage.removeItem('expense-meter-v2');
                  resetData();
                  onToast('Account data cleared');
                }
              }}
            >
              Delete Account Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
