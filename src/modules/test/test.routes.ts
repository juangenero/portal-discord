import { NextFunction, Request, Response, Router } from 'express';
import { infoDevice, testGetCookieCtrl, testSetCookieCtrl } from './test.controller';

const testRouter: Router = Router();

// Esto lanzará un error síncrono que Express captura automáticamente
testRouter.get('/error-sincrono', (req: Request, res: Response, next: NextFunction) => {
  throw new Error('Este es un error síncrono de prueba!');
});

// Simula una operación asíncrona que falla
testRouter.get('/error-asincrono', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Promise.reject(new Error('Este es un error asíncrono de prueba!'));
    res.send('Esto no se enviará si el error ocurre');
  } catch (error) {
    // En código asíncrono (async/await o promesas), debes pasar el error explícitamente a next()
    next(error);
  }
});

// Test para enviar cookie
testRouter.post('/set-cookie', (req: Request, res: Response, next: NextFunction) => {
  testSetCookieCtrl(req, res);
});

// Test para recibir cookie
testRouter.post('/get-cookie', (req: Request, res: Response, next: NextFunction) => {
  testGetCookieCtrl(req, res);
});

// Test para recibir cookie
testRouter.get('/info', (req: Request, res: Response, next: NextFunction) => {
  infoDevice(req, res);
});

// Ejemplo de ruta protegida
testRouter.get('/ruta-protegida', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Acceso concedido a ruta protegida', payload: req.payloadJwt });
});

export default testRouter;
