import { Request, Response } from 'express';
import { generateHMAC } from '../../shared/utils/security/secutiryUtils';
import { getDeviceInfo } from '../session/session.service';

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

// Registrar info
export async function infoCtrl(req: Request, res: Response): Promise<void> {
  res.status(200).send(req.ip);
}

// Info IP
export async function infoDevice(req: Request, res: Response): Promise<void> {
  const { ip } = req;
  const clientIp = typeof ip === 'string' && ip ? ip : 'desconocida';

  const userAgent = req.get('User-Agent');
  const clientUserAgent = userAgent ? userAgent : '';

  res.send(await getDeviceInfo(clientIp, clientUserAgent));
}
