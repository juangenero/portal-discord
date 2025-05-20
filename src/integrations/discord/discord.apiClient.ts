import axios, { AxiosHeaders } from 'axios';
import CONFIG from '../../config/env.config';
import { DiscordError } from '../../shared/errors/DiscordError';
import { TokenDiscordResponse, UserDiscordResponse } from './discord.dto';

const {
  // URL API Discord
  DISCORD_URL_AUTH: urlAuth,
  DISCORD_URL_TOKEN: urlToken,
  DISCORD_URL_REVOKE_TOKEN: urlRevokeToken,
  DISCORD_URL_USER: urlUser,

  // URL OAuth2 Discord
  DISCORD_OAUTH2_CLIENT_ID: clientId,
  DISCORD_OAUTH2_CLIENT_SECRET: clientSecret,
  DISCORD_OAUTH2_REDIRECT_URI: redirectUri,

  // Utilidad Discord
  DISCORD_URL_AVATAR: avatarUrl,
} = CONFIG;

// Obtener la URL básica de autorización de Discord
export function getUrlAuthDiscord(): string {
  return (
    `${urlAuth}` +
    `?client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=identify`
  );
}

// Obtener el token de acceso de Discord
export async function getTokenDiscord(
  code: string,
  codeVerifier: string
): Promise<TokenDiscordResponse> {
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

    const response = await axios.post<TokenDiscordResponse>(urlToken, params, { headers });
    return response.data;
  } catch (error) {
    throw new DiscordError('Error al obtener el token de acceso');
  }
}

// Obtener el usuario de Discord
export async function getUsuarioDiscord(accessToken: string): Promise<UserDiscordResponse> {
  try {
    const headers = new AxiosHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    const response = await axios.get(urlUser, { headers });
    return response.data;
  } catch (error) {
    throw new DiscordError('Error al obtener el usuario de Discord');
  }
}

// Obtener URL del avatar del usuario
export function getAvatarUrl(usuarioId: string, avatarHash: string): string {
  return `${avatarUrl}${usuarioId}/${avatarHash}.png`;
}
