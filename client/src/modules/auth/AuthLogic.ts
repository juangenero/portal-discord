import { getUrlLogin } from '@/services/api.service';
import { useEffect, useState } from 'react';
import { User } from './Auth.types';

export const useAuthLogic = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificación inicial de autenticación
  useEffect(() => {
    // console.log(import.meta.env.VITE_API_URL);
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/me');
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      // console.error('Error al verificar autenticación:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await getUrlLogin();
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
  };
};
