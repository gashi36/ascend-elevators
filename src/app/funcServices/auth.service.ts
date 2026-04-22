import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { UserRole } from '../../graphql/generated/graphql';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  
  email: string;
  role: UserRole;
}

interface JwtPayload {
  exp: number;
  iat?: number;
  [key: string]: unknown;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TOKEN_KEY = 'jwt_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const CLAIM_ROLE = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const CLAIM_ID = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
const CLAIM_NAME = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly router = inject(Router);
  private readonly cookieService = inject(CookieService);
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(null);

  private tokenExpiryCheckSubscription: Subscription | null = null;

  readonly currentUser$: Observable<AuthUser | null> = this.userSubject.asObservable();

  constructor() {
    this.hydrateFromToken();
    this.startTokenExpiryMonitor();
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  get currentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    const token = this.getStoredToken();
    if (!token) return false;
    const payload = this.decodeToken(token);
    return payload !== null && payload.exp * 1000 > Date.now();
  }

  isSuperAdmin(): boolean {
    return this.userSubject.value?.role === UserRole.Superadmin;
  }

  isAdmin(): boolean {
    return this.userSubject.value?.role === UserRole.Admin;
  }

  isManager(): boolean {
    return this.userSubject.value?.role === UserRole.Manager;
  }

  hasAdminAccess(): boolean {
    const role = this.userSubject.value?.role;
    return role === UserRole.Superadmin || role === UserRole.Admin || role === UserRole.Manager;
  }

  setToken(token: string, rememberMe: boolean = false): void {
    // Set cookie expiration based on remember me preference
    let expiryDays: number;
    if (rememberMe) {
      expiryDays = 7; // 7 days for remember me
    } else {
      expiryDays = 1 / 24; // 1 hour (1/24 of a day)
    }

    const isSecure = window.location.protocol === 'https:';

    // Set access token in cookie (NOT localStorage)
    this.cookieService.set(
      TOKEN_KEY,
      token,
      expiryDays,
      '/',
      '',
      isSecure,
      'Strict'
    );

    this.hydrateFromToken();
    this.startTokenExpiryMonitor();
  }

  logout(): void {
    // Clear both access and refresh tokens from cookies
    this.cookieService.delete(TOKEN_KEY, '/');
    this.cookieService.delete(REFRESH_TOKEN_KEY, '/');
    this.userSubject.next(null);

    if (this.tokenExpiryCheckSubscription) {
      this.tokenExpiryCheckSubscription.unsubscribe();
      this.tokenExpiryCheckSubscription = null;
    }

    this.router.navigate(['/login']);
  }

  getTokenRemainingTime(): number | null {
    const token = this.getStoredToken();
    if (!token) return null;

    const payload = this.decodeToken(token);
    if (!payload) return null;

    const expiryTime = payload.exp * 1000;
    const remainingMs = expiryTime - Date.now();
    return remainingMs > 0 ? remainingMs : 0;
  }

  isTokenExpiringSoon(minutesBeforeExpiry: number = 5): boolean {
    const remainingMs = this.getTokenRemainingTime();
    if (!remainingMs) return false;

    const remainingMinutes = remainingMs / 1000 / 60;
    return remainingMinutes > 0 && remainingMinutes <= minutesBeforeExpiry;
  }

  // ─── Private ───────────────────────────────────────────────────────────────

  private getStoredToken(): string | null {
    // Only get from cookie, NOT localStorage
    const token = this.cookieService.get(TOKEN_KEY);
    return token || null;
  }

  private hydrateFromToken(): void {
    const token = this.getStoredToken();
    if (!token) return;

    const payload = this.decodeToken(token);
    if (!payload || payload.exp * 1000 <= Date.now()) {
      // Token expired or invalid
      this.cookieService.delete(TOKEN_KEY, '/');
      this.userSubject.next(null);
      return;
    }

    // Extract user info from token payload
    const user: AuthUser = {
      id: (payload[CLAIM_ID] as string) ?? '',
      name: (payload[CLAIM_NAME] as string)
        || (payload['unique_name'] as string)
        || (payload['name'] as string)
        || 'Përdorues',
      email: (payload['email'] as string) ?? '',
      role: this.normalizeRole(payload[CLAIM_ROLE] as string),
    };

    this.userSubject.next(user);
  }

  private normalizeRole(role: string): UserRole {
    const map: Record<string, UserRole> = {
      'SUPERADMIN': UserRole.Superadmin,
      'ADMIN': UserRole.Admin,
      'MANAGER': UserRole.Manager,
    };

    const normalizedRole = role?.toUpperCase();
    return map[normalizedRole] ?? (role as UserRole);
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as JwtPayload;
    } catch {
      return null;
    }
  }

  private startTokenExpiryMonitor(): void {
    if (this.tokenExpiryCheckSubscription) {
      this.tokenExpiryCheckSubscription.unsubscribe();
    }

    this.tokenExpiryCheckSubscription = interval(60000).subscribe(() => {
      if (this.isAuthenticated() && this.isTokenExpiringSoon(5)) {
        console.warn('Token expiring soon!', this.getTokenRemainingTime());
        // You can trigger a refresh token event here
      }

      if (!this.isAuthenticated() && this.getStoredToken()) {
        console.warn('Token expired, logging out');
        this.logout();
      }
    });
  }
}
