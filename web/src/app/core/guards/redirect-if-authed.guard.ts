import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const redirectIfAuthed: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // If there’s an access token, go straight to chat
  if (auth.accessTokenSig()) {
    return router.createUrlTree(['/chat']) as UrlTree;
  }
  return true;
};
