import axios, { AxiosHeaders } from 'axios';
import CONFIG from '../../../config/env.config';
import { DiscordApiError } from '../../../shared/errors/error-factory';
import { ResponseTokenDiscordData, ResponseUserDiscordData } from './discord.types';

const {
  // URL API Discord
  DISCORD_URL_TOKEN: urlToken,
  DISCORD_URL_REVOKE_TOKEN: urlRevokeToken,
  DISCORD_URL_USER: urlUser,

  // URL OAuth2 Discord
  DISCORD_OAUTH2_CLIENT_ID: clientId,
  DISCORD_OAUTH2_CLIENT_SECRET: clientSecret,
  DISCORD_OAUTH2_REDIRECT_URI: redirectUri,

  // Utilidad Discord
  DISCORD_URL_AVATAR,
} = CONFIG;

// Obtener el token de acceso de Discord
export async function getTokenDiscord(
  code: string,
  codeVerifier: string
): Promise<ResponseTokenDiscordData> {
  try {
    const params = new URLSearchParams({
      code: code,
      code_verifier: codeVerifier,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const headers = new AxiosHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const response = await axios.post<ResponseTokenDiscordData>(urlToken, params, { headers });
    return response.data;
  } catch (error: any) {
    throw new DiscordApiError(
      `Error al obtener el token de discord. ${
        error.response.data ? JSON.stringify(error.response.data) : undefined
      } `
    );
  }
}

// Obtener el usuario de Discord
export async function getUsuarioDiscord(accessToken: string): Promise<ResponseUserDiscordData> {
  try {
    const headers = new AxiosHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    const response = await axios.get(urlUser, { headers });
    return response.data;
  } catch (error: any) {
    throw new DiscordApiError(
      `Error al obtener el usuario de discord. ${
        error.response.data ? JSON.stringify(error.response.data) : undefined
      }`
    );
  }
}

// Obtener URL del avatar del usuario
export function getAvatarUrl(usuarioId: string, avatarHash: string): string {
  return `${DISCORD_URL_AVATAR}${usuarioId}/${avatarHash}.png`;
}
