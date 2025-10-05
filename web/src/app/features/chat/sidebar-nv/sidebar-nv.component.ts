import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-sidebar-nv',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-nv.component.html',
  styleUrls: ['./sidebar-nv.component.scss'],
})
export class SidebarNvComponent {
  private router = inject(Router);

  currentUrl = signal<string>(this.router.url);
  constructor() {
    this.router.events.subscribe(() => this.currentUrl.set(this.router.url));
  }

  isActive = (path: string) =>
    computed(() => this.currentUrl().startsWith(path));

    private sanitizer = inject(DomSanitizer);

 items = [
    { key: 'people',   title: 'People',   path: '/chat/people'   },
    { key: 'groups',   title: 'Groups',   path: '/chat/groups'   },
    { key: 'status',   title: 'Status',   path: '/chat/status'   },
    { key: 'calls',    title: 'Calls',    path: '/chat/calls'    },
    { key: 'profile',  title: 'Profile',  path: '/chat/profile'  },
    { key: 'settings', title: 'Settings', path: '/chat/settings' },
  ];

  private svgPaths: Record<string, string> = {
    people:
      '<path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3Zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm8 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C23 14.17 18.33 13 16 13Zm-8 0c-.29 0-.62.02-.97.05C5.21 13.25 3 14.1 3 15.5V19h6v-2.5c0-1.05.61-1.94 1.55-2.61C9.88 13.34 8.9 13 8 13Z"/>',
    groups:
      '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm6 1h-1.26A8.96 8.96 0 0 0 12 11c-1.98 0-3.8.64-5.26 1.73H5a3 3 0 0 0-3 3V19h20v-2a3 3 0 0 0-3-3Z"/>',
    status:
      '<circle cx="12" cy="12" r="3" fill="currentColor"/><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/>',
    calls:
      '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.89.3 1.76.54 2.6a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.84.24 1.71.42 2.6.54A2 2 0 0 1 22 16.92Z"/>',
    profile:
      '<path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6Z"/>',
    settings:
      '<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm8.94 4a7.89 7.89 0 0 0-.14-1.5l2.11-1.65-2-3.46-2.49 1a7.91 7.91 0 0 0-2.6-1.5l-.39-2.65h-4l-.39 2.65a7.91 7.91 0 0 0-2.6 1.5l-2.49-1-2 3.46 2.11 1.65A7.89 7.89 0 0 0 3.06 12a7.89 7.89 0 0 0 .14 1.5L1.09 15.15l2 3.46 2.49-1a7.91 7.91 0 0 0 2.6 1.5l.39 2.65h4l.39-2.65a7.91 7.91 0 0 0 2.6-1.5l2.49 1 2-3.46-2.11-1.65c.09-.49.14-1 .14-1.5Z"/>',
  };

  icon(key: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.svgPaths[key] ?? '');
  }



  // theme toggle demo
  dark = signal(false);
  toggleTheme() {
    this.dark.update(v => !v);
    document.documentElement.classList.toggle('dark', this.dark());
  }

  // avatar (replace with user’s)
  avatarUrl = 'assets/avatars/avatar-1.jpg';
}
