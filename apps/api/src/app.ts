import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/auth.routes';

import { errorHandler, HttpError } from './middlewares/error';
import { requireAuth } from './middlewares/auth';
import { env } from './config/env';
import userRoutes from './modules/user/user.routes';
import chatRoutes from './modules/chat/chat.routes';



export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.webOrigin, credentials: true }));
  app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);



  // health check
  app.get('/health', (_req, res) => {
    res.json({ ok: true, ts: new Date().toISOString() });
  });

  // TEMP: route that throws a typed error (to test error middleware)
  app.get('/teapot', (_req, _res) => {
    throw new HttpError(418, "i'm a teapot");
  });

  // TEMP: protected route (to test auth middleware)
  app.get('/protected', requireAuth, (req, res) => {
    res.json({ ok: true, userId: req.userId });
  });

  // must be last
  app.use(errorHandler);
  return app;
}
