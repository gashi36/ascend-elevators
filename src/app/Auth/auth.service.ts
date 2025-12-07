import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

export type UserRole = 'SuperAdmin' | 'Admin' | null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);

  /**
   * Checks if the JWT token exists in localStorage.
   * @returns true if the user is authenticated, false otherwise.
   */
  isAuthenticated(): boolean {
    // Check for the presence and validity (optional: check token expiration here) of the token
    return !!localStorage.getItem('jwt_token');
  }

  /**
   * Retrieves the current user's role from local storage.
   */
  getUserRole(): UserRole {
    // NOTE: In a real app, you would decode the JWT token (jwt_token)
    // to get the role, but for simplicity, we use a separate key here.
    const role = localStorage.getItem('user_role');
    if (role === 'SuperAdmin' || role === 'Admin') {
      return role;
    }
    return null;
  }

  /**
   * Checks if the user is a SuperAdmin.
   */
  isSuperAdmin(): boolean {
    return this.getUserRole() === 'SuperAdmin';
  }

  /**
   * Checks if the user is a Normal Admin.
   */
  isNormalAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }

  /**
   * Redirects the user to the login page if they are not authenticated.
   * @returns true if navigation should continue, or a UrlTree for redirection.
   */
  checkAuthAndRedirect(): boolean | UrlTree {
    if (this.isAuthenticated()) {
      return true;
    } else {
      // Redirect to the login page and prevent navigation
      console.warn('Access denied: No valid token found. Redirecting to login.');
      return this.router.createUrlTree(['/login']);
    }
  }

  /**
   * Simple method to remove the token and perform a client-side logout.
   */
  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role'); // <-- IMPORTANT: Clear the role too
    this.router.navigate(['/login']);
  }
}
