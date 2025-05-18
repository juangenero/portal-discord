import { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
import CONFIG from '../../config/env.config';

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
    console.error('No existe el token JWT');
    res.sendStatus(401);
    return;
  }

  // Verificar token
  Jwt.verify(token, SIGN_TOKEN_JWT, (err, payload) => {
    if (err) {
      console.error('Token JWT no válido');
      res.sendStatus(401);
      return;
    }

    req.payloadJwt = payload;

    next(); // Salir del middleware
  });
}
