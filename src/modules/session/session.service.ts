import jwt from 'jsonwebtoken';
import { IBrowser, IDevice, IOS, UAParser } from 'ua-parser-js';
import { Session } from '../../../prisma/generated/client';
import CONFIG from '../../config/env.config';
import { getAvatarUrl } from '../../integrations/discord/discord.apiClient';
import { geolocalizateIp } from '../../integrations/ip/ip.apiClient';
import { DatabaseError } from '../../shared/errors/DatabaseError';
import { generateHMAC, generateRandomString } from '../../shared/utils/security/secutiryUtils';
import { UserDto } from '../user/user.dto';
import type {
  CreateRefreshTokenDto,
  CreateSessionDto,
  DeviceInfo,
  PayloadJwt,
  RotateRefreshTokenDto,
  SessionDto,
  UserAgentInfo,
} from './session.dto';
import {
  createSessionBD,
  getSessionByIdUserAndTokenBD,
  rotateRefreshTokensBD,
} from './session.model';

const { SIGN_TOKEN_JWT, SIGN_REFRESH_TOKEN, EXPIRE_TIME_ACCESS_TOKEN, EXPIRE_TIME_REFRESH_TOKEN } =
  CONFIG;

/**
 * Crea una sesión para un usuario
 * @param idUser ID del usuario
 * @returns
 */
export async function createSession(
  idUser: string,
  clientIp: string,
  clientUserAgent: string
): Promise<SessionDto> {
  // Generar refresh token
  const refreshTokenCreated: CreateRefreshTokenDto = createRefreshToken();

  // DTO para crear sesión
  const createSessionDto: CreateSessionDto = {
    idUser: idUser,
    refreshTokenHash: refreshTokenCreated.refreshTokenHash,
    fechaExpiracion: refreshTokenCreated.fechaExpiracion,
    deviceInfo: JSON.stringify(await getDeviceInfo(clientIp, clientUserAgent)),
  };

  // Crear sesión
  const sessionBD: Session = await createSessionBD(createSessionDto);

  // Convertir la entidad a DTO
  const sessionDto: SessionDto = {
    id: sessionBD.id,
    idUser: sessionBD.idUser,
    refreshToken: refreshTokenCreated.refreshToken,
    fechaExpiracion: sessionBD.fechaExpiracion,
    fechaCreacion: sessionBD.fechaCreacion,
    fechaActualizacion: sessionBD.fechaActualizacion,
  };

  return sessionDto;
}

/**
 * Crea un refresh token
 * @returns CreateRefreshTokenDto
 */
function createRefreshToken(): CreateRefreshTokenDto {
  // Crear token
  const token = generateRandomString();

  // Crear expiración
  const expireTime: Date = new Date();
  expireTime.setTime(expireTime.getTime() + EXPIRE_TIME_REFRESH_TOKEN * 1000);

  // Hashear token
  const tokenHashed = generateHMAC(token, SIGN_REFRESH_TOKEN);

  const createRefreshTokenDto: CreateRefreshTokenDto = {
    refreshToken: token,
    refreshTokenHash: tokenHashed,
    fechaExpiracion: expireTime,
  };

  return createRefreshTokenDto;
}

/**
 * Crea un token JWT
 * @param usuario UserDto
 * @returns Access token JWT
 */
export function createTokenJwt(usuario: UserDto, idSesion: string): string {
  // Obtener datos del usuario
  const { id, username, avatarHash } = usuario;

  // Crea un payload con el id, nombre y URL avatar
  const payload: PayloadJwt = {
    idUsuario: id,
    username: username,
    avatarUrl: getAvatarUrl(id, avatarHash),
    idSesion: idSesion,
  };

  const options = {
    expiresIn: EXPIRE_TIME_ACCESS_TOKEN,
  };

  const token = jwt.sign(payload, SIGN_TOKEN_JWT, options);

  return token;
}

/**
 * Valida si un refresh token existe para el usuario y no ha expirado
 * @param refreshToken Refresh token enviado por el usuario
 * @param idUser ID del usuario
 * @returns boolean que indica si se pasó la validación
 */
