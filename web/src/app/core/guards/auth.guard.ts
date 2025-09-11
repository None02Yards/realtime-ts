import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

export const canActivateAuth: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // if we have a token -> allow
  if (auth.accessTokenSig()) return true;

  // otherwise redirect to login, preserve where we came from
  router.navigate(['/login'], { queryParams: { redirect: state.url } });
  return false;
};
