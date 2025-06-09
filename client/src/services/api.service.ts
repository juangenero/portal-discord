import axios from 'axios';

export async function loginApi() {
  return await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`);
}

export async function callbackApi(formData: URLSearchParams) {
  return await axios.post(`/api/v1/auth/callback`, formData, {
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function logoutApi() {
  return await axios.delete(`/api/v1/auth/logout`, {
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
  });
}
