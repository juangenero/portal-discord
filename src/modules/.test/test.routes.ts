import { NextFunction, Request, Response, Router } from 'express';
import { AppError } from '../../shared/errors/error-factory';
import { infoDeviceCtrl, testGetCookieCtrl, testSetCookieCtrl } from './test.controller';
import { getHeader, getLogs } from './test.service';

const testRouterPrivate: Router = Router();
const testRouterPublic: Router = Router();

// Esto lanzará un error síncrono que Express captura automáticamente
testRouterPrivate.get('/error-sincrono', (req: Request, res: Response, next: NextFunction) => {
  throw new AppError('Este es un error síncrono de prueba!');
});

// Simula una operación asíncrona que falla
testRouterPrivate.get(
  '/error-asincrono',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.reject(new AppError('Este es un error asíncrono de prueba!'));
    } catch (error) {
      next(error);
    }
  }
);

// Test para enviar cookie
testRouterPrivate.post('/set-cookie', (req: Request, res: Response, next: NextFunction) => {
  testSetCookieCtrl(req, res);
});

// Test para recibir cookie
testRouterPrivate.post('/get-cookie', (req: Request, res: Response, next: NextFunction) => {
  testGetCookieCtrl(req, res);
});

// Test para recibir cookie
testRouterPrivate.get('/info-device', (req: Request, res: Response, next: NextFunction) => {
  infoDeviceCtrl(req, res);
});

// Ejemplo de ruta protegida
testRouterPrivate.get('/ruta-protegida', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Acceso concedido a ruta protegida', payload: req.payload });
});

// PÚBLICO
testRouterPublic.get('/logs', getLogs);

testRouterPublic.get('/header', getHeader);

export { testRouterPrivate, testRouterPublic };
