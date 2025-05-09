import { Prisma, Usuario } from '../../../prisma/client';
import prisma from '../../config/db.config';
import { DatabaseError } from '../../shared/errors/DatabaseError';
import { UsuarioDto } from './user.dto';

/**
 * Crea o actualiza un usuario en la base de datos utilizando su ID de Discord.
 * @param {UsuarioDto} input - Objeto que contiene los datos del usuario.
 * @returns {Promise<Usuario>} - El usuario creado o actualizado.
 */
export async function upsertUserByDiscordId(input: UsuarioDto): Promise<Usuario> {
  try {
    const updateData: Prisma.UsuarioUpdateInput = {};

    // updateData solo incluye los campos existentes en el input, excluyendo el idDiscord.
    Object.keys(input).forEach((key) => {
      const value = input[key as keyof UsuarioDto];
      if (value !== undefined && key !== 'idDiscord') {
        (updateData as any)[key] = value;
      }
    });

    const output: Usuario = await prisma.usuario.upsert({
      where: { idDiscord: input.idDiscord },
      update: updateData,
      create: {
        idDiscord: input.idDiscord,
        nombre: input.nombre,
        avatarUrl: input.avatarUrl,
        accessTokenDiscord: input.accessTokenDiscord ?? null,
        refreshTokenDiscord: input.refreshTokenDiscord ?? null,
        accessTokenExpire: input.accessTokenExpire ?? null,
      },
    });

    return output;
  } catch (error) {
    throw new DatabaseError('Error al crear o actualizar el usuario');
  }
}
