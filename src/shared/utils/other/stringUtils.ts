import { customAlphabet } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';

// Generar UUID
export function generateUUID(): string {
  return uuidv4();
}

// Crear nano ID
export function generateNanoId(size: number = 16): string {
  const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const nanoid = customAlphabet(ALPHABET, size);
  return nanoid();
}
