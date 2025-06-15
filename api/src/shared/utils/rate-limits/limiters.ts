import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import CONFIG from '../../../config/env.config';
import { RateLimitError } from '../../errors/error-factory';

const {
  APP_RATE_LIMIT_ENABLED,
  APP_RATE_LIMIT_TIME,
  APP_RATE_LIMIT_REQUEST,
  AUTH_RATE_LIMIT_ENABLED,
  AUTH_RATE_LIMIT_TIME,
  AUTH_RATE_LIMIT_REQUEST,
} = CONFIG;

// Rate limit para rutas protegidas
export const appRateLimit = (req: Request, res: Response, next: NextFunction) => {
  if (!APP_RATE_LIMIT_ENABLED) {
    return next();
  }

  // Si está habilitado, aplica el rate limit
  return rateLimit({
    windowMs: APP_RATE_LIMIT_TIME * 1000,
    max: APP_RATE_LIMIT_REQUEST,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request, res: Response) => {
      if (req.payload && req.payload.idUsuario) {
        return req.payload.idUsuario;
      }
      return req.ip;
    },
    handler: (req: Request, res: Response, next: NextFunction) => {
      next(
        new RateLimitError('Rate limit superado', 'Demasiadas solicitudes consecutivas a la API')
      );
    },
  })(req, res, next); // Llama al middleware de rate limit
};

// Rate limit para auth
export const authRateLimit = (req: Request, res: Response, next: NextFunction) => {
  if (!AUTH_RATE_LIMIT_ENABLED) {
    return next();
  }

  // Si está habilitado, aplica el rate limit
  return rateLimit({
    windowMs: AUTH_RATE_LIMIT_TIME * 1000,
    max: AUTH_RATE_LIMIT_REQUEST,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response, next: NextFunction) => {
      next(
        new RateLimitError(
          'Rate limit superado',
          'Demasiadas solicitudes consecutivas al servicio de autenticación'
        )
      );
    },
  })(req, res, next); // Llama al middleware de rate limit
};
