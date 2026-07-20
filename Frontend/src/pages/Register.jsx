import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="dl-page">
      {/* Left branding panel */}
      <div className="dl-left-panel">
        <div className="dl-left-glow" />
        <div className="dl-left-content">
          <div className="dl-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
         <h1 className="dl-brand-title">Welcome to <span>Expense Meter</span></h1>
          <p className="dl-brand-desc">
            Track every expense with ease and take control of your finances
Monitor spending, manage budgets, and make smarter financial decisions.
          </p>
          <div className="dl-stats">
            <div className="dl-stat">
              <div className="dl-stat-value">10K+</div>
              <div className="dl-stat-label">Active Users</div>
            </div>
            <div className="dl-stat">
              <div className="dl-stat-value">99.9%</div>
              <div className="dl-stat-label">Acurecy</div>
            </div>
            <div className="dl-stat">
              <div className="dl-stat-value">150+</div>
              <div className="dl-stat-label">Features</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="dl-right-panel">
        <div className="dl-form-wrap">
          <h2 className="dl-title">Create account</h2>
          <p className="dl-subtitle">Start tracking your finances</p>

          {error && <div className="dl-error">{error}</div>}
          {success && (
            <div className="dl-error" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
              Account created! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="dl-form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="dl-form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="dl-form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </div>

            <button className="dl-btn-primary" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="dl-footer">
            Already have an account? <Link to="/login" className="dl-link">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}