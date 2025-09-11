import { Schema, model, Types } from 'mongoose';

export interface IMessage {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  body: string;
  attachments?: { url: string; type: 'image' | 'file' }[];
  reads: { userId: Types.ObjectId; at: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    body: { type: String, default: '' },
    attachments: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ['image', 'file'], required: true },
      },
    ],
    reads: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        at: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

// fast chronological fetch within a conversation
MessageSchema.index({ conversationId: 1, createdAt: -1, _id: -1 });
// sender filter (analytics/moderation)
MessageSchema.index({ senderId: 1, createdAt: -1 });

export const Message = model<IMessage>('Message', MessageSchema);
