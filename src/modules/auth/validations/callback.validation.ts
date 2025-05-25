import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { ValidationError } from '../../../shared/errors/error-factory';

// 1. Esquema para req.body (code y code_verifier)
export const callbackBodySchema = z.object({
  code: z
    .string({
      required_error: 'El campo code es requerido',
      invalid_type_error: 'El campo code debe ser una cadena de texto',
    })
    .min(1, 'El campo code no puede estar vacío'),
  code_verifier: z
    .string({
      required_error: 'El campo code_verifier es requerido',
      invalid_type_error: 'El campo code_verifier debe ser una cadena de texto',
    })
    .min(1, 'El campo code_verifier no puede estar vacío'),
});

// 2. Middleware de validación para el cuerpo de la petición (req.body)
export const validateCallbackBody = (req: Request, res: Response, next: NextFunction) => {
  try {
    callbackBodySchema.parse(req.body);
    next();
  } catch (error) {
    // Capturar error de Zod y lanzar ValidationError
    if (error instanceof ZodError) {
      const validationErrors = error.errors.map((err) => err.message);
      const detailsString = validationErrors.join('; ');

      throw new ValidationError(
        'Error al validar el cuerpo de la solicitud',
        detailsString
        // JSON.stringify(validationErrors)
      );
    }
    next(error); // Pasa otros errores inesperados al siguiente manejador de errores
  }
};
