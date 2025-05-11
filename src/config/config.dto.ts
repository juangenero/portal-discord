interface Config {
  // Aplicación
  PORT: string;
  LEVEL_LOG: string;

  // JWT
  SIGN_TOKEN_JWT: string;
  SIGN_REFRESH_TOKEN: string;
  EXPIRE_TIME_REFRESH_TOKEN: number;
  EXPIRE_TIME_ACCESS_TOKEN: number;

  // SECURITY
  SIGN_TOKENS_DISCORD: string;

  // OAuth2 Discord
  DISCORD_OAUTH2_CLIENT_ID: string;
  DISCORD_OAUTH2_CLIENT_SECRET: string;
  DISCORD_OAUTH2_REDIRECT_URI: string;
  DISCORD_URL_AUTH: string;
  DISCORD_URL_TOKEN: string;
  DISCORD_URL_REVOKE_TOKEN: string;
  DISCORD_URL_USER: string;
  DISCORD_URL_AVATAR: string;

  // Bot Discord
  // TOKEN_BOT?: string;
  // SECONDS_TIMEOUT_BOT?: number;

  // Base de datos
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN: string;

  // Archivos
  // MAX_FILE_SIZE?: number;
}

export default Config;
