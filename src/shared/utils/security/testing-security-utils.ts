import { desencriptar, encriptar, generateHMAC, generateRandomString } from './secutiryUtils';

// 1. Refresh token
const refreshToken = generateRandomString();
console.log('1. refreshToken -> ', refreshToken);

// 2. Hash token
const secret = 'my_secret';
const tokenHash = generateHMAC(refreshToken, secret);
console.log('2. tokenHash -> ', tokenHash);

// 3. Encriptar token
const firma = 'my_secret';
const str = 'pass secreto123';
const passwordEncrypted = encriptar(str, firma);
console.log(`3. Encriptado cadena '${str}' -> `, passwordEncrypted);

// 4. Desencriptar token
const passwordDesencrypted = desencriptar(passwordEncrypted, firma);
console.log('4. Password desencriptada -> ', passwordDesencrypted);

// npx tsx .\src\shared\utils\testing-security-utils.ts
