import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
          <h2 className="dl-title">Welcome back</h2>
          <p className="dl-subtitle">Sign in to your account</p>

          {error && <div className="dl-error">{error}</div>}

          <form onSubmit={handleSubmit}>
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
                placeholder="••••••••"
                required
              />
            </div>

            <button className="dl-btn-primary" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="dl-footer">
            Don't have an account? <Link to="/register" className="dl-link">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}