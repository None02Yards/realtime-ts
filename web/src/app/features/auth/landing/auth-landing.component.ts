import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-auth-landing',
  standalone: true,
  imports: [],
  templateUrl: './auth-landing.component.html',
  styleUrl: './auth-landing.component.scss'
})
export class AuthLandingComponent {

    private router = inject(Router);

  goLogin() {
    this.router.navigateByUrl('/login');
  }
    goSignup() {
    this.router.navigateByUrl('/signup');
  }
authGoogle()  { /* this.auth.signupWithGoogle() or loginWithGoogle() */ }
authX()       { window.open('https://x.com/yourhandle', '_blank'); }         // or OAuth
authFacebook(){ /* Facebook OAuth */ }
authGithub()  { /* GitHub OAuth */ }

}
