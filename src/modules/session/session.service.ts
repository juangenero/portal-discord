import jwt from 'jsonwebtoken';
import { Session } from '../../../prisma/client';
import CONFIG from '../../config/env.config';
import { getAvatarUrl } from '../../integrations/discord/discord.apiClient';
import { generateHMAC, generateRandomToken } from '../../shared/utils/secutiryUtils';
import { UserDto } from '../user/user.dto';
import type {
  CreateRefreshTokenDto,
  CreateSessionDto,
  RotateRefreshTokenDto,
  SessionDto,
} from './session.dto';
import {
  createSessionBD,
  getSessionByIdUserAndTokenBD,
  rotateRefreshTokensBD,
} from './session.model';

const { SIGN_TOKEN_JWT, SIGN_REFRESH_TOKEN, EXPIRE_TIME_ACCESS_TOKEN, EXPIRE_TIME_REFRESH_TOKEN } =
  CONFIG;

/**
 * Crea una sesión para un usuario
 * @param idUser ID del usuario
 * @returns
 */
export async function createSession(idUser: string): Promise<SessionDto> {
  // Generar refresh token
  const refreshTokenCreated: CreateRefreshTokenDto = createRefreshToken();

  // DTO para crear sesión
  const createSessionDto: CreateSessionDto = {
    idUser: idUser,
    refreshTokenHash: refreshTokenCreated.refreshTokenHash,
    fechaExpiracion: refreshTokenCreated.fechaExpiracion,
  };

  // Crear sesión
  const sessionBD: Session = await createSessionBD(createSessionDto);

  // Convertir la entidad a DTO
  const sessionDto: SessionDto = {
    id: sessionBD.id,
    idUser: sessionBD.idUser,
    refreshTokenHash: refreshTokenCreated.refreshToken, // Se devuelve el token sin hashear
    fechaExpiracion: sessionBD.fechaExpiracion,
    fechaCreacion: sessionBD.fechaCreacion,
    fechaActualizacion: sessionBD.fechaActualizacion,
  };

  return sessionDto;
}

/**
 * Crea un refresh token
 * @returns CreateRefreshTokenDto
 */
function createRefreshToken(): CreateRefreshTokenDto {
  // Crear token
  const token = generateRandomToken();

  // Crear expiración
  const expireTime: Date = new Date();
  expireTime.setTime(expireTime.getTime() + EXPIRE_TIME_REFRESH_TOKEN * 1000);

  // Hashear token
  const tokenHashed = generateHMAC(token, SIGN_REFRESH_TOKEN);

  const result: CreateRefreshTokenDto = {
    refreshToken: token,
    refreshTokenHash: tokenHashed,
    fechaExpiracion: expireTime,
  };

  return result;
}

/**
 * Crea un token JWT
 * @param usuario UserDto
 * @returns Access token JWT
 */
export function createTokenJwt(usuario: UserDto): string {
  // Obtener datos del usuario
  const { id, username, avatarHash } = usuario;

  // Crea un payload con el id, nombre y URL avatar
  const payload = {
    id: id,
    username: username,
    avatarUrl: getAvatarUrl(id, avatarHash),
  };

  const options = {
    expiresIn: EXPIRE_TIME_ACCESS_TOKEN,
  };

  const token = jwt.sign(payload, SIGN_TOKEN_JWT, options);

  return token;
}

/**
 * Valida si un refresh token existe para el usuario y no ha expirado
 * @param refreshToken Refresh token enviado por el usuario
 * @param idUser ID del usuario
 * @returns boolean que indica si se pasó la validación
 */
export async function verifyRefreshToken(refreshToken: string, idUser: string): Promise<boolean> {
  const refreshTokenHash = generateHMAC(refreshToken, SIGN_REFRESH_TOKEN);

  const sessionBD = await getSessionByIdUserAndTokenBD(refreshTokenHash, idUser);

  if (!sessionBD) {
    console.error(`No existe la sesión ${refreshTokenHash} para el usuario con ID ${idUser}`);
    return false;
  }

  if (new Date() > sessionBD.fechaExpiracion) {
    console.error(`El token ${refreshTokenHash} ha expirado`);
    return false;
  }

  return true;
}

/**
 * Actualiza el refreshToken del usuario
 * @param refreshToken Token a actualizar
 * @param idUser ID del usuario
 * @return El nuevo refresh token (sin hashear)
 */
export async function rotateRefreshToken(idUser: string, refreshToken: string): Promise<string> {
  // Genera un nuevo refresh token
  const createRefreshTokenDto: CreateRefreshTokenDto = createRefreshToken();

  // Montar DTO para rotar los tokens
  const rotateRefreshTokenDto: RotateRefreshTokenDto = {
    idUser: idUser,
    refreshTokenHashOld: generateHMAC(refreshToken, SIGN_REFRESH_TOKEN),
    refreshTokenHashNew: createRefreshTokenDto.refreshTokenHash,
    fechaExpiracion: createRefreshTokenDto.fechaExpiracion,
  };

  // Guardar en BD
  const sessionBD: Session | null = await rotateRefreshTokensBD(rotateRefreshTokenDto);
  if (!sessionBD) console.log('Error al actualizar el refresh token del usuario');

  return createRefreshTokenDto.refreshToken;
}
