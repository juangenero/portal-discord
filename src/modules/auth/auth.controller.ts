import { Request, Response } from 'express';
import { AuthorizationError } from '../../shared/errors/error-factory';
import { callback, getRefreshToken, getUrlAuthDiscord, logout } from './auth.service';

// Obtener URL login
export function loginCtrl(req: Request, res: Response): void {
  res.status(200).json({
    url: getUrlAuthDiscord(),
  });
}

// Callback de OAuth2 (cliente)
export async function callbackCtrl(req: Request, res: Response): Promise<void> {
  // IP
  // const { ip } = req;
  const ip = '84.122.227.100';
  const clientIp = typeof ip === 'string' && ip ? ip : '';

  // User-Agent
  const userAgent = req.get('User-Agent');
  const clientUserAgent = userAgent ? userAgent : '';

  // Body
  const { code, code_verifier } = req.body;

  // Procesar solicitud
  const responseTokens = await callback(code, code_verifier, clientIp, clientUserAgent);

  // Respuesta
  const { name, value, options } = responseTokens.refreshTokenCookie;
  res.cookie(name, value, options);
  res.status(200).json({ accessToken: responseTokens.accessToken });
}

// Obtener nuevo token de acceso
export async function refreshTokenCtrl(req: Request, res: Response): Promise<void> {
  // Refresh Token
  const refreshToken = req.cookies.refreshToken;
  console.log(refreshToken);

  if (!refreshToken) {
    throw new AuthorizationError('Falta el refresh token en la solicitud');
  }

  // IP
  // const { ip } = req;
  const ip = '84.122.227.100';
  const clientIp = typeof ip === 'string' && ip ? ip : '';

  // User-Agent
  const userAgent = req.get('User-Agent');
  const clientUserAgent = userAgent ? userAgent : '';

  // Procesar solicitud
  const responseTokens = await getRefreshToken(refreshToken, clientIp, clientUserAgent);

  // Montar respuesta
  const { name, value, options } = responseTokens.refreshTokenCookie;
  res.cookie(name, value, options);
  res.status(200).json({ accessToken: responseTokens.accessToken });
}

// Logout
export async function logoutCtrl(req: Request, res: Response): Promise<void> {
  // Obtener refresh Token
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AuthorizationError('Falta el refresh token en la solicitud');
  }

  // Procesar solicitud
  const refreshTokenCookie = await logout(refreshToken);

  // Limpiar cookie
  res.clearCookie(refreshTokenCookie.name, refreshTokenCookie.options);

  // Respuesta
  res.status(204).send();
}
