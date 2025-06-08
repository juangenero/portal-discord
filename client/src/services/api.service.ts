import axios from 'axios';

export async function getUrlLogin() {
  return await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`);
}

export async function exchangeCodeApi(formData: URLSearchParams) {
  return await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/callback`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}
