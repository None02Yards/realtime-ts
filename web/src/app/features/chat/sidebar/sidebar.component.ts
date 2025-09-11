import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService, Conversation } from '../../../core/services/chat.service';
import { SocketService } from '../../../core/services/socket.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sidebar">
      <div class="header">
        <h3>Conversations</h3>
        <button type="button" (click)="newDm()">New DM</button>
      </div>

      <ul>
        <li *ngFor="let c of conversations(); trackBy: byId">
          <button type="button" class="item" (click)="select(c)">
            <strong>{{ names(c) }}</strong><br>
            <small *ngIf="c.lastMessage">{{ c.lastMessage.body }}</small>
          </button>
        </li>
      </ul>

      <p *ngIf="!conversations().length" class="empty">No conversations yet.</p>
    </div>
  `,
  styles: [`
    .sidebar { padding: 1rem; border-right: 1px solid #eee; min-width: 260px; height: 100vh; overflow:auto; }
    .header { display:flex; align-items:center; justify-content:space-between; margin-bottom:.75rem }
    .header button{ padding:.4rem .6rem; border:1px solid #ddd; background:#fff; border-radius:6px; cursor:pointer }
    ul { list-style: none; padding: 0; margin: 0; }
    li { margin-bottom: .5rem; }
    .item { width: 100%; text-align: left; background: transparent; border: 0; padding: .5rem; border-radius: 8px; cursor: pointer; }
    .item:hover { background: #f3f4f6; }
    .empty { color: #6b7280; }
  `]
})
export class SidebarComponent implements OnInit {
  private chat = inject(ChatService);
  private sockets = inject(SocketService);

  conversations = signal<Conversation[]>([]);
  selectedId = signal<string | null>(null);

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.chat.listConversations().subscribe({
      next: (list) => this.conversations.set(list ?? []),
      error: (e) => console.error('Failed to load conversations', e),
    });
  }

  byId = (_: number, c: Conversation) => c._id;

  names(c: Conversation): string {
    const ps = c?.participants ?? [];
    return ps.map(p => p?.name ?? p?.email ?? 'Unknown').join(', ');
  }

  newDm() {
    const email = prompt('DM with which email?');
    if (!email) return;
    this.chat.createDmByEmail(email).subscribe({
      next: (convo) => {
        // add to list if not there
        const exists = this.conversations().some(c => c._id === convo._id);
        if (!exists) this.conversations.set([convo, ...this.conversations()]);
      },
      error: (e) => alert(e?.error?.error ?? 'Failed to create DM'),
    });
  }

  select(c: Conversation) {
    this.selectedId.set(c._id);
    this.sockets.join(c._id); // join socket room so you’ll receive realtime messages
  }
}
