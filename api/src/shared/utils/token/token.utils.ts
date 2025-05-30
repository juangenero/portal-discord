import jwt from 'jsonwebtoken';
import CONFIG from '../../../config/env.config';
import { getAvatarUrl } from '../../../integrations/discord/discord-client.api';
import {
  desencriptar,
  encriptar,
  generateHMAC,
  generateRandomString,
} from '../security/secutiry.utils';
import { EncryptTokenData } from '../security/types/security.types';
import { CreateRefreshTokenData, JwtPayloadData } from './types/token.types';

const {
  SIGN_TOKENS_DISCORD,
  SIGN_TOKEN_JWT,
  SIGN_REFRESH_TOKEN,
  EXPIRE_TIME_ACCESS_TOKEN,
  EXPIRE_TIME_REFRESH_TOKEN,
} = CONFIG;

/**
 * Crea un token JWT
 * @param usuario UserDto
 * @returns Access token JWT
 */
export function createTokenJwt(input: JwtPayloadData): string {
  const payload: JwtPayloadData = {
    idUsuario: input.idUsuario,
    username: input.username,
    avatar: getAvatarUrl(input.idUsuario, input.avatar), // Obtenemos la URL mediante el hash del avatar
    idSesion: input.idSesion,
  };

  const options = {
    expiresIn: EXPIRE_TIME_ACCESS_TOKEN,
  };

  const token = jwt.sign(payload, SIGN_TOKEN_JWT, options);

  return token;
}

/**
 * Crea un refresh token
 */
export function createRefreshToken(): CreateRefreshTokenData {
  // Crear token
  const token = generateRandomString();

  // Crear expiración
  const expireTime: Date = new Date();
  expireTime.setTime(expireTime.getTime() + EXPIRE_TIME_REFRESH_TOKEN * 1000);

  // Hashear token
  const tokenHashed = generateHMAC(token, SIGN_REFRESH_TOKEN);

  // Montar respuesta
  const createRefreshTokenDto: CreateRefreshTokenData = {
    refreshToken: token,
    refreshTokenHash: tokenHashed,
    fechaExpiracion: expireTime,
  };

  return createRefreshTokenDto;
}

/**
 *
 * @param refreshToken
 * @returns
 */
export function hashRefreshToken(refreshToken: string): string {
  return generateHMAC(refreshToken, SIGN_REFRESH_TOKEN);
}

export function encryptTokenDiscord(token: string): EncryptTokenData {
  const { encrypted, iv } = encriptar(token, SIGN_TOKENS_DISCORD);
  return { encrypted, iv };
}

export function decryptTokenDiscord(encryptTokenData: EncryptTokenData): string {
  const token = desencriptar(encryptTokenData, SIGN_TOKENS_DISCORD);
  return token;
}
