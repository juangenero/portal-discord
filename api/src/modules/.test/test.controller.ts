import { NextFunction, Request, Response } from 'express';
import { getDeviceInfo } from '../../shared/utils/client-info/device-info.utils';
import { generateHMAC } from '../../shared/utils/security/secutiry.utils';

// Enviar cookie
export async function testSetCookieCtrl(req: Request, res: Response): Promise<void> {
  const tokenExpiracion = new Date(Date.now() + 1000 * 60 * 10); // Expira en 5 minutos
  const secret = 'my_secret';
  const refreshToken = generateHMAC('token123', secret); // Asegúrate que generateHMAC funcione correctamente

  res.cookie('refreshTokenApp', refreshToken, {
    httpOnly: true, // Impide el acceso desde JavaScript
    secure: false, // Necesario para probar en HTTP local
    expires: tokenExpiracion, // Fecha de expiración de la cookie
    sameSite: 'strict', // Más permisivo que 'None' y funciona sin Secure=true
    path: '/test/get-cookie', // Aplica la cookie a todo el dominio para simplificar la prueba
  });

  res.json({ jwt: 'Aqui va el token JWT' });
}

// Recibir cookie
export async function testGetCookieCtrl(req: Request, res: Response): Promise<void> {
  const refreshTokenApp = req.cookies.refreshTokenApp;

  if (!refreshTokenApp) {
    res.status(401).json({ message: 'Refresh token no encontrado en la cookie' });
  } else {
    res.status(200).json({ message: `Token encontrado en la cookie: ${refreshTokenApp}` });
  }
}

// Info IP
export async function infoDeviceCtrl(req: Request, res: Response): Promise<void> {
  const { ip } = req;
  const clientIp = typeof ip === 'string' && ip ? ip : 'desconocida';

  const userAgent = req.get('User-Agent');
  const clientUserAgent = userAgent ? userAgent : '';

  res.send(await getDeviceInfo(clientIp, clientUserAgent));
}

// Info headers request
export async function getHeader(req: Request, res: Response, next: NextFunction) {
  res.status(200).json(req.headers);
}
