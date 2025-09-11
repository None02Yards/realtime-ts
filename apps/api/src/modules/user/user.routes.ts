import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth';
import { me, updateMe, searchUsers } from './user.controller';

const r = Router();

r.use(requireAuth);              // all routes below require a valid access token
r.get('/me', me);
r.patch('/me', updateMe);        // optional
r.get('/search', searchUsers);   // optional ?q=yard

export default r;
