import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

/**
 * Genera un UUID v4 aleatorio.
 * @returns string UUID
 */
export function generateUuid(): string {
  return uuidv4();
}

/**
 * Genera una cadena aleatoria de forma criptográfica.
 * @param size - Tamaño de la sal en bytes
 * @returns string Sal en formato hexadecimal.
 */
export function generateRandomToken(size: number = 32): string {
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
