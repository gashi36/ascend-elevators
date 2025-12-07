import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Functional guard that protects routes, ensuring only authenticated users can access them.
 */
export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  // The service handles the complex logic of checking the token and returning
  // either true (continue) or a UrlTree (redirect to login).
  return authService.checkAuthAndRedirect();
};
