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
import { initBotDiscord } from './modules/discord/discord.service';
import sessionRouter from './modules/session/session.routes';
import sonidoRouter from './modules/sonido/sonido.routes';
import { authHandler } from './shared/middlewares/auth.middleware';
import { errorHandler, notFoundHandler } from './shared/middlewares/error.middleware';
import { swaggerOptions } from './shared/swagger/swagger';
import log from './shared/utils/log/logger';
import { appRateLimit, authRateLimit } from './shared/utils/rate-limits/limiters';

const { PORT, TRUST_PROXY, URL_ORIGIN_CLIENT } = CONFIG;

const app: express.Application = express();

app.listen(PORT, () => {
  log.info(`Servidor iniciado en el puerto ${PORT}`);
});

const apiRouter = express.Router();

// Configuración del servidor
app.use(express.static(path.join(__dirname, './../public')));
app.set('trust proxy', TRUST_PROXY); // Confiar en proxy
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: URL_ORIGIN_CLIENT,
    credentials: true, // Permitir envío y recepción de cookies
  })
);

// Login bot discord
initBotDiscord();

// Rutas públicas
apiRouter.use('/test', testRouterPublic);
apiRouter.use('/auth', authRateLimit, authRouter);
apiRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerOptions)));

// Auth & rate limit app
apiRouter.use(authHandler, appRateLimit);

// Rutas privadas
apiRouter.use('/test', testRouterPrivate);
apiRouter.use('/sesion', sessionRouter);
apiRouter.use('/sonido', sonidoRouter);

// Enrutador principal
app.use('/api/v1', apiRouter);

// Middleware global para manejar errores
app.use(notFoundHandler, errorHandler);

// Manejo de errores globales fuera del ciclo de Express
process.on('unhandledRejection', (reason, promise) =>
  console.error('Error asíncrono no capturado: ', promise, 'reason:', reason)
);

process.on('uncaughtException', (error) => console.error('Error síncrono no capturado: ', error));
