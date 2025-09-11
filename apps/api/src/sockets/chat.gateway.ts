import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { presence } from '../config/redis';
import { Message } from '../modules/chat/message.model';
import { Conversation } from '../modules/chat/conversation.model';

type AuthPayload = { sub: string };

// authenticate each socket connection using the **access** token
function socketAuth(socket: Socket, next: (err?: any) => void) {
  try {
    const token =
      (socket.handshake.auth?.token as string | undefined) ||
      (socket.handshake.headers.authorization?.toString().replace(/^Bearer\s+/i, '') ?? '');

    if (!token) return next(new Error('No token'));
    const { sub } = jwt.verify(token, env.jwt.accessSecret) as AuthPayload;
    (socket as any).userId = sub;
    next();
  } catch (e) {
    next(new Error('Unauthorized'));
  }
}

export function registerChatGateway(io: Server) {
  const nsp = io.of('/chat');
  nsp.use(socketAuth);

  nsp.on('connection', async (socket) => {
    const userId = (socket as any).userId as string;

    // mark online
    await presence.online(userId);
    nsp.emit('presence:users', { onlineUserIds: await presence.all() });

    // join a conversation "room" so we can broadcast to its participants only
    socket.on('conversation:join', ({ conversationId }) => {
      socket.join(`conv:${conversationId}`);
    });

    // leave room (optional)
    socket.on('conversation:leave', ({ conversationId }) => {
      socket.leave(`conv:${conversationId}`);
    });

    // typing indicator
    socket.on('message:typing', ({ conversationId, isTyping }) => {
      socket.to(`conv:${conversationId}`).emit('message:typing', { conversationId, userId, isTyping });
    });

    // send message
    socket.on('message:send', async ({ conversationId, body, attachments }) => {
      // guard: only allow if user is a participant
      const conv = await Conversation.findOne({ _id: conversationId, participants: userId });
      if (!conv) return; // silently drop or emit error back if you prefer

      const msg = await Message.create({
        conversationId,
        senderId: userId,
        body: body ?? '',
        attachments,
      });

      conv.lastMessageAt = msg.createdAt;
      await conv.save();

      // broadcast to conversation room (including sender)
      nsp.to(`conv:${conversationId}`).emit('message:new', msg.toObject());
    });

    // read receipts
    socket.on('message:read', async ({ conversationId, messageIds }) => {
      await Message.updateMany(
        { _id: { $in: messageIds } },
        { $addToSet: { reads: { userId, at: new Date() } } }
      );
      nsp.to(`conv:${conversationId}`).emit('message:read', { conversationId, userId, messageIds });
    });

    socket.on('disconnect', async () => {
      await presence.offline(userId);
      nsp.emit('presence:users', { onlineUserIds: await presence.all() });
    });
  });
}
