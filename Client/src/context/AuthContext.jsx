import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('accessToken');

      // ── If no token at all, stop immediately — don't call refresh ──
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Token exists — try to restore session
        const res = await api.post('/auth/refresh');
        localStorage.setItem('accessToken', res.data.accessToken);
        const me = await api.get('/auth/me');
        setUser(me.data);
      } catch {
        // Refresh failed — clear everything and stop
        localStorage.removeItem('accessToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []); // ← empty array = runs ONCE only on page load

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};