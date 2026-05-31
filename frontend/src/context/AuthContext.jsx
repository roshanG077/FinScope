import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('finscope_token'));
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapUser = () => {
      const savedUser = localStorage.getItem('finscope_user');
      const savedToken = localStorage.getItem('finscope_token');
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Sync API simulation state
        api.isSimulated = savedToken === 'simulated_jwt_token';
        setIsDemo(api.isSimulated);
      }
      setLoading(false);
    };
    bootstrapUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const userData = await api.login(email, password);
      localStorage.setItem('finscope_token', userData.token);
      localStorage.setItem('finscope_user', JSON.stringify(userData));
      setToken(userData.token);
      setUser(userData);
      setIsDemo(api.isSimulated);
      return userData;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone, currency) => {
    setLoading(true);
    try {
      return await api.register(name, email, password, phone, currency);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('finscope_token');
    localStorage.removeItem('finscope_user');
    setUser(null);
    setToken(null);
    setIsDemo(false);
  };

  const updateUserLocalState = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('finscope_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, isDemo, loading, login, register, logout, setIsDemo, updateUserLocalState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
