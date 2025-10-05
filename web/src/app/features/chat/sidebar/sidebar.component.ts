import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChatService, Conversation } from '../../../core/services/chat.service';
import { SocketService } from '../../../core/services/socket.service';
import { MockChat } from './chat.mock.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  private chat = inject(ChatService);
  private sockets = inject(SocketService);
  private http = inject(HttpClient);

  useMock = true;

  // For real data
  conversations = signal<Conversation[]>([]);
  selectedId = signal<string | null>(null);

  // For mock demo
  chats: MockChat[] = [];
  allChats: MockChat[] = [];
recentChats: MockChat[] = [];
pinnedChats: MockChat[] = [];

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    if (this.useMock) {
     this.http.get<MockChat[]>('assets/mock-chats.json').subscribe({
  next: (list) => {
    this.allChats = list;
    this.recentChats = list.filter(c => c.isRecent);
    this.pinnedChats = list.filter(c => c.isPinned);
  }
});

    } else {
      this.chat.listConversations().subscribe({
        next: (list) => this.conversations.set(list ?? []),
        error: (e) => console.error('Failed to load conversations', e),
      });
    }
  }
}


// export class SidebarComponent implements OnInit {

//    chats: any[] = [];

//   constructor(private http: HttpClient) {}



//   private chat = inject(ChatService);
//   private sockets = inject(SocketService);

//   conversations = signal<Conversation[]>([]);
//   selectedId = signal<string | null>(null);

//   ngOnInit() {
//     this.refresh();
//   }

//   refresh() {
//     this.chat.listConversations().subscribe({
//       next: (list) => this.conversations.set(list ?? []),
//       error: (e) => console.error('Failed to load conversations', e),
//     });
//   }

//   byId = (_: number, c: Conversation) => c._id;

//   names(c: Conversation): string {
//     const ps = c?.participants ?? [];
//     return ps.map(p => p?.name ?? p?.email ?? 'Unknown').join(', ');
//   }

//   newDm() {
//     const email = prompt('DM with which email?');
//     if (!email) return;
//     this.chat.createDmByEmail(email).subscribe({
//       next: (convo) => {
//         // add to list if not there
//         const exists = this.conversations().some(c => c._id === convo._id);
//         if (!exists) this.conversations.set([convo, ...this.conversations()]);
//       },
//       error: (e) => alert(e?.error?.error ?? 'Failed to create DM'),
//     });
//   }

//   select(c: Conversation) {
//     this.selectedId.set(c._id);
//     this.sockets.join(c._id); // join socket room so you’ll receive realtime messages
//   }
// }
