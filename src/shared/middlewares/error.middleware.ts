import { NextFunction, Request, Response } from 'express';
import {
  AppError,
  AuthorizationError,
  PathNotFound,
  RateLimitError,
  ValidationError,
} from '../errors/error-factory';
import { ResponseErrorClientDto } from '../errors/types/error.dto';
import log from '../utils/log/logger';
import { generateNanoId } from '../utils/other/string.utils';

/**
 * Middleware para manejar rutas no encontradas (404).
 * @param req - Objeto de solicitud de Express.
 * @param res - Objeto de respuesta de Express.
 * @param next - Función para pasar al siguiente middleware.
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  next(new PathNotFound());
};

/**
 * Middleware para manejar errores de la aplicación.
 * @param {Error} err - El error capturado.
 * @param {Request} req - Objeto de solicitud.
 * @param {Response} res - Objeto de respuesta.
 * @param {NextFunction} next - Siguiente middleware (En este caspo no se usa).
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  const isAppError = err instanceof AppError;
  const id = generateNanoId(20); // Generar un ID único para el error
  const { idUsuario, idSesion } = req.payload || {};
  const sesionInfo = idUsuario && idSesion ? `${idUsuario} / ${idSesion}` : 'No autenticado';
  const detailsInfo = isAppError ? `detalles: ${err.details}` : undefined;

  // ---------- Registro del error ----------
  const logResponse = `
  --------------------------------- Error Details ---------------------------------
  id: ${id}
  endpoint: ${req.method} ${req.originalUrl}
  usuario/sesion: ${sesionInfo}
  ${detailsInfo}
  
  ${err.stack}
  ---------------------------------------------------------------------------------
  `;
  log.error(logResponse);

  // ---------- Respuesta al cliente ----------

  // Respuesta por defecto
  const clientResponse: ResponseErrorClientDto = {
    error: true,
    status: isAppError ? err.status : 500,
    message: 'Error interno del servidor',
    details: isAppError ? err.details : null,
    id: id,
  };

  // Manejar principalmente el "message" del error enviado al cliente

  // AuthorizationError
  if (err instanceof AuthorizationError) {
    clientResponse.message = 'No autorizado';
  }

  // PathNotFound
  else if (err instanceof PathNotFound) {
    clientResponse.message = 'Ruta no encontrada';
  }

  // ValidationError
  else if (err instanceof ValidationError) {
    clientResponse.message = err.message;
  }

  // RateLimitError
  else if (err instanceof RateLimitError) {
    clientResponse.message = err.message;
  }

  res.status(clientResponse.status).json(clientResponse);
};
