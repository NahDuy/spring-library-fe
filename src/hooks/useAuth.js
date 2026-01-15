import { useState, useCallback } from 'react';
import localStorageService from '../services/localStorageService';

const useAuth = () => {
  const [user, setUser] = useState(() => {
    const token = localStorageService.getToken();
    return token ? { authenticated: true } : null;
  });

  const login = useCallback((token, userData) => {
    localStorageService.saveToken(token);
    localStorageService.saveUser(userData);
    setUser({ ...userData, authenticated: true });
  }, []);

  const logout = useCallback(() => {
    localStorageService.removeToken();
    localStorageService.removeUser();
    setUser(null);
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!localStorageService.getToken();
  }, []);

  return { user, login, logout, isAuthenticated };
};

export default useAuth;
