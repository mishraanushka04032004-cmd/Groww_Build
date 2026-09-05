import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth.api.js';
import { apiClient } from '../../../lib/axios.js';
import { useGlobalLoader } from '../../../context/LoadingContext.jsx';
import { queryClient } from '../../../lib/queryClient.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { startLoading, stopLoading } = useGlobalLoader();

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  // Update Axios Authorization header and localStorage whenever accessToken changes
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem('accessToken');
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, [accessToken]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Silent refresh / session verification on startup
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await authApi.refresh();
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch {
      // If refresh failed and no existing valid token, reset
      const savedToken = localStorage.getItem('accessToken');
      if (!savedToken) {
        setUser(null);
        setAccessToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler (Sign In)
  const login = async ({ email, password }) => {
    startLoading('Signing In...');
    try {
      const data = await authApi.login({ email, password });
      setAccessToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setIsAuthModalOpen(false);
      return data;
    } finally {
      setTimeout(() => {
        stopLoading();
      }, 500);
    }
  };

  // Register handler (Creating New Account)
  const register = async ({ name, email, password }) => {
    startLoading('Creating Account...');
    try {
      const data = await authApi.register({ name, email, password });
      setAccessToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setIsAuthModalOpen(false);
      return data;
    } finally {
      setTimeout(() => {
        stopLoading();
      }, 500);
    }
  };

  // Logout handler (Sign Out)
  const logout = async () => {
    startLoading('Signing Out...');
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      delete apiClient.defaults.headers.common['Authorization'];
      // Clear ALL React Query cache so stale dashboard/acknowledge data
      // doesn't persist when a different user logs back in
      queryClient.clear();
      setTimeout(() => {
        stopLoading();
      }, 500);
    }
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        checkAuth,
        isAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
