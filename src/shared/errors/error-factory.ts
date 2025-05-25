import { ErrorConstructor } from './types/error.types';

/**
 * Clase base para todos los errores de la aplicación.
 *
 * @extends Error
 * @property {string} name - Nombre de la clase para identificar el error.
 * @property {number} statusCode - Código de estado HTTP asociado al error.
 * @property {string} message - Mensaje de error.
 */
export class AppError extends Error {
  public status: number; // Código de estado HTTP
  public details: string | null; // Mensaje que se enviará siempre al cliente

  constructor(
    message: string = 'Error interno del servidor',
    details: string | null = null,
    status: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Fabrica para crear errores personalizados de la aplicación.
 * @param errorName Nombre del error
 * @param defaultMessage Mensaje por defecto
 * @param defaultStatus Código de estado por defecto
 * @returns {AppErrorConstructor} Constructor de la clase de error personalizada
 */
function createAppError(
  errorName: string,
  defaultMessage: string = 'Error interno del servidor',
  defaultStatus: number
): ErrorConstructor {
  class CustomAppError extends AppError {
    constructor(
      message: string = defaultMessage,
      details: string | null = null,
      status: number = defaultStatus
    ) {
      super(message, details, status !== undefined ? status : defaultStatus);
      this.name = errorName;
      Error.captureStackTrace(this, CustomAppError);
    }
  }
  Object.defineProperty(CustomAppError, 'name', { value: errorName }); // Nombre de la clase
  return CustomAppError;
}

// ------------------ Errores de la aplicación ------------------

/**
 * Parámetros del constructor de erroes:
 * - errorName: Nombre del error
 * - defaultMessage: Mensaje por defecto
 * - defaultStatus: Código de estado HTTP por defecto
 */

// Errores del cliente
export const ValidationError = createAppError('ValidationError', 'Error al validar los datos', 400);
export const AuthorizationError = createAppError('AuthorizationError', 'No autorizado', 401);
export const ForbiddenError = createAppError('ForbiddenError', 'Permisos insuficientes', 403);
export const PathNotFound = createAppError('PathNotFound', 'Ruta no encontrada', 404);
export const NotFoundError = createAppError('NotFoundError', 'Recurso no encontrado', 404);
export const RateLimitError = createAppError('RateLimitError', 'Rate limit superado', 429);

// Errores del servidor
export const DiscordApiError = createAppError('DiscordApiError', 'Error en la API de Discord', 500);
export const IpApiError = createAppError('IpApiError', 'Error en la API de IPs', 500);
export const DatabaseError = createAppError('DatabaseError', 'Error en la base de datos', 500);
export const SessionError = createAppError('SessionError', 'Error al manejar la sesión', 500);
export const UtilsError = createAppError('UtilsError', 'Error en Utils', 500);
