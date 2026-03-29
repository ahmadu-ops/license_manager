import { createContext, useContext, useState } from 'react';
import api from '../hooks/useApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    toast.success(`Bienvenue, ${data.user.name} !`);
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch {
      // silencieux si déjà invalide
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Déconnecté.');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuth: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);