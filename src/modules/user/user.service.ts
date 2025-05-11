import { User } from '../../../prisma/client';
import { UserDto } from './user.dto';
import { upsertUserBD } from './user.model';

export async function upsertUser(userDto: UserDto): Promise<UserDto> {
  const usuario: User = await upsertUserBD(userDto);

  // Convertir la entidad a DTO
  const result: UserDto = {
    id: usuario.id,
    username: usuario.username,
    avatarHash: usuario.avatarHash,
    accessTokenDiscord: usuario.accessTokenDiscord,
    refreshTokenDiscord: usuario.refreshTokenDiscord,
    accessTokenDiscordExpire: usuario.accessTokenDiscordExpire,
  };

  return result;
}
