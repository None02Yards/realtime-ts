// apps/api/src/modules/chat/chat.routes.ts
import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth';
import {
  myConversations,        // GET /api/chat
  createDM,               // POST /api/chat           -> create/reuse DM by participant IDs (if you already have this)
  createDmByEmail,        // POST /api/chat/dm        -> create/reuse DM by other user's email
  listMessages,           // GET  /api/chat/:id/messages
  sendMessageREST,        // POST /api/chat/:id/messages
} from './chat.controller';

const r = Router();

// all chat routes require auth
r.use(requireAuth);

// conversations (sidebar)
r.get('/', myConversations);

// create/reuse a DM
// - if you already support creating by user IDs, keep this:
r.post('/', createDM);

// create/reuse a DM by the other user's email: { email: string }
r.post('/dm', createDmByEmail);

// messages
r.get('/:id/messages', listMessages);        // history with cursor pagination (?cursor=msgId)
r.post('/:id/messages', sendMessageREST);    // send message (REST)

export default r;
