interface ConfigData {
  // Aplicación
  PORT: string;
  NODE_ENV: 'dev' | 'pro';
  MODE_DEBUG: boolean;
  TRUST_PROXY: number;
  APP_RATE_LIMIT_ENABLED: boolean;
  APP_RATE_LIMIT_TIME: number;
  APP_RATE_LIMIT_REQUEST: number;
  URL_ORIGIN_CLIENT: string;
  ENABLE_FILE_LOGGING: boolean;

  // Auth
  SIGN_TOKENS_DISCORD: string;
  DISCORD_OAUTH2_CLIENT_ID: string;
  DISCORD_OAUTH2_CLIENT_SECRET: string;
  DISCORD_OAUTH2_REDIRECT_URI: string;
  DISCORD_URL_AUTH: string;
  DISCORD_URL_TOKEN: string;
  DISCORD_URL_REVOKE_TOKEN: string;
  DISCORD_URL_USER: string;
  DISCORD_URL_AVATAR: string;

  SIGN_TOKEN_JWT: string;
  SIGN_REFRESH_TOKEN: string;
  EXPIRE_TIME_REFRESH_TOKEN: number;
  EXPIRE_TIME_ACCESS_TOKEN: number;
  PATH_COOKIE: string;

  AUTH_RATE_LIMIT_ENABLED: boolean;
  AUTH_RATE_LIMIT_TIME: number;
  AUTH_RATE_LIMIT_REQUEST: number;

  // Bot Discord
  // TOKEN_BOT?: string;
  // SECONDS_TIMEOUT_BOT?: number;

  // Base de datos
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN: string;

  // Archivos
  // MAX_FILE_SIZE?: number;
}

export default ConfigData;
