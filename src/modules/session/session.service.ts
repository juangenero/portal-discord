import { AuthorizationError, SessionError } from '../../shared/errors/error-factory';
import { getDeviceInfo } from '../../shared/utils/client-info/device-info.utils';
import { createRefreshToken, hashRefreshToken } from '../../shared/utils/token/token.utils';
import { UserDto } from '../user/types/user.dto';
import {
  createSessionDB,
  deleteSessionDB,
  getSessionByTokenDB,
  rotateRefreshTokensDB,
} from './session.repository';
import { RotateRefreshTokenDto, SessionDto } from './types/session.dto';
import type { CreateSessionData } from './types/session.types';

/**
 * Crea una sesión para un usuario
 * @param idUser ID del usuario
 * @returns
 */
export async function createSession(
  idUser: string,
  clientIp: string,
  clientUserAgent: string
): Promise<SessionDto> {
  // Generar refresh token
  const createRefreshTokenData = createRefreshToken();

  // DTO para crear sesión
  const createSessionData: CreateSessionData = {
    idUser: idUser,
    refreshTokenHash: createRefreshTokenData.refreshTokenHash,
    fechaExpiracion: createRefreshTokenData.fechaExpiracion,
    deviceInfo: await getDeviceInfo(clientIp, clientUserAgent),
  };

  // Crear sesión
  const session = await createSessionDB(createSessionData);

  // Convertir la entidad a DTO
  const sessionDto: SessionDto = {
    id: session.id,
    idUser: session.idUser,
    refreshToken: createRefreshTokenData.refreshToken, // Token sin hashear
    fechaExpiracion: session.fechaExpiracion,
    fechaCreacion: session.fechaCreacion,
    fechaActualizacion: session.fechaActualizacion,
    deviceInfo: session.deviceInfo,
  };

  return sessionDto;
}

/**
 * Valida si un refresh token existe para el usuario y no ha expirado
 * @param refreshToken Refresh token enviado por el usuario
 * @param idUser ID del usuario
 */
export async function verifyRefreshToken(refreshToken: string): Promise<void> {
  // Recuperar la sesión de la BD
  const refreshTokenUserHashed = hashRefreshToken(refreshToken);
  const sessionBD = await getSessionByTokenDB(refreshTokenUserHashed);

  // Validar existencia de la sesión
  if (!sessionBD) {
    throw new AuthorizationError(`No existe la sesión con con el token ${refreshToken}`);
  }

  // Validar que la sesión no ha expirado
  if (new Date() > sessionBD.fechaExpiracion) {
    throw new AuthorizationError(`El hash del token ${refreshTokenUserHashed} ha expirado`);
  }
}

/**
 * Actualiza el refreshToken del usuario
 * @param refreshToken Token a actualizar
 * @param idUser ID del usuario
 * @return El nuevo refresh token (sin hashear)
 */
export async function rotateRefreshToken(
  refreshToken: string,
  clientIp: string,
  clientUserAgent: string
): Promise<RotateRefreshTokenDto> {
  // Genera un nuevo refresh token
  const createRefreshTokenDto = createRefreshToken();

  // Extraer información de la sesión
  const deviceInfo = JSON.stringify(await getDeviceInfo(clientIp, clientUserAgent));

  // Hashear token
  const refreshTokenUserHashed = hashRefreshToken(refreshToken);

  // Guardar en BD
  const sessionBD = await rotateRefreshTokensDB(
    refreshTokenUserHashed,
    createRefreshTokenDto.refreshTokenHash,
    createRefreshTokenDto.fechaExpiracion,
    deviceInfo
  );

  if (!sessionBD) {
    throw new SessionError(
      `No se pudo actualizar la sesión del token ${refreshToken} con hash ${refreshTokenUserHashed}`
    );
  }

  // Montar el UserDto a partir de los datos del usuario incluido en la sesión
  const userDto: UserDto = {
    id: sessionBD.user.id,
    username: sessionBD.user.username,
    avatarHash: sessionBD.user.avatarHash,
  };

  // Montar respuesta
  const rotateRefreshTokenDto: RotateRefreshTokenDto = {
    ...createRefreshTokenDto,
    idSesion: sessionBD.id,
    userDto: userDto,
  };

  return rotateRefreshTokenDto;
}

/**
 * Elimina una sesión de la base de datos
 * @param refreshToken Token a eliminar
 * @returns SessionDto con la información de la sesión eliminada
 */
export async function deleteSession(refreshToken: string): Promise<void> {
  // Hashear token
  const refreshTokenHashed = hashRefreshToken(refreshToken);

  // Eliminar sesión de la BD
  const sesion = await deleteSessionDB(refreshTokenHashed);

  // Lanzar posible error
  if (!sesion) {
    throw new SessionError(
      `No se pudo eliminar la sesión del token ${refreshToken} con hash ${refreshTokenHashed}`
    );
  }
}
