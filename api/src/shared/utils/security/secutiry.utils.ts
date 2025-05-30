import * as crypto from 'crypto';
import { EncryptTokenData } from './types/security.types';

const algoritmoEncriptado = 'aes-256-cbc';

/**
 * Genera una cadena aleatoria de forma criptográfica.
 * @param size - Tamaño de la cadena en bytes
 * @returns string en formato hexadecimal.
 */
export function generateRandomString(size: number = 32): string {
  return crypto.randomBytes(size).toString('hex');
}

/**
 * Hashea una cadena usando SHA-256 con una clave privada
 * @param str - La cadena a hashear
 * @param secret - La clave privada
 * @returns string Hash en formato hexadecimal.
 */
export function generateHMAC(str: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(str);
  return hmac.digest('hex');
}

/**
 * Encripta una cadena
 * @param str Cadena a encriptar
 * @param sign Firma para encriptar la cadena
 * @returns Objeto con IV y cadena encriptada
 */
export function encriptar(str: string, sign: string): EncryptTokenData {
  const keyBuffer = stringTo32ByteKey(sign);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algoritmoEncriptado, keyBuffer, iv);
  const passwordEncrypted = Buffer.concat([cipher.update(str), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    encrypted: passwordEncrypted.toString('hex'),
  };
}

/**
 * Desencripta una cadena
 * @param str Cadena encriptada
 * @param sign Firma para desencriptar la cadena
 * @returns Cadena desencriptada
 */
export function desencriptar(str: EncryptTokenData, sign: string): string {
  const keyBuffer = stringTo32ByteKey(sign);
  const iv = Buffer.from(str.iv, 'hex');
  const encrypted = Buffer.from(str.encrypted, 'hex');

  const passwordDesencrypted = crypto.createDecipheriv(algoritmoEncriptado, keyBuffer, iv);
  const result = Buffer.concat([
    passwordDesencrypted.update(encrypted),
    passwordDesencrypted.final(),
  ]).toString();

  return result;
}

// AUXILIARES

// Transforma una cadena (firma) en un Buffer de 32 bits
function stringTo32ByteKey(str: string): Buffer {
  const hash = crypto.createHash('sha256');
  hash.update(str, 'utf8');
  const keyBuffer = hash.digest();

  return keyBuffer;
}
