import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { ValidationError } from '../../../shared/errors/error-factory';

// 1. Esquema para URL params (idSesion)
export const deleteSessionParamsSchema = z.object({
  idSesion: z
    .string({
      required_error: 'El ID de la sesión es requerido en la URL',
      invalid_type_error: 'El ID de la sesión debe ser una cadena de texto',
    })
    .uuid('El ID de la sesión debe tener un formato válido'),
});

// 2. Middleware de validación para los paráemtros URL de la petición
export const validateDeleteSessionParams = (req: Request, res: Response, next: NextFunction) => {
  try {
    deleteSessionParamsSchema.parse(req.params);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const validationErrors = error.errors.map((err) => err.message);
      const detailsString = validationErrors.join('; ');

      throw new ValidationError(
        'Error al validar la sesión recibida en la solicitud',
        detailsString
        // JSON.stringify(validationErrors)
      );
    }

    next(error);
  }
};
