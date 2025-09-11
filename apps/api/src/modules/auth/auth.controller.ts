import { Request, Response, NextFunction } from 'express';
import { SignupSchema, LoginSchema } from './auth.schemas';
import { validate } from '../../utils/validate';
import { User } from '../user/user.model';
import { hashPassword, comparePassword } from '../../utils/hashing';
import { signAccess, signRefresh } from '../../utils/jwt';
import { HttpError } from '../../middlewares/error';

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = validate(SignupSchema, req.body);
    const exists = await User.findOne({ email });
    if (exists) throw new HttpError(409, 'Email already registered');

    const user = await User.create({
      name,
      email,
      passwordHash: await hashPassword(password),
    });

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl ?? null },
    });
  } catch (e) { next(e); }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = validate(LoginSchema, req.body);
    const user = await User.findOne({ email });
    if (!user) throw new HttpError(401, 'Invalid credentials');

    const ok = await comparePassword(password, (user as any).passwordHash);
    if (!ok) throw new HttpError(401, 'Invalid credentials');

    const access  = signAccess(user.id);
    const refresh = signRefresh(user.id);

    res.json({
      access,
      refresh,
      user: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl ?? null },
    });
  } catch (e) { next(e); }
}
