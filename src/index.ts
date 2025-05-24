// import 'dotenv/config';
import express from 'express';
import CONFIG from './config/env.config';
import configServer from './config/server.config';
import { testPrivateRouter, testPublicRouter } from './modules/.test/test.routes';
import authRouter from './modules/auth/auth.routes';
import { authHandler } from './shared/middlewares/auth.middleware';
import { errorHandler, notFoundHandler } from './shared/middlewares/error.middleware';
import log from './shared/utils/log/logger';

const app: express.Application = express();
configServer(app);

// Rutas públicas
app.use('/test', testPublicRouter);
app.use('/auth', authRouter);

// Middleware de autenticación
app.use(authHandler);

// Rutas privadas
app.use('/test', testPrivateRouter);

// Middleware global para manejar errores
app.use(notFoundHandler);
app.use(errorHandler);

// Manejo de errores globales fuera del ciclo de Express
process.on('unhandledRejection', (reason, promise) =>
  console.error('Error asíncrono no capturado: ', promise, 'reason:', reason)
);

process.on('uncaughtException', (error) => console.error('Error síncrono no capturado: ', error));

app.listen(CONFIG.PORT, () => {
  log.info(`Servidor iniciado en el puerto ${CONFIG.PORT}`);
});
