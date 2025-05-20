import { NextFunction, Request, Response } from 'express';
import { ClientErrorResponse } from '../errors/error.dto';
import {
  AppError,
  AuthorizationError,
  DatabaseError,
  DiscordError,
  NotFoundError,
} from '../errors/error.index';
import { ValidationError } from '../errors/ValidationError';
import { generateNanoId } from '../utils/text/stringUtils';

/**
 * Middleware para manejar rutas no encontradas (404).
 * @param req - Objeto de solicitud de Express.
 * @param res - Objeto de respuesta de Express.
 * @param next - Función para pasar al siguiente middleware.
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  next(new NotFoundError('Ruta no encontrada'));
};

/**
 * Middleware para manejar errores de la aplicación.
 *
 * @param {Error} err - El error capturado.
 * @param {Request} req - Objeto de solicitud.
 * @param {Response} res - Objeto de respuesta.
 * @param {NextFunction} next - Siguiente middleware (En este caspo no se usa).
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  const { idUsuario, idSesion } = req.payload || {};
  const id = generateNanoId(20); // Generar un ID único para el error
  // ---------- Registro del error ----------
  console.error(
    '--------------------------------- Error Details ---------------------------------'
  );
  console.error(`id: ${id}`);
  console.error(`endpoint: ${req.method} ${req.originalUrl}`);
  console.error(`usuario/sesion: ${idUsuario} / ${idSesion}`);
  console.error(err.stack);
  console.error(
    '---------------------------------------------------------------------------------'
  );

  // ---------- Respuesta al cliente ----------

  // Error por defecto
  let clientResponse: ClientErrorResponse = {
    error: true,
    status: err instanceof AppError ? err.status : 500,
    message: 'Error interno del servidor',
    details: null,
    id: id,
  };

  // NotFoundError
  if (err instanceof NotFoundError) {
    clientResponse.message = err.message;

    // AuthorizationError
  } else if (err instanceof AuthorizationError) {
    clientResponse.message = 'No autorizado';

    // ValidationError
  } else if (err instanceof ValidationError) {
    clientResponse.message = err.message;
    clientResponse.details = err.details;

    // DiscordError
  } else if (err instanceof DiscordError) {
    clientResponse.message = 'Discord Error';

    // DatabaseError
  } else if (err instanceof DatabaseError) {
    clientResponse.message = 'Error en la base de datos';
  }

  res.status(clientResponse.status).json(clientResponse);
};
