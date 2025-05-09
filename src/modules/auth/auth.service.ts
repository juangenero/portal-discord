import jwt from 'jsonwebtoken';
import CONFIG from '../../config/env.config';
import {
  getAvatarUrl,
  getTokenDiscord,
  getUrlAuthDiscord,
  getUsuarioDiscord,
} from '../../integrations/discord.api-client';
import { UsuarioDto } from '../user/user.dto';
import { createUpdateUsuario } from '../user/user.service';
import { TokenDiscordResponse, UsuarioDiscord } from './auth.dto';

const { SIGN_JWT: signJwt } = CONFIG;

// (Paso 1) Devuelve la URL para iniciar el flujo de login en Discord
export function initialize(): string {
  return getUrlAuthDiscord();
}

export async function login(code: string, codeVerifier: string) {
  // // (Paso 5) Intercambia el código de autorización por un token de acceso
  const resToken: TokenDiscordResponse = await getTokenDiscord(code, codeVerifier);
  const expireToken = new Date(Date.now() + resToken.expires_in * 1000);

  // (Paso 6) Obtiene la información del usuario de Discord usando el token de acceso
  const usuarioDiscord: UsuarioDiscord = await getUsuarioDiscord(resToken.access_token);

  // (Paso 7) Actualiza/crea el usuario en la base de datos y devuelve el token
  const usuario = await createUpdateUsuario({
    idDiscord: usuarioDiscord.id,
    nombre: usuarioDiscord.username,
    avatarUrl: usuarioDiscord.avatar,
    accessTokenDiscord: resToken.access_token,
    refreshTokenDiscord: resToken.refresh_token,
    accessTokenExpire: expireToken,
  });

  const tokenJwt = createTokenJwt(usuario);

  return tokenJwt;
}

function createTokenJwt(usuario: UsuarioDto): string {
  // Obtener datos del usuario
  const { idDiscord, nombre, avatarUrl } = usuario;

  // Crea un payload con el id, nombre y URL avatar
  const payload = {
    id: idDiscord,
    nombre: nombre,
    avatarUrl: getAvatarUrl(idDiscord, avatarUrl),
  };

  const options = {
    // expiresIn: 900, // 15 minutos
  };

  const token = jwt.sign(payload, signJwt, options);

  return token;
}
