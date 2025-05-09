import { AppError } from './AppError';

/**
 * Clase para manejar errores de rutas no encotrada (404).
 * Extiende la clase AppError.
 * @extends AppError
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Ruta no encontrada') {
    super(message, 404);
  }
}
