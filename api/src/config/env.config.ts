import { AppError } from '../shared/errors/error-factory.js';
import ConfigData from './config.types.js';

/**
 * Mapeo de variables de entorno a constantes de configuración para autocompletado
 */
const CONFIG: ConfigData = Object.freeze({
  // APLICACIÓN
  PORT: process.env.PORT || '3000', // Puerto del servidor
  NODE_ENV: checkNodeEnv(), // Entorno de la aplicación
  DEBUG: checkBoolean('DEBUG'), // Modo debug de la aplicación
  DEBUG_PRISMA: checkBoolean('DEBUG_PRISMA'), // Modo debug de prisma (!! 'DEBUG' TAMBIÉN DEBE SER TRUE)
  TRUST_PROXY: Number(process.env.TRUST_PROXY) || 1, // Saltos proxy para obtener la IP del cliente (con req.ip)
  APP_RATE_LIMIT_ENABLED: checkBoolean('APP_RATE_LIMIT_ENABLED'), // Activar rate limit de aplicación
  APP_RATE_LIMIT_TIME: Number(process.env.APP_RATE_LIMIT_TIME) || 60, // Número de segundos para reestablecer el contador del rate limit global
  APP_RATE_LIMIT_REQUEST: Number(process.env.APP_RATE_LIMIT_REQUEST) || 30, // Número máximo de peticiones para el rate limit global
  URL_ORIGIN_CLIENT: getEnvVar('URL_ORIGIN_CLIENT'), // URL del cliente permitida en las CORS
  ENABLE_FILE_LOGGING: checkBoolean('ENABLE_FILE_LOGGING'), // Activar el guardado de logs en el sistema de archivos (./src/logs)

  // AUTH
  SIGN_TOKENS_DISCORD: process.env.SIGN_TOKENS_DISCORD || 'my_secret_key3', // Firma para los tokens de discord
  DISCORD_OAUTH2_CLIENT_ID: getEnvVar('DISCORD_OAUTH2_CLIENT_ID'),
  DISCORD_OAUTH2_CLIENT_SECRET: getEnvVar('DISCORD_OAUTH2_CLIENT_SECRET'),
  DISCORD_OAUTH2_REDIRECT_URI: getEnvVar('DISCORD_OAUTH2_REDIRECT_URI'),
  DISCORD_URL_AUTH: 'https://discord.com/oauth2/authorize',
  DISCORD_URL_TOKEN: 'https://discord.com/api/oauth2/token',
  DISCORD_URL_REVOKE_TOKEN: 'https://discord.com/api/oauth2/token/revoke',
  DISCORD_URL_USER: 'https://discord.com/api/users/@me',
  DISCORD_URL_AVATAR: 'https://cdn.discordapp.com/avatars/',

  SIGN_TOKEN_JWT: process.env.SIGN_TOKEN_JWT || 'my_secret_key1', // Firma del token JWT
  SIGN_REFRESH_TOKEN: process.env.SIGN_REFRESH_TOKEN || 'my_secret_key2', // Firma del refresh token
  EXPIRE_TIME_ACCESS_TOKEN: Number(process.env.EXPIRE_TIME_ACCESS_TOKEN) || 900, // Segundos de expiración access token (15 minutos por defecto)
  EXPIRE_TIME_REFRESH_TOKEN: Number(process.env.EXPIRE_TIME_REFRESH_TOKEN) || 604800, // Segundos de expiración refresh token (7 días por defecto)
  PATH_COOKIE: process.env.PATH_COOKIE || '/api/v1/auth', // Ruta donde el navegador enviará las cookies

  AUTH_RATE_LIMIT_ENABLED: checkBoolean('AUTH_RATE_LIMIT_ENABLED'), // Activar rate limit de aplicación
  AUTH_RATE_LIMIT_TIME: Number(process.env.AUTH_RATE_LIMIT_TIME) || 60, // Número de segundos para reestablecer el contador del rate limit de auth.routes
  AUTH_RATE_LIMIT_REQUEST: Number(process.env.AUTH_RATE_LIMIT_REQUEST) || 10, // Número máximo de peticiones para el rate limit de auth.routes

  // Discord Bot
  TOKEN_BOT: getEnvVar('TOKEN_BOT'),
  SECONDS_TIMEOUT_BOT: Number(process.env.SECONDS_TIMEOUT_BOT) || 600,
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID || '982724208343810058',
  DISCORD_CHANNEL_LOG_ID: process.env.DISCORD_CHANNEL_LOG_ID || '1171891002970230785',

  // DATABASE
  TURSO_DATABASE_URL: getEnvVar('TURSO_DATABASE_URL'),
  TURSO_AUTH_TOKEN: getEnvVar('TURSO_AUTH_TOKEN'),

  // Archivos
  MAX_FILE_SIZE: Number('process.env.MAX_FILE_SIZE') || 1048576,
});

// Checkear si las variables de entorno críticas están definidas
function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) throw new AppError(`La variable de entorno "${key}" no está definida.`);

  return value;
}

// Check NODE_ENV
function checkNodeEnv(): 'dev' | 'pro' {
  const nodeEnvValue = getEnvVar('NODE_ENV');

  if (nodeEnvValue !== 'dev' && nodeEnvValue !== 'pro') {
    throw new AppError(
      `El valor "${nodeEnvValue}" para NODE_ENV no es válido, solo se permite 'dev' o 'pro'`
    );
  }

  return nodeEnvValue;
}

// Check variables booleanas
function checkBoolean(key: string): boolean {
  const envVarValue = process.env[key];
  return envVarValue !== undefined && envVarValue.toLowerCase() === 'true';
}

export default CONFIG;
