import express, { NextFunction, Request, Response } from 'express';
import CONFIG from './config/env.config';
import configServer from './config/server.config';
import authRouter from './modules/auth/auth.routes';
import { errorHandler, notFoundHandler } from './shared/middlewares/error.middleware';

const app: express.Application = express();

configServer(app);

// Esto lanzará un error síncrono que Express captura automáticamente
app.get('/error-sincrono', (req: Request, res: Response, next: NextFunction) => {
  throw new Error('Este es un error síncrono de prueba!');
});

// Simula una operación asíncrona que falla
app.get('/error-asincrono', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Promise.reject(new Error('Este es un error asíncrono de prueba!'));
    res.send('Esto no se enviará si el error ocurre');
  } catch (error) {
    // En código asíncrono (async/await o promesas), debes pasar el error explícitamente a next()
    next(error);
  }
});

app.use('/auth', authRouter);

// Middleware para manejar errores
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(CONFIG.PORT, () => {
  console.log(`Servidor iniciado en el puerto http://localhost:${CONFIG.PORT}`);
});
