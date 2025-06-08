import { customAlphabet } from 'nanoid';
import pkceChallenge from 'pkce-challenge';

export async function generatePKCE() {
  return await pkceChallenge();
}

export function generateRandomString(size: number = 32): string {
  const hexAlphabet = '0123456789abcdef';
  const nanoidHex = customAlphabet(hexAlphabet, size);
  return nanoidHex();
}
