import { NextFunction, Request, Response } from 'express';
import Jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import CONFIG from '../../config/env.config';
import { PayloadJwt } from '../../modules/session/session.dto';
import { AuthorizationError } from '../errors/AuthorizationError';

const { SIGN_TOKEN_JWT } = CONFIG;

/**
 * Middleware para validar el JWT, extrae el token de la cabecera Authorization, lo verifica
 * y adjunta la información a la solicitud si el token es válido. Si no, devuelve un error 401.
 */
export function authHandler(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Separar "Bearer"
  // Check si existe token
  if (token == null) {
    return next(new AuthorizationError('No existe el token JWT'));
  }

  // Verificar token
  Jwt.verify(token, SIGN_TOKEN_JWT, (err, payload) => {
    console.log('payload -> ', payload);
    if (err) {
      if (err instanceof TokenExpiredError) {
        return next(new AuthorizationError('Token JWT expirado'));
      } else if (err instanceof JsonWebTokenError) {
        return next(new AuthorizationError('Token JWT no válido'));
      } else {
        return next(new AuthorizationError('Error al verificar el token JWT'));
      }
    }

    // Añadir payload del JWT a la solicitud
    req.payload = payload as PayloadJwt;

    next(); // Salir del middleware
  });
}
