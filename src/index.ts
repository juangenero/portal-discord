// import 'dotenv/config';
import express from 'express';
import CONFIG from './config/env.config';
import configServer from './config/server.config';
import { authPrivateRouter, authPublicRouter } from './modules/auth/auth.routes';
import testRouter from './modules/test/test.routes';
import { authHandler } from './shared/middlewares/auth.middleware';
import { errorHandler, notFoundHandler } from './shared/middlewares/error.middleware';

const app: express.Application = express();

configServer(app);

app.use('/auth', authPublicRouter);
app.use(authHandler);
app.use('/auth', authPrivateRouter);
app.use('/test', testRouter);

// Middleware global para manejar errores
app.use(notFoundHandler);
app.use(errorHandler);

// Manejo de errores globales fuera del ciclo de Express
process.on('unhandledRejection', (reason, promise) =>
  console.error('Error asíncrono no capturado: ', promise, 'reason:', reason)
);

process.on('uncaughtException', (error) => console.error('Error síncrono no capturado: ', error));

app.listen(CONFIG.PORT, () => {
  console.log(`Servidor iniciado en el puerto http://localhost:${CONFIG.PORT}`);
});
