import axios from 'axios';

export async function getUrlLogin() {
  return await axios.get(`${import.meta.env.VITE_API_URL}/auth/login`);
}
