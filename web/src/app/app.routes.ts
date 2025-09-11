// import { Routes } from '@angular/router';
// import { LoginComponent } from './features/auth/login/login.component';
// import { SignupComponent } from './features/auth/signup/signup.component';
// import { ChatPageComponent } from './features/chat/chat-page/chat-page.component';
// import { authGuard } from './core/guards/auth.guard';

// export const routes: Routes = [
//   { path: 'login', component: LoginComponent },
//   { path: 'signup', component: SignupComponent },
//   { path: '', component: ChatPageComponent, canActivate: [authGuard] },
//   { path: '**', redirectTo: '' },
// ];

import { Routes } from '@angular/router';
import { canActivateAuth } from './core/guards/auth.guard';
import { redirectIfAuthed } from './core/guards/redirect-if-authed.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [redirectIfAuthed],
    loadComponent: () =>
      import('./features/auth/landing/auth-landing.component')
        .then(m => m.AuthLandingComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup/signup.component')
        .then(m => m.SignupComponent),
  },
  {
    path: 'chat',
    canActivate: [canActivateAuth],
    loadComponent: () =>
      import('./features/chat/chat-page/chat-page.component')
        .then(m => m.ChatPageComponent),
  },
  { path: '**', redirectTo: '' },
];
