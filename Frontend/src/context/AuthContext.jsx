import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const DEMO_USER = { id: 'demo', name: 'Demo User', email: 'demo@expense.com', currency: 'INR' };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEMO_USER);
  const [loading] = useState(false);

  const login = async () => {};
  const register = async () => {};
  const logout = () => {};
  const demoLogin = () => setUser(DEMO_USER);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
