import { Session } from '../../../prisma/generated/client';
import prisma from '../../config/turso.config';
import { DatabaseError } from '../../shared/errors/error-factory';
import { DeviceInfoDto } from '../../shared/utils/client-info/types/device-info.dto';
import { SessionWithUserData } from './types/session.domain';
import { CreateSessionData } from './types/session.types';

/**
 * Crea una sesión para un usuario
 * @param input CreateSessionDto
 * @returns La sesión creada
 */
export async function createSessionDB(input: CreateSessionData): Promise<Session> {
  try {
    const output: Session = await prisma.session.create({
      data: {
        idUser: input.idUser,
        refreshTokenHash: input.refreshTokenHash,
        fechaExpiracion: input.fechaExpiracion,
        deviceInfo: JSON.stringify(input.deviceInfo),
      },
    });

    // output.deviceInfo = JSON.parse(output.deviceInfo);

    return output;
  } catch (error) {
    throw new DatabaseError(`Error al crear la sesión del usuario ${input.idUser}`);
  }
}

/**
 * Obtiene las sesiones de un usuario
 * @param idUser ID del usuario
 * @returns Lista de sesiones
 */
export async function getSessionsActiveByIdUserDB(idUser: string): Promise<Array<Session>> {
  try {
    const listSessions = await prisma.session.findMany({
      where: {
        idUser: idUser,
        fechaExpiracion: {
          gt: new Date(),
        },
      },
    });

    return listSessions;
  } catch (error) {
    throw new DatabaseError(`Error al obtener las sesiones del usuario ${idUser}`);
  }
}

/**
 * Recupera una sesión si existe
 * @param idUser ID de usuario
 * @param tokenHash refresh token hasheado
 * @returns Sesión recuperada o null si no existe
 */
export async function getSessionByTokenDB(tokenHash: string): Promise<Session | null> {
  try {
    const session = await prisma.session.findUnique({
      where: {
        refreshTokenHash: tokenHash,
      },
    });

    return session;
  } catch (error) {
    throw new DatabaseError(`Error al obtener la sesión con el token ${tokenHash}`);
  }
}

/**
 * Actualiza el refresh token de un usuario
 * @param refreshToken Refresh token a actualizar
 * @param idUser ID del usuario
 */
export async function rotateRefreshTokensDB(
  refreshTokenHashOld: string,
  refreshTokenHashNew: string,
  fechaExpiracion: Date,
  deviceInfo: DeviceInfoDto
): Promise<SessionWithUserData | null> {
  try {
    const output = await prisma.session.update({
      where: {
        refreshTokenHash: refreshTokenHashOld,
      },
      data: {
        refreshTokenHash: refreshTokenHashNew,
        fechaExpiracion: fechaExpiracion,
        deviceInfo: JSON.stringify(deviceInfo),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatarHash: true,
          },
        },
      },
    });

    return output;
  } catch (error) {
    throw new DatabaseError(`Error al rotar el refresh token ${refreshTokenHashOld}`);
  }
}

/**
 * Elimina una sesión por su refresh token
 * @param refreshTokenHash refresh token de la sesión
 * @returns La sesisión eliminada
 */
export async function deleteSessionByRefreshTokenDB(
  refreshTokenHash: string
): Promise<Session | null> {
  try {
    const output = await prisma.session.delete({
      where: {
        refreshTokenHash: refreshTokenHash,
      },
    });

    return output;
  } catch (error) {
    throw new DatabaseError(`Error al eliminar la sesión con el token ${refreshTokenHash}`);
  }
}

export async function deleteSessionByIdDB(idUser: string, idSesion: string) {
  try {
    const output = await prisma.session.delete({
      where: {
        id: idSesion,
        idUser: idUser,
      },
    });

    return output;
  } catch (error) {
    throw new DatabaseError(`No se pudo eliminar la sesión con ID ${idSesion}`);
  }
}