export async function verifyRefreshToken(refreshToken: string, idUser: string): Promise<boolean> {
  const refreshTokenHash = generateHMAC(refreshToken, SIGN_REFRESH_TOKEN);

  const sessionBD = await getSessionByIdUserAndTokenBD(idUser, refreshTokenHash);

  if (sessionBD === null) {
    console.error(`No existe la sesión ${refreshTokenHash} para el usuario con ID ${idUser}`);
    return false;
  }

  if (new Date() > sessionBD.fechaExpiracion) {
    console.error(`El token ${refreshTokenHash} ha expirado`);
    return false;
  }

  return true;
}

/**
 * Actualiza el refreshToken del usuario
 * @param refreshToken Token a actualizar
 * @param idUser ID del usuario
 * @return El nuevo refresh token (sin hashear)
 */
export async function rotateRefreshToken(
  idUser: string,
  refreshToken: string,
  clientIp: string,
  clientUserAgent: string
): Promise<RotateRefreshTokenDto> {
  // Genera un nuevo refresh token
  const createRefreshTokenDto: CreateRefreshTokenDto = createRefreshToken();

  // Extraer información de la sesión
  const deviceInfo: string = JSON.stringify(await getDeviceInfo(clientIp, clientUserAgent));

  // Hashear token
  const refreshTokenUserHashed = generateHMAC(refreshToken, SIGN_REFRESH_TOKEN);

  // Guardar en BD
  const sessionBD: Session | null = await rotateRefreshTokensBD(
    idUser,
    refreshTokenUserHashed,
    createRefreshTokenDto.refreshTokenHash,
    createRefreshTokenDto.fechaExpiracion,
    deviceInfo
  );
  if (!sessionBD) {
    throw new DatabaseError(`Error al guardar al actualizar la sesión del usuario ${idUser}`);
  }

  // Montar respuesta
  const rotateRefreshTokenDto: RotateRefreshTokenDto = {
    ...createRefreshTokenDto,
    idSesion: sessionBD.id,
  };

  return rotateRefreshTokenDto;
}

/**
 * Devuelve información del dispositivo y ubicación del usuario
 * @param ip String con la IP del usuario
 * @param userAgent String del User-Agent del usuario
 * @returns DTO DeviceInfo con la información obtenida
 */
export async function getDeviceInfo(ip: string, userAgent: string): Promise<DeviceInfo> {
  let baseDeviceInfo: DeviceInfo = {
    ip: ip,
  };

  if (ip) {
    let ipInfo = await geolocalizateIp(ip);
    baseDeviceInfo = {
      ...baseDeviceInfo,
      ...ipInfo,
    };
  }

  if (userAgent) {
    let userAgentInfo = parseUserAgent(userAgent);
    baseDeviceInfo = {
      ...baseDeviceInfo,
      ...userAgentInfo,
    };
  }

  return baseDeviceInfo;
}

// - - - - - MÉTODOS AUXILIARES - - - - -

/**
 * Extrae información de la cadena User-Agent del cliente
 * @param userAgent User-Agent del cliente
 * @returns DTO UserAgentInfo con información del dispositivo
 */
export function parseUserAgent(userAgent: string): UserAgentInfo {
  let baseUserAgentInfo: UserAgentInfo = {};

  if (!userAgent) {
    return baseUserAgentInfo;
  }

  try {
    const parser = new UAParser(userAgent);

    // Extraer Sistema Operativo usando el tipo importado
    const os: IOS = parser.getOS();
    if (os && os.name) {
      baseUserAgentInfo.sistemaOperativo = os.name;
    }

    // Extraer Navegador usando el tipo importado
    const browser: IBrowser = parser.getBrowser();
    if (browser && browser.name) {
      baseUserAgentInfo.navegador = browser.name;
    }

    // Extraer Tipo de Dispositivo usando el tipo importado
    const device: IDevice = parser.getDevice();
    if (device && device.type) {
      baseUserAgentInfo.tipoDispositivo = device.type;
    }

    return baseUserAgentInfo;
  } catch (error) {
    console.error(`Error al leer la cadena de User-Agent: ${userAgent}`, error);
    return baseUserAgentInfo;
  }
}
