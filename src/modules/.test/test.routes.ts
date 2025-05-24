import { NextFunction, Request, Response, Router } from 'express';
import { AppError } from '../../shared/errors/error-factory';
import { infoDeviceCtrl, testGetCookieCtrl, testSetCookieCtrl } from './test.controller';
import { getLogs } from './test.service';

const testPrivateRouter: Router = Router();
const testPublicRouter: Router = Router();

// Esto lanzará un error síncrono que Express captura automáticamente
testPrivateRouter.get('/error-sincrono', (req: Request, res: Response, next: NextFunction) => {
  throw new AppError('Este es un error síncrono de prueba!');
});

// Simula una operación asíncrona que falla
testPrivateRouter.get(
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
testPrivateRouter.post('/set-cookie', (req: Request, res: Response, next: NextFunction) => {
  testSetCookieCtrl(req, res);
});

// Test para recibir cookie
testPrivateRouter.post('/get-cookie', (req: Request, res: Response, next: NextFunction) => {
  testGetCookieCtrl(req, res);
});

// Test para recibir cookie
testPrivateRouter.get('/info-device', (req: Request, res: Response, next: NextFunction) => {
  infoDeviceCtrl(req, res);
});

// Ejemplo de ruta protegida
testPrivateRouter.get('/ruta-protegida', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Acceso concedido a ruta protegida', payload: req.payload });
});

// PÚBLICO
testPublicRouter.get('/logs', getLogs);

export { testPrivateRouter, testPublicRouter };
