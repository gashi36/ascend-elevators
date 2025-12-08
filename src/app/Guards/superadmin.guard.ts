// src/app/Guards/superadmin.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, UrlTree, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Functional guard that allows only SuperAdmins to access certain routes.
 */
export const SuperadminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    // Not logged in → redirect to login
    return router.createUrlTree(['/login']);
  }

  if (!authService.isSuperAdmin()) {
    // Logged in but not SuperAdmin → redirect to home or 403 page
    return router.createUrlTree(['/']);
  }

  // Logged in and SuperAdmin → allow access
  return true;
};
