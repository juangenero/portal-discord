import { User } from '../../../prisma/client';
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

// Paso 1 Devuelve la URL para iniciar el flujo de login en Discord
export function initialize(): string {
  return getUrlAuthDiscord();
}

// API callback para el proceso de login
export async function login(code: string, codeVerifier: string): Promise<ResponseTokens> {
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

  // Paso 7.1 - Generar y enviar tokens al cliente
  const responseTokens: ResponseTokens = {
    accessToken: createTokenJwt(usuario),
    refreshToken: (await createSession(usuario.id)).refreshTokenHash,
  };

  return responseTokens;
}

// Renovar access token
export async function renewTokenJwt(idUser: string, refreshToken: string): Promise<ResponseTokens> {
  // Validar refresh token
  const tokenValido = verifyRefreshToken(refreshToken, idUser);

  if (!tokenValido) console.error('El token no es válido');

  // Actualizar refresh token del usuario
  const newRefreshToken: string = await rotateRefreshToken(idUser, refreshToken);

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
    accessToken: createTokenJwt(userDto),
    refreshToken: newRefreshToken,
  };

  return responseTokens;
}
