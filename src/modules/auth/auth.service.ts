import CONFIG from '../../config/env.config';
import { getTokenDiscord, getUsuarioDiscord } from '../../integrations/discord/discord-client.api';
import { createTokenJwt } from '../../shared/utils/token/token.utils';
import { JwtPayloadData } from '../../shared/utils/token/types/token.types';
import {
  createSession,
  deleteSession,
  rotateRefreshToken,
  verifyRefreshToken,
} from '../session/session.service';
import { UpsertUserData } from '../user/types/user.types';
import { upsertUser } from '../user/user.service';
import { ResponseTokensDto } from './types/auth.dto';
import { RefreshTokenCookieData } from './types/auth.types';

const { NODE_ENV, DISCORD_URL_AUTH, DISCORD_OAUTH2_CLIENT_ID, DISCORD_OAUTH2_REDIRECT_URI } =
  CONFIG;

// Paso 1 - Devuelve la URL para iniciar el flujo de login en Discord
export function getUrlAuthDiscord(): string {
  return (
    `${DISCORD_URL_AUTH}` +
    `?client_id=${DISCORD_OAUTH2_CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(DISCORD_OAUTH2_REDIRECT_URI)}` +
    `&scope=identify`
  );
}

// API callback para el proceso de login
export async function callback(
  code: string,
  codeVerifier: string,
  clientIp: string,
  clientUserAgent: string
): Promise<ResponseTokensDto> {
  // Paso 5 - Intercambia el código de autorización por un token de acceso
  const tokenDiscordResponse = await getTokenDiscord(code, codeVerifier);
  const expireToken = new Date(Date.now() + tokenDiscordResponse.expires_in * 1000);

  // Paso 6 - Obtiene la información del usuario de Discord usando el token de acceso
  const userDiscordResponse = await getUsuarioDiscord(tokenDiscordResponse.access_token);

  // Paso 7 - Actualiza/crea el usuario en la base de datos
  const upsertUserData: UpsertUserData = {
    id: userDiscordResponse.id,
    username: userDiscordResponse.username,
    avatarHash: userDiscordResponse.avatar,
    accessTokenDiscord: tokenDiscordResponse.access_token,
    refreshTokenDiscord: tokenDiscordResponse.refresh_token,
    accessTokenDiscordExpire: expireToken,
  };

  const userDto = await upsertUser(upsertUserData);

  // Paso 7.1 - Generar token JWT y cookie con el refresh token
  const sesionCreated = await createSession(userDto.id, clientIp, clientUserAgent);

  const jwtPayloadData: JwtPayloadData = {
    idUsuario: userDto.id,
    username: userDto.username,
    avatar: userDto.avatarHash,
    idSesion: sesionCreated.id,
  };

  const responseTokensDto: ResponseTokensDto = {
    accessToken: createTokenJwt(jwtPayloadData),
    refreshTokenCookie: {
      name: 'refreshToken',
      value: sesionCreated.refreshToken,
      options: {
        httpOnly: true,
        secure: NODE_ENV === 'pro', // Solo HTTPS en producción
        expires: sesionCreated.fechaExpiracion,
        sameSite: 'none',
        path: '/auth',
      },
    },
  };

  return responseTokensDto;
}

// Renovar access token
export async function getRefreshToken(
  refreshToken: string,
  clientIp: string,
  clientUserAgent: string
): Promise<ResponseTokensDto> {
  // Validar refresh token
  await verifyRefreshToken(refreshToken);

  // Actualizar refresh token del usuario
  const rotateRefreshTokenDto = await rotateRefreshToken(refreshToken, clientIp, clientUserAgent);
  const { userDto } = rotateRefreshTokenDto;

  // Montar respuesta
  const jwtPayloadData: JwtPayloadData = {
    idUsuario: userDto.id,
    username: userDto.username,
    avatar: userDto.avatarHash,
    idSesion: rotateRefreshTokenDto.idSesion,
  };

  const responseTokens: ResponseTokensDto = {
    accessToken: createTokenJwt(jwtPayloadData),
    refreshTokenCookie: {
      name: 'refreshToken',
      value: rotateRefreshTokenDto.refreshToken,
      options: {
        httpOnly: true,
        secure: NODE_ENV === 'pro', // Solo se envía a través de HTTPS en producción
        expires: rotateRefreshTokenDto.fechaExpiracion,
        sameSite: 'none',
        path: '/auth',
      },
    },
  };

  return responseTokens;
}

// Logout del usuario
export async function logout(refreshToken: string): Promise<RefreshTokenCookieData> {
  // Verificar el refresh token
  await verifyRefreshToken(refreshToken);

  // Eliminar el registro del refresh token de la base de datos
  await deleteSession(refreshToken);

  // Expirar la cookie del refresh token
  const refreshTokenCookieData: RefreshTokenCookieData = {
    name: 'refreshToken',
    value: '',
    options: {
      httpOnly: true,
      secure: NODE_ENV === 'pro',
      expires: new Date(Date.now()),
      sameSite: 'none',
      path: '/auth',
    },
  };

  return refreshTokenCookieData;
}
