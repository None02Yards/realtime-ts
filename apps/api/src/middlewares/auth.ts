import { Request, Response, NextFunction } from 'express';
import { verifyAccess } from '../utils/jwt';
import { HttpError } from './error';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Missing or invalid Authorization header'));
  }

  const token = auth.slice(7);
  try {
    const { sub } = verifyAccess(token);
    req.userId = sub;
    return next();
  } catch {
    return next(new HttpError(401, 'Invalid or expired token'));
  }
}
