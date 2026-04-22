import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../funcServices/auth.service';

export const SuperadminGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  if (authService.isSuperAdmin()) return true;

  // Authenticated but not a superadmin — send to dashboard
  return router.createUrlTree(['/admin-panel']);
};
