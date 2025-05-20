import { AppError } from './AppError';

/**
 * Clase para manejar errores específicos de la API de Discord.
 * Extiende la clase AppError.
 * @extends AppError
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Error de validación', status: number = 400, details?: string) {
    super(message, status, details);
    this.name = 'ValidationError';
    Error.captureStackTrace(this, ValidationError);
  }
}
