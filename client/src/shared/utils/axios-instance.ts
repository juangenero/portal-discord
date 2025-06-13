import { AuthContextType } from '@/modules/auth/AuthContext';
import axios from 'axios';

// Se recomienda exportar e importar esta instancia de axios en lugar de usar la default
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Tu base URL de la API
  headers: {
    'Content-Type': 'application/json', // O 'application/x-www-form-urlencoded' según tu backend
  },
  withCredentials: true, // Esto es importante si usas cookies para el refresh token
});

// Variable global para almacenar las funciones de auth del contexto
// Esta es la clave para que el interceptor pueda acceder a `refreshToken` y `logout`
let globalAuthService: AuthContextType | null = null;

// Función para inyectar el servicio de autenticación desde el AuthProvider
export const setGlobalAuthService = (service: AuthContextType) => {
  globalAuthService = service;
};

// 1. Añadir el token JWT a la cabecera "Authorization"
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Realizar el refresco del token cuando reciba un 401 (excepto en el propio endpoint de refresh)
// 3. Si recibe 401 en el refresco, redirige al login
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Asegurarse de que el servicio de autenticación esté disponible
    const authService = globalAuthService;
    if (!authService) {
      console.error(
        'Servicio de autenticación no disponible para el interceptor. Asegúrate de que AuthProvider envuelva la App.'
      );
      return Promise.reject(error);
    }

    // Comprobar si es un 401 y no es la petición de refresco en sí misma
    // Asume que tu endpoint de refresh token contiene '/api/auth/refresh'
    // ¡¡MUY IMPORTANTE!! Ajusta la condición de `!originalRequest.url?.includes('/api/auth/refresh')`
    // a la URL real de tu endpoint de refresco.
    if (
      error.response?.status === 401 &&
      originalRequest.url &&
      !originalRequest.url.includes('/api/auth/refresh')
    ) {
      try {
        console.log(
          '401 recibido en una petición a endpoint protegido. Intentando refrescar token...'
        );
        await authService.refreshToken(); // Intenta renovar el token

        // Si el refresco fue exitoso, reintenta la petición original con el nuevo token
        const newAccessToken = localStorage.getItem('accessToken');
        if (newAccessToken) {
          // Asegurarse de que se haya guardado el nuevo token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest); // Reintentar la petición original
        } else {
          // Esto no debería pasar si refreshToken fue exitoso
          throw new Error('Refresh token successful but no new access token found.');
        }
      } catch (refreshError: any) {
        // Si el refresco falla (ej. también devuelve 401 o cualquier otro error en el refresh endpoint)
        console.error('Error al intentar refrescar el token. Redirigiendo a login.', refreshError);
        authService.logout(); // Limpia el estado local y redirige al login
        return Promise.reject(refreshError); // Rechaza la petición original
      }
    }

    // Para cualquier otro error o si no es un 401 manejado
    return Promise.reject(error);
  }
);

export default api; // Exporta tu instancia de Axios configurada
