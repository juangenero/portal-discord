import { Prisma, User } from '../../../prisma/generated/client';
import prisma from '../../config/prisma.config';
import { DatabaseError } from '../../shared/errors/error-factory';
import log from '../../shared/utils/log/logger';
import { encryptTokenDiscord } from '../../shared/utils/token/token.utils';
import { UserDomain } from './types/user.domain';
import { UpsertUserData } from './types/user.types';

/**
 * Crea o actualiza un usuario en la base de datos utilizando su ID de Discord.
 * @param {UpsertUserData} input - Objeto que contiene los datos del usuario.
 * @returns {Promise<User>} - El usuario creado o actualizado.
 */
export async function upsertUserDB(input: UpsertUserData): Promise<User> {
  log.debug('INICIO upsertUserDB');
  log.debug(`Input recibido -> ${JSON.stringify(input)}`);
  try {
    // Base para los objetos de creación y actualización
    const baseUserData = {
      id: input.id,
      username: input.username,
      avatarHash: input.avatarHash,
      accessTokenDiscordExpire: input.accessTokenDiscordExpire ?? null,
      accessTokenDiscord: null,
      ivAccessTokenDiscord: null,
      refreshTokenDiscord: null,
      ivRefreshTokenDiscord: null,
    };
    log.debug(`baseUserData preparado ${JSON.stringify(baseUserData)}`);

    // Objeto para los campos del access token encriptado
    let encryptedAccessTokenFields: Partial<Prisma.UserCreateInput> = {};
    if (input.accessTokenDiscord) {
      const { encrypted, iv } = encryptTokenDiscord(input.accessTokenDiscord);
      encryptedAccessTokenFields = {
        accessTokenDiscord: encrypted,
        ivAccessTokenDiscord: iv,
      };
      log.debug(`Campos de accessTokenDiscord encriptados: ${encryptedAccessTokenFields}`);
    } else {
      log.debug(`No se proporcionó accessTokenDiscord para encriptar`);
    }

    // Objeto para los campos del refresh token encriptado
    let encryptedRefreshTokenFields: Partial<Prisma.UserCreateInput> = {};
    if (input.refreshTokenDiscord) {
      const { encrypted, iv } = encryptTokenDiscord(input.refreshTokenDiscord);
      encryptedRefreshTokenFields = {
        refreshTokenDiscord: encrypted,
        ivRefreshTokenDiscord: iv,
      };
      log.debug(
        `Campos de refreshTokenDiscord encriptados -> ${JSON.stringify(
          encryptedRefreshTokenFields
        )}`
      );
    } else {
      log.debug(`No se proporcionó refreshTokenDiscord para encriptar`);
    }

    // Objeto de creación
    const createData: Prisma.UserCreateInput = {
      ...baseUserData,
      ...encryptedAccessTokenFields,
      ...encryptedRefreshTokenFields,
    };
    log.debug(`Datos de creación (createData) preparados -> ${JSON.stringify(createData)}`);

    // Objeto de actualización
    const updateData: Prisma.UserUpdateInput = {
      username: input.username,
      avatarHash: input.avatarHash,
      accessTokenDiscordExpire: input.accessTokenDiscordExpire,
      ...encryptedAccessTokenFields,
      ...encryptedRefreshTokenFields,
    };
    log.debug(`Datos de actualización (updateData) preparados -> ${JSON.stringify(updateData)}`);

    log.debug(`Ejecutando prisma.user.upsert para el usuario con ID -> ${input.id}`);
    const user: User = await prisma.user.upsert({
      where: { id: input.id },
      update: updateData,
      create: createData,
    });
    log.debug(`Usuario upserted exitosamente -> ${JSON.stringify(user)}`);

    log.debug('FIN upsertUserDB');
    return user;
  } catch (error) {
    throw new DatabaseError(
      `Error al crear o actualizar el usuario ${input.id} en la base de datos`
    );
  }
}

/**
 * Obtiene un usuario de la base de datos por su ID.
 * @param idUser ID del usuario a buscar.
 * @returns {Promise<UserDomain | null>} El usuario encontrado o null si no se encuentra.
 */
// export async function getUserByIdDB(idUser: string): Promise<UserDomain | null> {
//   try {
//     let output = await prisma.user.findUnique({
//       where: {
//         id: idUser,
//       },
//     });

//     if (!output) return null;

//     if (
//       output.accessTokenDiscord &&
//       output.ivAccessTokenDiscord &&
//       output.refreshTokenDiscord &&
//       output.ivRefreshTokenDiscord
//     ) {
//       output = {
//         ...output,
//         accessTokenDiscord: decryptTokenDiscord({
//           encrypted: output.accessTokenDiscord,
//           iv: output.ivAccessTokenDiscord,
//         }),
//         refreshTokenDiscord: decryptTokenDiscord({
//           encrypted: output.refreshTokenDiscord,
//           iv: output.ivRefreshTokenDiscord,
//         }),
//       };
//     }
//     return output;
//   } catch (error) {
//     throw new DatabaseError(`Error al obtener el usuario ${idUser} de la base de datos`);
//   }
// }
