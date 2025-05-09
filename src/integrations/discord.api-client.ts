import axios, { AxiosHeaders } from 'axios';
import CONFIG from '../config/env.config';
import { TokenDiscordResponse, UsuarioDiscord } from '../modules/auth/auth.dto';
import { DiscordAPIError } from '../shared/errors';

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

// Obtener la URL (parcial) de autorización de Discord
export function getUrlAuthDiscord(): string {
  const result =
    `${urlAuth}` +
    `?client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=identify`;

  return result;
}

// Obtener el token de acceso de Discord
export async function getTokenDiscord(
  code: string,
  codeVerifier: string
): Promise<TokenDiscordResponse> {
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

  try {
    const response = await axios.post<TokenDiscordResponse>(urlToken, params, { headers });
    return response.data;
  } catch (error) {
    throw new DiscordAPIError();
  }
}

// Obtener el usuario de Discord
export async function getUsuarioDiscord(accessToken: string): Promise<UsuarioDiscord> {
  const headers = new AxiosHeaders({
    Authorization: `Bearer ${accessToken}`,
  });

  try {
    const response = await axios.get(urlUser, { headers });
    return response.data;
  } catch (error) {
    throw new DiscordAPIError();
  }
}

// Obtener URL del avatar del usuario
export function getAvatarUrl(usuarioId: string, avatarHash: string): string {
  const result: string = `${avatarUrl}${usuarioId}/${avatarHash}.png`;

  return result;
}
