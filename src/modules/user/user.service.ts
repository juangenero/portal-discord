import { User } from '../../../prisma/generated/client';
import CONFIG from '../../config/env.config';
import { StrEncrypted } from '../../shared/utils/security/security.dto';
import { encriptar } from '../../shared/utils/security/secutiryUtils';
import { UserDto } from './user.dto';
import { upsertUserBD } from './user.model';

const { SIGN_TOKENS_DISCORD } = CONFIG;

export async function upsertUser(userDto: UserDto): Promise<UserDto> {
  // Encriptar access token de discord
  if (userDto.accessTokenDiscord) {
    const accessTokenDiscordEncrypted: StrEncrypted = encriptar(
      userDto.accessTokenDiscord,
      SIGN_TOKENS_DISCORD
    );

    userDto = {
      ...userDto,
      accessTokenDiscord: accessTokenDiscordEncrypted.encrypted,
      ivAccessTokenDiscord: accessTokenDiscordEncrypted.iv,
    };
  } else {
    userDto = {
      ...userDto,
      accessTokenDiscord: null,
      ivAccessTokenDiscord: null,
    };
  }

  // Encriptar refresh token de discord
  if (userDto.refreshTokenDiscord) {
    const refreshTokenDiscordEncrypted: StrEncrypted = encriptar(
      userDto.refreshTokenDiscord,
      SIGN_TOKENS_DISCORD
    );

    userDto = {
      ...userDto,
      refreshTokenDiscord: refreshTokenDiscordEncrypted.encrypted,
      ivRefreshTokenDiscord: refreshTokenDiscordEncrypted.iv,
    };
  } else {
    userDto = {
      ...userDto,
      refreshTokenDiscord: null,
      ivRefreshTokenDiscord: null,
    };
  }

  // Actualizar / Crear usuario
  const usuario: User = await upsertUserBD(userDto);

  // Convertir la entidad a DTO
  const result: UserDto = {
    id: usuario.id,
    username: usuario.username,
    avatarHash: usuario.avatarHash,
    accessTokenDiscord: usuario.accessTokenDiscord,
    ivAccessTokenDiscord: usuario.ivAccessTokenDiscord,
    refreshTokenDiscord: usuario.refreshTokenDiscord,
    ivRefreshTokenDiscord: usuario.ivRefreshTokenDiscord,
    accessTokenDiscordExpire: usuario.accessTokenDiscordExpire,
  };

  return result;
}
