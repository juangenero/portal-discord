// import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import CONFIG from './config/env.config';
import { testPrivateRouter, testPublicRouter } from './modules/.test/test.routes';
import authRouter from './modules/auth/auth.routes';
import { authHandler } from './shared/middlewares/auth.middleware';
import { errorHandler, notFoundHandler } from './shared/middlewares/error.middleware';
import log from './shared/utils/log/logger';
import { appRateLimit, authRateLimit } from './shared/utils/rate-limits/limiter';

const app: express.Application = express();

// Configuración general del servidor
app.set('trust proxy', 1); // Confiar en proxy
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public'))); // TODO - Realmente necesario? Sólo para favicon

// Rutas públicas
app.use('/test', testPublicRouter);
app.use('/auth', authRateLimit, authRouter);

// Rate limit global
app.use(appRateLimit);

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
