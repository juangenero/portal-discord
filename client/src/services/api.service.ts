import { api, apiAuth } from '@/shared/utils/axios-instance';

// AUTH

export async function loginApi() {
  return await apiAuth.get(`/login`);
}

export async function callbackApi(formData: URLSearchParams) {
  return await apiAuth.post(`/callback`, formData);
}

export async function refreshTokenApi() {
  return await apiAuth.put('/refresh-token');
}

export async function logoutApi() {
  return await apiAuth.delete(`/logout`);
}

// SESIONES

export async function getSessionsApi() {
  return await api.get(`/sesion`);
}

export async function deleteSessionApi(idSession: string) {
  return await api.delete(`/sesion/${idSession}`);
}

// TEST
export async function infoDeviceTest() {
  return await api.get(`/test/info-device`);
}

export async function rutaProtegidaTest() {
  return await api.get(`/test/ruta-protegida`);
}

// ------------ SONIDO ------------
export async function addSonidoApi(formData: any) {
  return await api.post(`/sonido/create`, formData);
}

export async function getSonidosApi() {
  return await api.get(`/sonido`);
}

export async function playSonidoApi(id: any) {
  return await api.get(`/sonido/play/${id}`);
}

export async function downloadSonidoApi(id: any) {
  return await api.get(`/sonido/download/${id}`, {
    responseType: 'arraybuffer',
  });
}
