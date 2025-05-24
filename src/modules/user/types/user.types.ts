export interface UpsertUserData {
  id: string;
  username: string;
  avatarHash: string;
  accessTokenDiscord?: string;
  refreshTokenDiscord?: string;
  accessTokenDiscordExpire?: Date;
}
