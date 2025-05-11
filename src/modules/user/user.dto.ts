export interface UserDto {
  id: string;
  username: string;
  avatarHash: string;
  accessTokenDiscord?: string | null;
  refreshTokenDiscord?: string | null;
  accessTokenDiscordExpire?: Date | null;
}
