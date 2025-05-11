import { Session } from '../../../prisma/client';
import prisma from '../../config/db.config';
import { DatabaseError } from '../../shared/errors/DatabaseError';
import { CreateSessionDto, RotateRefreshTokenDto } from './session.dto';

/**
 * Crea una sesión para un usuario
 * @param input CreateSessionDto
 * @returns La sesión creada
 */
export async function createSessionBD(input: CreateSessionDto): Promise<Session> {
  try {
    const output: Session = await prisma.session.create({
      data: {
        idUser: input.idUser,
        refreshTokenHash: input.refreshTokenHash,
        fechaExpiracion: input.fechaExpiracion,
        deviceInfo: input.deviceInfo ?? null,
      },
    });

    return output;
  } catch (error) {
    throw new DatabaseError('Error al crear el registro de la sesión');
  }
}

/**
 * Recupera una sesión si existe
 * @param token refresh token
 * @param idUser ID de usuario
 * @returns Sesión recuperada o null si no existe
 */
export async function getSessionByIdUserAndTokenBD(
  token: string,
  idUser: string
): Promise<Session | null> {
  try {
    const session = await prisma.session.findFirst({
      where: {
        idUser: idUser,
        refreshTokenHash: token,
      },
    });

    return session;
  } catch (error) {
    throw new DatabaseError('Error obtener el registro de sesión');
  }
}

/**
 * Actualiza el refresh token de un usuario
 * @param refreshToken Refresh token a actualizar
 * @param idUser ID del usuario
 */
export async function rotateRefreshTokensBD(
  rotateRefreshTokenDto: RotateRefreshTokenDto
): Promise<Session | null> {
  try {
    const output: Session = await prisma.session.update({
      where: {
        idUser: rotateRefreshTokenDto.idUser,
        refreshTokenHash: rotateRefreshTokenDto.refreshTokenHashOld,
      },
      data: {
        refreshTokenHash: rotateRefreshTokenDto.refreshTokenHashNew,
        fechaExpiracion: rotateRefreshTokenDto.fechaExpiracion,
        deviceInfo: rotateRefreshTokenDto.deviceInfo ?? null,
      },
    });

    return output;
  } catch (error) {
    throw new DatabaseError('rotateRefreshTokensBD -> Error al actualizar el refresh token');
  }
}
