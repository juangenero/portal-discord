import { refreshTokenApi } from '@/services/api.service';
import axios from 'axios';

// Tipo para el array de promesas "pausadas"
type PausedPromise = {
  resolve: (value?: string | null) => void;
  reject: (reason?: any) => void;
};

// Instancia de axios para los endpoint de authenticación de la API
export const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1/auth',
  withCredentials: true,
});

/**
 * Puntos que cubre la instancia "api"
 *
 * 1. El token JWT se añade a la cabecera "Authorization"
 * 2. Cuando se recibe un 401 en una solicitud (que no sea la de refresco) se intenta refrescar
 * 3. Mientras se está intentando refrescar el token, se encolan las solicitudes que se realicen
 * 4. Si se refresca el token se reintenta la solicitud original y las encoladas
 * 5. Si no se puede refrescar el token se rechaza la solicitud original y las encoladas
 */

// Instancia de axios para los endpoints protegidos de la API
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
  withCredentials: true,
});

let isRefreshingToken = false; // Controlar si hay una petición de refresh token en curso
let failedQueue: Array<PausedPromise> = []; // Almacenar las solicitudes fallidas mientras se refresca el token

// Cola para procesar las peticiones con 401 mientras se refresca el token
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Añadir token JWT a la cabecera de todas las peticiones
api.interceptors.request.use(
  (req) => {
    const jwtToken = localStorage.getItem('accessToken');
    if (jwtToken) {
      req.headers.Authorization = `Bearer ${jwtToken}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Cuando alguna solicitud devuelva 401, llamar al endpoint de callback (refresh token)
export const axiosInterceptorResponse = (
  setState: React.Dispatch<React.SetStateAction<string>>
) => {
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      console.log('Instancia de Axios - Solicitud inicial con error -> ', originalRequest);

      // Si el error es 401 y no es la solicitud de refresh token en sí
      if (error.response.status === 401 && originalRequest.url !== '/auth/refresh-token') {
        console.log('Instancia de Axios -> El error es 401 y no fué en /auth/refresh-token');
        // Añadir solicitud a la cola, si ya estábamos refrescando el token
        if (isRefreshingToken) {
          console.log(
            'Instancia de Axios -> El token ya se está refrescando, pausando solicitud inicial'
          );
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              console.log(
                'Instancia de Axios -> Reintenando solicitudes pausadas con el token ',
                token
              );
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => {
              console.log(
                'Instancia de Axios -> Rechazando solicitudes pausadas, no se pudo refrescar el token ',
                err
              );
              return Promise.reject(err);
            });
        }

        isRefreshingToken = true; // Indicar que el proceso de refresco ha comenzado

        // Realiza la solicitud de refresh token
        return new Promise(async (resolve, reject) => {
          // Intentar obtener el nuevo token
          try {
            const { accessToken: newAccessToken } = (await refreshTokenApi()).data;
            localStorage.setItem('accessToken', newAccessToken);
            setState(newAccessToken);
            // TODO - Falta mecanismo para actualizar estado User de React

            // Reintentar la solicitud original con el nuevo token
            console.log('Instancia de Axios -> Reintentando solicitud original ', originalRequest);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(api(originalRequest));

            // Reintentar las solicitudes en cola (pausadas) con el nuevo token
            console.log('Instancia de Axios -> Reintenando solicitudes pausadas');
            processQueue(null, newAccessToken);
          } catch (refreshError) {
            // Si la obtención del nuevo token falla
            console.log('Instancia de Axios - Fallo en refresh token -> ', refreshError);
            localStorage.clear();
            // TODO - Falta mecanismo para actualizar estado User de React
            window.location.href = '/';

            // Rechaza las solicitud inicial y las que se pausaron
            reject(refreshError);
            processQueue(refreshError);
          } finally {
            isRefreshingToken = false;
          }
        });
      }

      // Devuelve cualquier otro error no manejado a la solicitud inicial
      console.log(`Axios instance - Error no manejado -> ${error}`);
      return Promise.reject(error);
    }
  );
};

export default api;
