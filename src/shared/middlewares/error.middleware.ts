import { NextFunction, Request, Response } from 'express';
import { AppError, DiscordAPIError } from '../errors';
import { DatabaseError } from '../errors/DatabaseError';
import { NotFoundError } from '../errors/NotFoundError';
import { ClientErrorResponse } from '../errors/error.dto';

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
  // 1. Registro del error
  console.error('-------------------------- Error Details --------------------------');
  console.error(`Request URL: ${req.method} ${req.originalUrl}`);
  console.error(err.stack);
  console.error('-------------------------------------------------------------------');

  // 2. Respuesta al cliente
  const statusCode: number = err instanceof AppError ? err.statusCode : 500;

  let clientResponse: ClientErrorResponse = {
    error: true,
    status: statusCode,
    message: 'Ocurrió un error interno en el servidor',
  };

  if (err instanceof NotFoundError) {
    clientResponse.message = err.message;
  } else if (err instanceof DiscordAPIError) {
    clientResponse.message = 'Error al comunicarse de Discord';
  } else if (err instanceof DatabaseError) {
    clientResponse.message = 'Error en la base de datos';
  }

  res.status(statusCode).json(clientResponse);
};
