import { AppError } from './AppError';

/**
 * Clase para manejar errores de autorización (401)
 * Extiende la clase AppError.
 * @extends AppError
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Error de autorización') {
    super(message, 401);
    this.name = 'AuthorizationError';
    Error.captureStackTrace(this, AuthorizationError);
  }
}
