import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';

export type Conversation = {
  _id: string;
  participants: { _id: string; name: string; email: string }[];
  lastMessage?: { body: string; createdAt: string };
};

export type Message = {
  _id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
};

@Injectable({ providedIn: 'root' })
export class ChatService {
  private api = inject(ApiService);

  listConversations() {
    return this.api.get<Conversation[]>('/chat');
  }

  listMessages(convoId: string, cursor?: string) {
    const qs = cursor ? `?cursor=${cursor}` : '';
    return this.api.get<Message[]>(`/chat/${convoId}/messages${qs}`);
  }

  sendMessage(convoId: string, body: string) {
    return this.api.post<Message>(`/chat/${convoId}/messages`, { body });
  }

  createDmByEmail(email: string) {
  return this.api.post<any>('/chat/dm', { email });
}

}

