import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const tok = auth.accessTokenSig();
  if (tok) req = req.clone({ setHeaders: { Authorization: `Bearer ${tok}` } });
  return next(req);
};
