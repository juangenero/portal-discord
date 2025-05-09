import Config from './config.types';

/**
 * Mapeo de variables de entorno a constantes de configuración para autocompletado
 */
const CONFIG: Config = Object.freeze({
  // Aplicación
  PORT: process.env.PORT || '3000',
  LEVEL_LOG: process.env.LEVEL_LOG || 'info',

  // JWT
  SIGN_JWT: process.env.PORT || 'my_secret_key',

  // Discord OAuth2
  DISCORD_OAUTH2_CLIENT_ID: getEnvVar('DISCORD_OAUTH2_CLIENT_ID'),
  DISCORD_OAUTH2_CLIENT_SECRET: getEnvVar('DISCORD_OAUTH2_CLIENT_SECRET'),
  DISCORD_OAUTH2_REDIRECT_URI: getEnvVar('DISCORD_OAUTH2_REDIRECT_URI'),
  DISCORD_URL_AUTH: 'https://discord.com/oauth2/authorize',
  DISCORD_URL_TOKEN: 'https://discord.com/api/oauth2/token',
  DISCORD_URL_REVOKE_TOKEN: 'https://discord.com/api/oauth2/token/revoke',
  DISCORD_URL_USER: 'https://discord.com/api/users/@me',
  DISCORD_URL_AVATAR: 'https://cdn.discordapp.com/avatars/',

  // Discord Bot
  // TOKEN_BOT: process.env.TOKEN_BOT,
  // SECONDS_TIMEOUT_BOT: process.env.SECONDS_TIMEOUT_BOT || 600,

  // Base de datos
  TURSO_DATABASE_URL: getEnvVar('TURSO_DATABASE_URL'),
  TURSO_AUTH_TOKEN: getEnvVar('TURSO_AUTH_TOKEN'),

  // Archivos
  // MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 1048576,
});

// Checkear si las variables de entorno críticas están definidas
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`La variable de entorno "${key}" no está definida.`);
  }

  return value;
}

export default CONFIG;
