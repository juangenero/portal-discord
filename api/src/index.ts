// import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import CONFIG from './config/env.config';
import { testRouterPrivate, testRouterPublic } from './modules/.test/test.routes';
import authRouter from './modules/auth/auth.routes';
import sessionRouter from './modules/session/session.routes';
import { authHandler } from './shared/middlewares/auth.middleware';
import { errorHandler, notFoundHandler } from './shared/middlewares/error.middleware';
import { swaggerOptions } from './shared/swagger/swagger';
import log from './shared/utils/log/logger';
import { appRateLimit, authRateLimit } from './shared/utils/rate-limits/limiters';

const { PORT, TRUST_PROXY } = CONFIG;

const app: express.Application = express();

// Configuración del servidor
app.use(express.static(path.join(__dirname, './../public')));
app.set('trust proxy', TRUST_PROXY); // Confiar en proxy
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Rutas públicas
app.use('/test', testRouterPublic);
app.use('/auth', authRateLimit, authRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerOptions)));

// Auth & rate limit app
app.use(authHandler, appRateLimit);

// Rutas privadas
app.use('/test', testRouterPrivate);
app.use('/sesion', sessionRouter);

// Middleware global para manejar errores
app.use(notFoundHandler);
app.use(errorHandler);

// Manejo de errores globales fuera del ciclo de Express
process.on('unhandledRejection', (reason, promise) =>
  console.error('Error asíncrono no capturado: ', promise, 'reason:', reason)
);

process.on('uncaughtException', (error) => console.error('Error síncrono no capturado: ', error));

app.listen(PORT, () => {
  log.info(`Servidor iniciado en el puerto ${PORT}`);
});
