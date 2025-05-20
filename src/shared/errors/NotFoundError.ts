import { AppError } from './AppError';

/**
 * Clase para manejar errores de rutas no encotrada (404).
 * Extiende la clase AppError.
 * @extends AppError
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404);
    this.name = 'NotFoundError';
    Error.captureStackTrace(this, NotFoundError);
  }
}
