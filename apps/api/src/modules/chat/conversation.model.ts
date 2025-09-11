import { Schema, model, Types } from 'mongoose';

export interface IConversation {
  _id: Types.ObjectId;
  isGroup: boolean;
  title?: string;
  participants: Types.ObjectId[];   // user ids
  createdBy: Types.ObjectId;        // user id
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    isGroup: { type: Boolean, default: false },
    title: { type: String, trim: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', index: true, required: true }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessageAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

// helpful indexes for sidebar queries
ConversationSchema.index({ participants: 1, lastMessageAt: -1 });
ConversationSchema.index({ updatedAt: -1 });

export const Conversation = model<IConversation>('Conversation', ConversationSchema);
