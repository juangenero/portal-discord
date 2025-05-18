import { Prisma, User } from '../../../prisma/generated/client';
import prisma from '../../config/db.config';
import { DatabaseError } from '../../shared/errors/DatabaseError';
import { UserDto } from './user.dto';

/**
 * Crea o actualiza un usuario en la base de datos utilizando su ID de Discord.
 * @param {UsuarioDto} input - Objeto que contiene los datos del usuario.
 * @returns {Promise<Usuario>} - El usuario creado o actualizado.
 */
export async function upsertUserBD(input: UserDto): Promise<User> {
  try {
    const updateData: Prisma.UserUpdateInput = {};

    // updateData solo incluye los campos existentes en el input, excluyendo el idDiscord.
    Object.keys(input).forEach((key) => {
      const value = input[key as keyof UserDto];
      if (value !== undefined && key !== 'idDiscord') {
        (updateData as any)[key] = value;
      }
    });

    const output: User = await prisma.user.upsert({
      where: { id: input.id },
      update: updateData,
      create: {
        id: input.id,
        username: input.username,
        avatarHash: input.avatarHash,
        accessTokenDiscord: input.accessTokenDiscord ?? null,
        ivAccessTokenDiscord: input.ivAccessTokenDiscord ?? null,
        refreshTokenDiscord: input.refreshTokenDiscord ?? null,
        ivRefreshTokenDiscord: input.ivRefreshTokenDiscord ?? null,
        accessTokenDiscordExpire: input.accessTokenDiscordExpire ?? null,
      },
    });

    return output;
  } catch (error) {
    throw new DatabaseError('Error al crear o actualizar el usuario');
  }
}

export async function getUserById(idUser: string): Promise<User | null> {
  try {
    const output = await prisma.user.findUnique({
      where: {
        id: idUser,
      },
    });

    return output;
  } catch (error) {
    throw new DatabaseError('Error al obtener el usuario');
  }
}
