// import 'dotenv/config';
import express from 'express';
import CONFIG from './config/env.config';
import configServer from './config/server.config';
import authRouter from './modules/auth/auth.routes';
import testRouter from './modules/test/test.routes';
import { authHandler } from './shared/middlewares/auth.middleware';
import { errorHandler, notFoundHandler } from './shared/middlewares/error.middleware';

const app: express.Application = express();

configServer(app);

app.use('/auth', authRouter);
app.use(authHandler);
app.use('/test', testRouter);

// Middleware para manejar errores
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(CONFIG.PORT, () => {
  console.log(`Servidor iniciado en el puerto http://localhost:${CONFIG.PORT}`);
});
