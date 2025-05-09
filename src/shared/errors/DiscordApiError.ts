import { AppError } from './AppError';

/**
 * Clase para manejar errores específicos de la API de Discord.
 * Extiende la clase AppError.
 * @extends AppError
 */
export class DiscordAPIError extends AppError {
  constructor(message: string = 'Discord API error') {
    super(message);
  }
}
