export interface UserDto {
  id: string;
  username: string;
  avatarHash: string;
  accessTokenDiscord?: string | null;
  ivAccessTokenDiscord?: string | null;
  refreshTokenDiscord?: string | null;
  ivRefreshTokenDiscord?: string | null;
  accessTokenDiscordExpire?: Date | null;
}
