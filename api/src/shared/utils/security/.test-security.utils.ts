import CONFIG from '../../../config/env.config';
import { desencriptar, encriptar, generateHMAC, generateRandomString } from './secutiry.utils';

const { SIGN_REFRESH_TOKEN } = CONFIG;

// 1. Refresh token
let refreshToken = generateRandomString();
console.log('1. refreshToken -> ', refreshToken);

// 2. HASH TOKEN
let secret = 'my_secret';
secret = SIGN_REFRESH_TOKEN;
refreshToken = 'f6479e6d3011fd5cdf105622de8c0e0367f275ea3864553888def32074edfe12';
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

// npx tsx  --env-file=.env .\src\shared\utils\security\.test-security.utils.ts
