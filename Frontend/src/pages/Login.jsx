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
    <div className="auth-page">
      <div className="auth-card">
        <div className="card">
          <div className="auth-brand"><h1>Naivaidya</h1></div>
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your account</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>
          <div className="auth-footer">
            Don't have an account? <Link to="/register" className="auth-link">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
