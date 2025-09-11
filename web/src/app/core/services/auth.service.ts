// import { Injectable, signal, computed, inject } from '@angular/core';
// import { ApiService } from './api.service';

// type User = { id: string; name: string; email: string; avatarUrl?: string | null };

// const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private api = inject(ApiService);
//   private accessKey = 'rc_access';

//   userSig = signal<User | null>(null);
//   accessTokenSig = signal<string | null>(isBrowser ? localStorage.getItem(this.accessKey) : null);
//   isAuthed = computed(() => !!this.accessTokenSig());

//   setAccess(token: string | null) {
//     this.accessTokenSig.set(token);
//     if (!isBrowser) return;
//     if (token) localStorage.setItem(this.accessKey, token);
//     else localStorage.removeItem(this.accessKey);
//   }

//   signup(data: { name: string; email: string; password: string }) {
//     return this.api.post<{ user: User }>('/auth/signup', data);
//   }
//   login(data: { email: string; password: string }) {
//     return this.api.post<{ access: string; refresh: string; user: User }>('/auth/login', data);
//   }
//   me() { return this.api.get<{ user: User }>('/users/me'); }
//   logout() { this.setAccess(null); this.userSig.set(null); }
// }

import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

type User = { id: string; name: string; email: string; avatarUrl?: string | null };

const isBrowser =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

// 🔧 If your backend is same-origin under /api, keep this.
// If your ApiService proxies differently, adjust to '' or your prefix.
const API_PREFIX = '/api';

// Optional: centralize the OAuth provider endpoint path
const GOOGLE_OAUTH_PATH = '/auth/google';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private accessKey = 'rc_access';

  userSig = signal<User | null>(null);
  accessTokenSig = signal<string | null>(
    isBrowser ? localStorage.getItem(this.accessKey) : null
  );
  isAuthed = computed(() => !!this.accessTokenSig());

  setAccess(token: string | null) {
    this.accessTokenSig.set(token);
    if (!isBrowser) return;
    if (token) localStorage.setItem(this.accessKey, token);
    else localStorage.removeItem(this.accessKey);
  }

  // ---------- Core REST ----------
  signup(data: { name: string; email: string; password: string }) {
    // Your current behavior: returns { user }, component navigates to /login
    return this.api.post<{ user: User }>('/auth/signup', data);
  }

  login(data: { email: string; password: string }) {
    return this.api
      .post<{ access: string; refresh: string; user: User }>('/auth/login', data)
      .pipe(
        // optional: store token here automatically (keeps old behavior if caller already does it)
        tap((res) => {
          if (res?.access) this.setAccess(res.access);
          if (res?.user) this.userSig.set(res.user);
        })
      );
  }

  me() {
    return this.api.get<{ user: User }>('/users/me').pipe(
      tap((res) => res?.user && this.userSig.set(res.user))
    );
  }

  logout() {
    this.setAccess(null);
    this.userSig.set(null);
  }

  // ---------- OAuth: Google ----------
  /**
   * Compose the backend OAuth start URL.
   * Backend should handle Google redirect and finally send user back to:
   *   `${origin}/oauth/callback?access=...`  (or ?error=...)
   */
  private oauthStartUrl(providerPath: string, flow: 'signup' | 'login') {
    const origin = isBrowser ? window.location.origin : '';
    const redirectUri = `${origin}/oauth/callback`;
    // e.g. /api/auth/google?redirect_uri=...&flow=signup
    return `${API_PREFIX}${providerPath}?redirect_uri=${encodeURIComponent(
      redirectUri
    )}&flow=${flow}`;
  }

  /** Begin Google OAuth with signup intent (what your SignupComponent expects). */
  signupWithGoogle() {
    if (!isBrowser) return;
    const url = this.oauthStartUrl(GOOGLE_OAUTH_PATH, 'signup');
    window.location.assign(url);
  }

  /** Optional alias for a login flow button (if you use it elsewhere). */
  loginWithGoogle() {
    if (!isBrowser) return;
    const url = this.oauthStartUrl(GOOGLE_OAUTH_PATH, 'login');
    window.location.assign(url);
  }

  /**
   * Handle `GET /oauth/callback` in the SPA:
   * Reads `?access=...` and stores it; also returns structured info.
   * Call this from a tiny OAuthCallbackComponent.
   */
  handleOAuthCallbackFromURL(
    href?: string
  ): { ok: boolean; error?: string; access?: string } {
    if (!isBrowser) return { ok: false, error: 'Not in browser' };
    const u = new URL(href ?? window.location.href);
    const err = u.searchParams.get('error');
    const access = u.searchParams.get('access');

    if (err) {
      this.setAccess(null);
      return { ok: false, error: err };
    }
    if (access) {
      this.setAccess(access);
      return { ok: true, access };
    }
    return { ok: false, error: 'Missing access token' };
  }
}
