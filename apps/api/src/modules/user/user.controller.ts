import { Request, Response, NextFunction } from 'express';
import { User } from './user.model';
import { HttpError } from '../../middlewares/error';

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.userId) throw new HttpError(401, 'Unauthorized');
    const user = await User.findById(req.userId).select('name email avatarUrl updatedAt createdAt');
    if (!user) throw new HttpError(404, 'User not found');
    res.json({ user });
  } catch (e) { next(e); }
}

/** Optional: lightweight profile update (name, avatarUrl) */
export async function updateMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.userId) throw new HttpError(401, 'Unauthorized');
    const { name, avatarUrl } = req.body ?? {};
    const patch: any = {};
    if (typeof name === 'string') patch.name = name;
    if (typeof avatarUrl === 'string') patch.avatarUrl = avatarUrl;

    const user = await User.findByIdAndUpdate(req.userId, patch, { new: true })
      .select('name email avatarUrl updatedAt');
    res.json({ user });
  } catch (e) { next(e); }
}

/** Optional: user search for starting DMs (by name/email) */
export async function searchUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const q = (req.query.q as string)?.trim();
    if (!q) return res.json({ users: [] });
    const users = await User.find({
      $or: [
        { name:  { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ]
    }).select('name email avatarUrl').limit(20);
    res.json({ users });
  } catch (e) { next(e); }
}
