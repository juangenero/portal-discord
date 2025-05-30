import { UserDto } from './user.dto';

export interface UpsertUserData {
  id: string;
  username: string;
  avatarHash: string;
  accessTokenDiscord?: string;
  refreshTokenDiscord?: string;
  accessTokenDiscordExpire?: Date;
}

// usar Omit para crear un type y evitar campos opcionales
export type UserNominalData = Pick<UserDto, 'id' | 'username' | 'avatarHash'>;
