import { callbackApi, loginApi, logoutApi, refreshTokenApi } from '@/services/api.service';
import { configureInterceptorResponse } from '@/shared/utils/axios-instance';
import { generatePKCE, generateRandomString } from '@/shared/utils/security-utils';
import { addToast } from '@heroui/react';
import { jwtDecode } from 'jwt-decode';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from './Auth.types';

export function useAuthLogic() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkLogin();

    // Se inicia el interceptor de axios para las respuestas, pasándole la lógica para el refresh token
    configureInterceptorResponse({
      refreshToken,
      clearJwt,
    });
  }, []);

  // Verificación inicial de si existe un token JWT
  const checkLogin = () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        const user: User = jwtDecode(accessToken);
        setUser(user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log('Error al validar la sesión ', error);
      localStorage.removeItem('accessToken');
      setUser(null);
      navigate('/');
      addToast({
        title: 'ERROR',
        description: 'No se pudo validar su sesión.',
        severity: 'danger',
        color: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener URL login
  const login = async () => {
    try {
      setIsLoading(true);

      // Generar PKCE y state
      const { code_verifier, code_challenge } = await generatePKCE();
      const state = generateRandomString();

      // Almacenar code verifier y state en sessionStorage
      sessionStorage.setItem('state', state);
      sessionStorage.setItem('code_verifier', code_verifier);

      // Obtener URL completa de autenticación en Discord
      const url: string = (await loginApi()).data.url;
      let finalUrl: string =
        url + `&state=${state}&code_challenge=${code_challenge}&code_challenge_method=S256`;

      // Redirección a la URL
      window.location.href = finalUrl;
    } catch (error) {
      console.error('Error al obtener la URL de login', error);
      addToast({
        title: 'ERROR',
        description: 'No se pudo obtener la URL de autorización de Discord.',
        severity: 'danger',
        color: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const callback = useCallback(async (code: string, state: string) => {
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
      const { accessToken } = (await callbackApi(formData)).data;
      setUser(jwtDecode(accessToken));
      localStorage.setItem('accessToken', accessToken);

      // Limpiar storage
      sessionStorage.removeItem('state');
      sessionStorage.removeItem('code_verifier');

      navigate('/dashboard/sonidos');
    } catch (error) {
      console.error('Error en callback: ', error);
      addToast({
        title: 'ERROR',
        description: 'Ocurrió un error en el proceso de login, inténtelo de nuevo.',
        severity: 'danger',
        color: 'danger',
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh token
  const refreshToken = async () => {
    try {
      setIsLoading(true);
      const { accessToken } = (await refreshTokenApi()).data;
      setUser(jwtDecode(accessToken));
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    } catch (error) {
      console.error(`Error en refreshToken ${error}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setIsLoading(true);
      clearJwt();
      await logoutApi();
      addToast({
        title: 'OK',
        description: 'Sesión cerrada correctamente.',
        severity: 'success',
        color: 'success',
      });
    } catch (error) {
      console.error('Error en logout:', error);
      addToast({
        title: 'AVISO',
        description: 'La sesión no se cerró correctamente en el servidor.',
        severity: 'warning',
        color: 'warning',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Limpia de forma local el estado de la sesión y redirige al login
  const clearJwt = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/');
  };

  return {
    user,
    isAuthenticated: !!user, // Boolean para saber si hay un usuario activo
    isLoading,
    login,
    callback,
    logout,
  };
}
