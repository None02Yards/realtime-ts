import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket?: Socket;
  private auth = inject(AuthService);

  connect() {
    const token = this.auth.accessTokenSig();
    if (!token || this.socket?.connected) return;
    this.socket = io('/chat', { auth: { token } }); // proxied via proxy.conf.json
  }
  disconnect() {
    this.socket?.disconnect();
    this.socket = undefined;
  }

  join(conversationId: string) {
    this.socket?.emit('conversation:join', { conversationId });
  }
  send(conversationId: string, body: string) {
    this.socket?.emit('message:send', { conversationId, body });
  }
  emitTyping(conversationId: string, isTyping: boolean) {
    this.socket?.emit('message:typing', { conversationId, isTyping });
  }

  onMessageNew(): Observable<any> {
    return new Observable((sub) => {
      const h = (m: any) => sub.next(m);
      this.socket?.on('message:new', h);
      return () => this.socket?.off('message:new', h);
    });
  }
  onTyping(): Observable<any> {
    return new Observable((sub) => {
      const h = (t: any) => sub.next(t);
      this.socket?.on('message:typing', h);
      return () => this.socket?.off('message:typing', h);
    });
  }
}
