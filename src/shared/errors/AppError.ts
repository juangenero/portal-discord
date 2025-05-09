/**
 * Clase base para todos los errores de la aplicación.
 *
 * @extends Error
 * @property {string} name - Nombre de la clase para identificar el error.
 * @property {number} statusCode - Código de estado HTTP asociado al error.
 * @property {string} message - Mensaje de error.
 */
export class AppError extends Error {
  public statusCode: number;

  constructor(message: string = 'Error interno del servidor', statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
