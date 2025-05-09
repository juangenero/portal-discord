import { AppError } from './AppError';

/**
 * Clase para manejar errores de la base de datos.
 * Extiende la clase AppError.
 * @extends AppError
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Database error') {
    super(message);
  }
}
