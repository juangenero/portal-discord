import { User } from '../../../prisma/generated/client';
import CONFIG from '../../config/env.config';
import {
  getTokenDiscord,
  getUrlAuthDiscord,
  getUsuarioDiscord,
} from '../../integrations/discord/discord.apiClient';
import { TokenDiscordResponse, UserDiscordResponse } from '../../integrations/discord/discord.dto';
import { DatabaseError } from '../../shared/errors/DatabaseError';
import {
  createSession,
  createTokenJwt,
  rotateRefreshToken,
  verifyRefreshToken,
} from '../session/session.service';
import { UserDto } from '../user/user.dto';
import { getUserById } from '../user/user.model';
import { upsertUser } from '../user/user.service';
import { ResponseTokens } from './auth.dto';

const { NODE_ENV } = CONFIG;

// Paso 1 Devuelve la URL para iniciar el flujo de login en Discord
export function initialize(): string {
  return getUrlAuthDiscord();
}

// API callback para el proceso de login
export async function login(
  code: string,
  codeVerifier: string,
  clientIp: string,
  clientUserAgent: string
): Promise<ResponseTokens> {
  // Paso 5 - Intercambia el código de autorización por un token de acceso
  const resToken: TokenDiscordResponse = await getTokenDiscord(code, codeVerifier);
  const expireToken = new Date(Date.now() + resToken.expires_in * 1000);

  // Paso 6 - Obtiene la información del usuario de Discord usando el token de acceso
  const usuarioDiscord: UserDiscordResponse = await getUsuarioDiscord(resToken.access_token);

  // Paso 7 - Actualiza/crea el usuario en la base de datos
  const usuario: UserDto = await upsertUser({
    id: usuarioDiscord.id,
    username: usuarioDiscord.username,
    avatarHash: usuarioDiscord.avatar,
    accessTokenDiscord: resToken.access_token,
    refreshTokenDiscord: resToken.refresh_token,
    accessTokenDiscordExpire: expireToken,
  });

  // Paso 7.1 - Generar token JWT y cookie con el refresh token
  const sesionCreated = await createSession(usuario.id, clientIp, clientUserAgent);
  const responseTokens: ResponseTokens = {
    accessToken: createTokenJwt(usuario, sesionCreated.id),
    refreshTokenCookie: {
      name: 'refreshToken',
      value: sesionCreated.refreshToken,
      options: {
        httpOnly: true,
        secure: NODE_ENV === 'pro' ? true : false, // Solo se envía a través de HTTPS en producción
        expires: sesionCreated.fechaExpiracion,
        sameSite: 'none',
        path: '/auth',
      },
    },
  };

  return responseTokens;
}

// Renovar access token
export async function renewTokenJwt(
  idUser: string,
  refreshToken: string,
  clientIp: string,
  clientUserAgent: string
): Promise<ResponseTokens> {
  // Validar refresh token
  const tokenValido = verifyRefreshToken(refreshToken, idUser);

  if (!tokenValido) console.error('El token no es válido');

  // Actualizar refresh token del usuario
  const rotateRefreshTokenDto = await rotateRefreshToken(
    idUser,
    refreshToken,
    clientIp,
    clientUserAgent
  );

  // Obtener usuario de la BD
  const userBD: User | null = await getUserById(idUser);
  if (!userBD) throw new DatabaseError(`El usuario con id ${idUser} no existe`);

  // Convertir User a UserDto
  const userDto: UserDto = {
    id: userBD.id,
    username: userBD.username,
    avatarHash: userBD.avatarHash,
  };

  // Montar respuesta
  const responseTokens: ResponseTokens = {
    accessToken: createTokenJwt(userDto, rotateRefreshTokenDto.idSesion),
    refreshTokenCookie: {
      name: 'refreshToken',
      value: rotateRefreshTokenDto.refreshToken,
      options: {
        httpOnly: true,
        secure: NODE_ENV === 'pro' ? true : false, // Solo se envía a través de HTTPS en producción
        expires: rotateRefreshTokenDto.fechaExpiracion,
        sameSite: 'none',
        path: '/auth',
      },
    },
  };

  return responseTokens;
}
