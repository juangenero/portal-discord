import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import CONFIG from '../../../config/env.config';
import { RateLimitError } from '../../errors/error-factory';

const {
  APP_RATE_LIMIT_TIME,
  APP_RATE_LIMIT_REQUEST,
  AUTH_RATE_LIMIT_TIME,
  AUTH_RATE_LIMIT_REQUEST,
} = CONFIG;

export const appRateLimit = rateLimit({
  windowMs: APP_RATE_LIMIT_TIME * 1000,
  max: APP_RATE_LIMIT_REQUEST,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response, next: NextFunction) => {
    next(new RateLimitError('Rate limit superado', 'Demasiadas solicitudes a la API'));
  },
});

export const authRateLimit = rateLimit({
  windowMs: AUTH_RATE_LIMIT_TIME * 1000,
  max: AUTH_RATE_LIMIT_REQUEST,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response, next: NextFunction) => {
    next(
      new RateLimitError(
        'Rate limit superado',
        'Demasiadas solicitudes al servicio de autenticación'
      )
    );
  },
});
