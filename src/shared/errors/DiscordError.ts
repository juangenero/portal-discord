import { AppError } from './AppError';

/**
 * Clase para manejar errores específicos de la API de Discord.
 * Extiende la clase AppError.
 * @extends AppError
 */
export class DiscordError extends AppError {
  constructor(message: string = 'Error en discord') {
    super(message);
    this.name = 'DiscordError';
    Error.captureStackTrace(this, DiscordError);
  }
}
