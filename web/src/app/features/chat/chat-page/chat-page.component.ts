// web/src/app/features/chat/chat-page/chat-page.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SidebarNvComponent } from '../sidebar-nv/sidebar-nv.component';
import { AuthService } from '../../../core/services/auth.service';
import { SocketService } from '../../../core/services/socket.service';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule, SidebarComponent, SidebarNvComponent],
  template: `
    <div class="layout">
      <app-sidebar-nv></app-sidebar-nv>

      <app-sidebar></app-sidebar>

      <div class="main">
        <header class="topbar">
          <h2 class="title">Chat</h2>
          <button class="logout" type="button" (click)="logout()">Logout</button>
        </header>

        <div class="content">
          <p>You're logged in. Select or create a conversation from the left.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .layout { display: flex; height: 100vh; }
    .main { flex: 1; display: flex; flex-direction: column; }
    .topbar {
      height: 56px; display: flex; align-items: center; justify-content: space-between;
      padding: 0 16px; border-bottom: 1px solid #eee;
    }
    .title { margin: 0; font-size: 18px; }
    .logout {
      padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px; background: #fff; cursor: pointer;
    }
    .logout:hover { background: #f9fafb; }
    .content { padding: 16px; overflow: auto; }
  `]
})
export class ChatPageComponent {
  private auth = inject(AuthService);
  private sockets = inject(SocketService);
  private router = inject(Router);

  logout() {
    this.sockets.disconnect();
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
