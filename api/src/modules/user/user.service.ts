import { User } from '../../../prisma/generated/client';
import { UserDto } from './types/user.dto';
import { UpsertUserData } from './types/user.types';
import { upsertUserDB } from './user.repository';

export async function upsertUser(upsertUserData: UpsertUserData): Promise<UserDto> {
  // Actualizar / Crear usuario
  const user: User = await upsertUserDB(upsertUserData);

  // Convertir la entidad a DTO
  const userDto: UserDto = {
    id: user.id,
    username: user.username,
    avatarHash: user.avatarHash,
    fechaCreacion: user.fechaCreacion,
    fechaActualizacion: user.fechaActualizacion,
  };

  return userDto;
}
