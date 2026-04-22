import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../funcServices/auth.service';

export const AuthGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) return true;

  // Preserve the attempted URL so we can redirect back after login
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
