

import { Component, ElementRef, HostListener, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

type NavMode = 'full' | 'logo' | 'none';     // full = menu+cta, logo = brand only, none = hide whole bar
type NavSkin = 'overlay' | 'solid';          // overlay over hero, solid for inner pages

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private host  = inject(ElementRef<HTMLElement>);
  auth = inject(AuthService);

  // UI state
  isOpen = signal(false);
  mode   = signal<NavMode>('full');     // will be set from route
  skin   = signal<NavSkin>('overlay');  // overlay on hero, solid elsewhere

  // helpers for template
  showBar   = computed(() => this.mode() !== 'none');
  logoOnly  = computed(() => this.mode() === 'logo');
  isOverlay = computed(() => this.skin() === 'overlay');

  constructor() {
    // initial decide + on every navigation
    const decide = () => {
      const { mode, skin } = this.readNavPrefsFromRoute();
      this.mode.set(mode);
      this.skin.set(skin);
    };

    decide();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(decide);

    // expose bar height as CSS var (for page offsets if needed)
    effect(() => {
      const el = this.host.nativeElement.querySelector('.navbar') as HTMLElement | null;
      if (el) document.body.style.setProperty('--navbar-h', `${el.getBoundingClientRect().height}px`);
    });
  }

  // Central logic: prefer route data, else fall back to URL rules
  private readNavPrefsFromRoute(): { mode: NavMode; skin: NavSkin } {
    // get deepest active route
    let r: ActivatedRoute = this.route;
    while (r.firstChild) r = r.firstChild;

    // 1) Route data knobs (recommended)
    const data = r.snapshot.data as any;
    const dataMode = (data?.nav as NavMode) ??
                     (data?.noNav ? 'none' : undefined) ??
                     (data?.logoOnly ? 'logo' : undefined);
    const dataSkin = (data?.navSkin as NavSkin);

    // 2) URL-based defaults (no changes needed in routes)
    const url = this.router.url;
    const urlMode: NavMode | undefined =
      /^\/(?:$|landing$)/.test(url) ? 'logo' :         // landing: logo-only
      undefined;

    const urlSkin: NavSkin | undefined =
      /^\/(?:$|landing$)/.test(url) ? 'overlay' :      // hero pages
      'solid';                                         // inner pages default

    return {
      mode:  dataMode ?? urlMode ?? 'full',
      skin:  dataSkin ?? urlSkin ?? 'solid',
    };
  }

  // interactions
  toggleMenu() { this.isOpen.update(v => !v); }
  closeMenu()  { this.isOpen.set(false); }
  logout()     { this.auth.logout(); this.router.navigateByUrl('/login'); }

  // a11y niceties
  @HostListener('document:keydown.escape') onEsc() { this.closeMenu(); }
  @HostListener('document:click', ['$event']) onDocClick(ev: MouseEvent) {
    if (!this.isOpen()) return;
    if (!this.host.nativeElement.contains(ev.target as Node)) this.closeMenu();
  }
}
