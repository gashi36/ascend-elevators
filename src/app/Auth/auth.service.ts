import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

export type UserRole = 'SuperAdmin' | 'Admin' | null;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);

  /**
   * Helper function to decode the JWT token payload (client-side).
   * This is a bare-bones implementation. In production, consider using
   * a library like 'jwt-decode' for better robustness and type safety.
   * @param token The JWT string (Header.Payload.Signature)
   * @returns The decoded payload object or null.
   */
  private decodeToken(token: string): any {
    try {
      // JWTs are base64url encoded. Get the payload (second part).
      const payload = token.split('.')[1];

      // Replace non-standard characters and decode the base64 string
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

      // Decode and parse the JSON payload
      // We use atob() for decoding and a polyfill for URL-safe characters
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding JWT token. Token format likely invalid.', e);
      return null;
    }
  }

  /**
   * Checks if the JWT token exists in localStorage.
   * @returns true if the user is authenticated, false otherwise.
   */
  isAuthenticated(): boolean {
    // Check for the presence of the token
    return !!localStorage.getItem('jwt_token');
  }

  /**
   * Retrieves the current user's role from the decoded JWT token payload.
   */
  getUserRole(): UserRole {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      return null;
    }

    const payload = this.decodeToken(token);

    // !!! CRITICAL: Check your C# JWT configuration for the exact claim name.
    // If your backend uses the standard .NET claim, it might be
    // 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'.
    // For this example, we assume it's simply 'role' or 'Role'.
    const roleClaim = payload?.role || payload?.Role;

    if (roleClaim === 'SuperAdmin' || roleClaim === 'Admin') {
      return roleClaim;
    }

    // If the token is present but the role claim is missing or invalid
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
    this.router.navigate(['/login']);
  }
}
