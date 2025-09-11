import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  // services
  private auth = inject(AuthService);
  private router = inject(Router);

  // form model (bind these in your template)
  name = '';
  email = '';
  password = '';
  confirm = '';
  acceptTerms = false;

  // UI states
  showPw = false;
  showPw2 = false;
  loading = false;
  error = signal<string | null>(null);

  // -- Helpers ----------------------------------------------------
  private passwordStrong(pw: string): boolean {
    // At least 8 chars, at least 1 letter and 1 number (tweak as you like)
    return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(pw);
  }

  private trimAll() {
    this.name = this.name.trim();
    this.email = this.email.trim();
  }

  private validate(): boolean {
    if (!this.name) {
      this.error.set('Please enter your full name.');
      return false;
    }
    if (!this.email) {
      this.error.set('Please enter your email.');
      return false;
    }
    if (!this.password) {
      this.error.set('Please enter a password.');
      return false;
    }
    if (!this.passwordStrong(this.password)) {
      this.error.set('Use at least 8 characters with letters and numbers.');
      return false;
    }
    if (this.password !== this.confirm) {
      this.error.set('Passwords do not match.');
      return false;
    }
    if (!this.acceptTerms) {
      this.error.set('Please accept the Terms & Privacy to continue.');
      return false;
    }
    return true;
  }

  private parseErr(e: any): string {
    // Try common backend shapes: {error: {message}} or {error: {error}} etc.
    return (
      e?.error?.message ||
      e?.error?.error ||
      e?.message ||
      'Sign up failed. Please try again.'
    );
  }

  // -- Actions ----------------------------------------------------
  onSubmit() {
    this.error.set(null);
    this.trimAll();
    if (!this.validate()) return;

    this.loading = true;
    this.auth
      .signup({ name: this.name, email: this.email, password: this.password })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          // success — go to login (keep same behavior as your pre-logic)
          this.router.navigateByUrl('/login');
        },
        error: (e) => this.error.set(this.parseErr(e)),
      });
  }

  signupWithGoogle() {
    // Redirect-based OAuth; implemented in AuthService
    if (typeof this.auth.signupWithGoogle === 'function') {
      this.auth.signupWithGoogle();
    } else if (typeof (this.auth as any).loginWithGoogle === 'function') {
      // Fallback if you only defined loginWithGoogle previously
      (this.auth as any).loginWithGoogle();
    } else {
      this.error.set('Google signup is not configured yet.');
    }
  }
}
