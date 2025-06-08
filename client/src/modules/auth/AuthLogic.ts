import { exchangeCodeApi, getUrlLogin } from '@/services/api.service';
import { generatePKCE, generateRandomString } from '@/shared/utils/security-utils';
import { jwtDecode } from 'jwt-decode';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from './Auth.types';

export const useAuthLogic = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  // Verificación inicial de autenticación
  useEffect(() => {
    // console.log(import.meta.env.VITE_API_URL);
    // checkAuthStatus();
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

  // Obtener URL login
  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Generar PKCE y state
      const { code_verifier, code_challenge } = await generatePKCE();
      const state = generateRandomString();

      // Almacenar code verifier y state en sessionStorage
      sessionStorage.setItem('state', state);
      sessionStorage.setItem('code_verifier', code_verifier);

      // Obtener URL completa de autenticación en Discord
      const url: string = (await getUrlLogin()).data.url;
      let finalUrl: string =
        url + `&state=${state}&code_challenge=${code_challenge}&code_challenge_method=S256`;

      // Redirección a la URL
      window.location.href = finalUrl;
    } catch (error) {
      setError('Error en el proceso de login');
      console.error('Error al obtener la URL de login', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exchangeCode = useCallback(async (code: string, state: string) => {
    try {
      setIsLoading(true);

      // Verificar state almacenado
      const storedState = sessionStorage.getItem('state');
      if (state !== storedState) {
        throw new Error('Estado no válido');
      }

      // Obtener code_verifier
      const code_verifier = sessionStorage.getItem('code_verifier');
      if (!code_verifier) {
        throw new Error('Code verifier no encontrado');
      }

      // Intercambiar code
      const formData = new URLSearchParams();
      formData.append('code', code);
      formData.append('code_verifier', code_verifier);

      // Realizar la petición POST
      const { accessToken } = (await exchangeCodeApi(formData)).data;
      localStorage.setItem('accessToken', accessToken);
      setUser(jwtDecode(accessToken));

      // Limpiar storage
      sessionStorage.removeItem('state');
      sessionStorage.removeItem('code_verifier');

      navigate('/dashboard/sonidos');
    } catch (error) {
      navigate('/');
      console.error('Error en exchange:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = async () => {
    // try {
    //   setIsLoading(true);
    //   await fetch('/api/auth/logout', { method: 'POST' });
    //   setUser(null);
    // } catch (error) {
    //   console.error('Error en logout:', error);
    //   throw error;
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    exchangeCode,
    logout,
  };
};
