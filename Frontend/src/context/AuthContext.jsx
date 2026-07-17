import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

const DEMO_USER = { id: 'demo', name: 'Demo User', email: 'demo@expense.com', currency: 'INR' };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : DEMO_USER;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: loggedUser } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
    } catch (err) {
      console.error('Register error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const demoLogin = async () => {
    try {
      await login('demo@expense.com', 'password123');
    } catch (err) {
      console.warn('Backend offline, using local demo user mock mode');
      localStorage.setItem('token', 'mock_token_demo');
      localStorage.setItem('user', JSON.stringify(DEMO_USER));
      setUser(DEMO_USER);
    }
  };

  // Perform background login for demo user on load if token is not set
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && user?.email === 'demo@expense.com') {
      demoLogin();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
