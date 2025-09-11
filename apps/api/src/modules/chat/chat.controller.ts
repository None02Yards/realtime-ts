// apps/api/src/modules/chat/chat.controller.ts
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Conversation } from './conversation.model';
import { Message } from './message.model';
import { User } from '../user/user.model';
import { HttpError } from '../../middlewares/error';
import { decodeCursor, encodeCursor } from '../../utils/pagination';

/** GET /api/chats — list my conversations (latest first) */
export async function myConversations(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const convs = await Conversation.find({ participants: userId })
      .sort({ lastMessageAt: -1, _id: -1 })
      .limit(50)
      .populate('participants', '_id name email')
      .lean();

    res.json({ conversations: convs });
  } catch (e) { next(e); }
}

/** POST /api/chats — create (or reuse) a 1:1 DM by peerId */
export async function createDM(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const { peerId } = (req.body || {}) as { peerId?: string };
    if (!peerId) throw new HttpError(400, 'peerId required');
    if (!mongoose.isValidObjectId(peerId)) throw new HttpError(400, 'Invalid peerId');

    // reuse if exists
    let conv = await Conversation.findOne({
      isGroup: { $in: [false, null] },
      participants: { $all: [userId, peerId], $size: 2 },
    });

    if (!conv) {
      conv = await Conversation.create({
        isGroup: false,
        participants: [userId, peerId],
        createdBy: userId,
        lastMessageAt: new Date(),
      });
    }

    const populated = await Conversation.findById(conv._id)
      .populate('participants', '_id name email')
      .lean();

    res.status(201).json({ conversation: populated });
  } catch (e) { next(e); }
}

/** POST /api/chats/dm — create (or reuse) a 1:1 DM by other user's email */
export async function createDmByEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const meId = req.userId!;
    const { email } = (req.body || {}) as { email?: string };
    if (!email) throw new HttpError(400, 'email is required');

    const other = await User.findOne({ email: email.toLowerCase() }).lean();
    if (!other) throw new HttpError(404, 'User not found');

    if (String(other._id) === String(meId)) {
      throw new HttpError(400, 'Cannot DM yourself');
    }

    let conv = await Conversation.findOne({
      isGroup: { $in: [false, null] },
      participants: { $all: [meId, other._id], $size: 2 },
    });

    if (!conv) {
      conv = await Conversation.create({
        isGroup: false,
        participants: [meId, other._id],
        createdBy: meId,
        lastMessageAt: new Date(),
      });
    }

    const populated = await Conversation.findById(conv._id)
      .populate('participants', '_id name email')
      .lean();

    res.status(201).json({ conversation: populated });
  } catch (e) { next(e); }
}

/** GET /api/chats/:id/messages?cursor=...&limit=30 — paginated (oldest→newest in response) */
export async function listMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const limitParam = Number(req.query.limit ?? 30);
    const limit = Number.isFinite(limitParam) ? Math.min(limitParam, 100) : 30;
    const cur = decodeCursor((req.query.cursor as string) || undefined);

    // ensure user is in conversation
    const conv = await Conversation.findOne({ _id: id, participants: userId }).lean();
    if (!conv) throw new HttpError(404, 'Conversation not found');

    const q: any = { conversationId: id };
    if (cur) {
      q.$or = [
        { createdAt: { $lt: new Date(cur.createdAt) } },
        { createdAt: new Date(cur.createdAt), _id: { $lt: cur._id } },
      ];
    }

    const docs = await Message.find(q)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .lean();

    const last = docs.length ? docs[docs.length - 1] : null;
    const nextCursor = last
      ? encodeCursor(last.createdAt as Date, String(last._id))
      : null;

    // return oldest→newest for UI append
    res.json({ messages: docs.reverse(), nextCursor });
  } catch (e) { next(e); }
}

/** POST /api/chats/:id/messages — send message via REST (sockets can mirror later) */
export async function sendMessageREST(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { body, attachments } = (req.body || {}) as { body?: string; attachments?: any[] };
    if (!body && !(attachments?.length)) throw new HttpError(400, 'Message body or attachments required');

    // ensure user is in conversation
    const conv = await Conversation.findOne({ _id: id, participants: userId });
    if (!conv) throw new HttpError(404, 'Conversation not found');

    const msg = await Message.create({
      conversationId: id,
      senderId: userId,
      body: body ?? '',
      attachments,
    });

    // bump last activity for sorting
    conv.lastMessageAt = msg.createdAt;
    await conv.save();

    res.status(201).json({ message: msg });
  } catch (e) { next(e); }
}
