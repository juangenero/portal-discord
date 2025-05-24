import { AppError } from '../error-factory';

export type ErrorConstructor = new (
  message?: string,
  details?: string | null,
  status?: number
) => AppError;
