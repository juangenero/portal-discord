import { Request, Response } from 'express';
import { initialize, login, renewTokenJwt } from './auth.service';

export function loginCtrl(req: Request, res: Response) {
  res.status(200).json({
    url: initialize(),
  });
}

export async function callbackCtrl(req: Request, res: Response): Promise<void> {
  // IP
  const { ip } = req;
  const clientIp = typeof ip === 'string' && ip ? ip : '';

  // User-Agent
  const userAgent = req.get('User-Agent');
  const clientUserAgent = userAgent ? userAgent : '';

  // Body
  const { code, code_verifier } = req.body;

  // Procesar solicitud
  const responseTokens = await login(code, code_verifier, clientIp, clientUserAgent);

  // Respuesta
  const { name, value, options } = responseTokens.refreshTokenCookie;
  res.cookie(name, value, options);
  res.status(200).json({ accessToken: responseTokens.accessToken });
}

export async function refreshTokenCtrl(req: Request, res: Response): Promise<void> {
  // IP
  const { ip } = req;
  const clientIp = typeof ip === 'string' && ip ? ip : '';

  // User-Agent
  const userAgent = req.get('User-Agent');
  const clientUserAgent = userAgent ? userAgent : '';

  // Refresh Token
  const refreshToken = req.cookies.refreshToken;

  // Procesar solicitud
  const responseTokens = await renewTokenJwt(refreshToken, clientIp, clientUserAgent);

  // Montar respuesta
  const { name, value, options } = responseTokens.refreshTokenCookie;
  res.cookie(name, value, options);
  res.status(200).json({ accessToken: responseTokens.accessToken });
}
