import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { SocketService } from '../../../core/services/socket.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private socket = inject(SocketService);

  email = '';
  password = '';
  remember = true;
  showPw = false;
  loading = false;

  error = signal<string | null>(null);

  onSubmit() {
    if (this.loading) return;

    // quick client-side guard (optional)
    if (!this.email || !this.password) {
      this.error.set('Please fill in your email and password.');
      return;
    }

    this.loading = true;
    this.error.set(null);

    this.auth
      .login({ email: this.email.trim(), password: this.password })
      .pipe(take(1), finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
this.auth.setAccess(res.access);
          this.auth.userSig.set(res.user);
          this.socket.connect();
          this.router.navigateByUrl('/chat');
        },
        error: (e) => {
          this.error.set(
            e?.error?.error ?? 'Unable to sign in. Check your details and try again.'
          );
        },
      });
  }

  togglePw() {
    this.showPw = !this.showPw;
  }

  loginWithGoogle() {
    // TODO: replace with your OAuth URL or popup flow
    window.alert('Google sign-in coming soon 🤝');
  }
}
