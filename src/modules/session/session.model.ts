import { Session } from '../../../prisma/generated/client';
import prisma from '../../config/db.config';
import { DatabaseError } from '../../shared/errors/DatabaseError';
import { CreateSessionDto } from './session.dto';

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
 * @param idUser ID de usuario
 * @param tokenHash refresh token hasheado
 * @returns Sesión recuperada o null si no existe
 */
export async function getSessionByTokenBD(tokenHash: string): Promise<Session | null> {
  try {
    const session = await prisma.session.findUnique({
      where: {
        refreshTokenHash: tokenHash,
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
  refreshTokenHashOld: string,
  refreshTokenHashNew: string,
  fechaExpiracion: Date,
  deviceInfo: string
): Promise<Session | null> {
  try {
    const output: Session = await prisma.session.update({
      where: {
        refreshTokenHash: refreshTokenHashOld,
      },
      data: {
        refreshTokenHash: refreshTokenHashNew,
        fechaExpiracion: fechaExpiracion,
        deviceInfo: deviceInfo ?? null,
      },
    });

    return output;
  } catch (error) {
    throw new DatabaseError(`Error al rotar el refresh token`);
  }
}
