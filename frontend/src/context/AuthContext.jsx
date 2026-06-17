import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('sm_token');
    const storedUser = localStorage.getItem('sm_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('sm_token', data.token);
    localStorage.setItem('sm_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('sm_token', data.token);
    localStorage.setItem('sm_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('sm_token');
    localStorage.removeItem('sm_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('sm_user', JSON.stringify(updatedUser));
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
