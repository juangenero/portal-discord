import { generateRandomToken, generateUuid, hashWithSalt, verifyHash } from './secutiryUtils';

// Generar uuid
const uuid = generateUuid();
console.log('uuid -> ', uuid);

// Generar sal
const salt = generateRandomToken(16);
console.log('salt -> ', salt);

// Generar hash
const pass: string = '123abc';
const hash: string = hashWithSalt(pass, salt);
console.log(`Aplicando hash a ${pass} -> `, hash);

// Verificar hash
const passFromUser: string = '123abc77';
const match: boolean = verifyHash(passFromUser, hash, salt);
console.log('Contraseña válida? ', match);

// Ejemplo refresh token
const refreshToken = generateRandomToken();
console.log('refreshToken -> ', refreshToken);
