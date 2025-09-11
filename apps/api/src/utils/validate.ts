import { ZodSchema } from 'zod';
import { HttpError } from '../middlewares/error';

export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new HttpError(400, 'Validation error', parsed.error.flatten());
  }
  return parsed.data;
}
