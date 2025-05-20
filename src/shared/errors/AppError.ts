/**
 * Clase base para todos los errores de la aplicación.
 *
 * @extends Error
 * @property {string} name - Nombre de la clase para identificar el error.
 * @property {number} statusCode - Código de estado HTTP asociado al error.
 * @property {string} message - Mensaje de error.
 */
export class AppError extends Error {
  public status: number;
  public details?: string;

  constructor(
    message: string = 'Error interno del servidor',
    status: number = 500,
    details?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
