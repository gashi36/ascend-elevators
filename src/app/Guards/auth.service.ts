import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
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
  [key: string]: unknown;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TOKEN_KEY = 'jwt_token';
const CLAIM_ROLE = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const CLAIM_ID = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
const CLAIM_NAME = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly router = inject(Router);
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(null);

  readonly currentUser$: Observable<AuthUser | null> = this.userSubject.asObservable();

  constructor() {
    this.hydrateFromToken();
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

  isSuperAdmin(): boolean { return this.userSubject.value?.role === UserRole.Superadmin; }
  isAdmin(): boolean { return this.userSubject.value?.role === UserRole.Admin; }
  isManager(): boolean { return this.userSubject.value?.role === UserRole.Manager; }

  hasAdminAccess(): boolean {
    const role = this.userSubject.value?.role;
    return role === UserRole.Superadmin || role === UserRole.Admin || role === UserRole.Manager;
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.hydrateFromToken();
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  // ─── Private ───────────────────────────────────────────────────────────────

  private getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private hydrateFromToken(): void {
    const token = this.getStoredToken();
    if (!token) return;

    const payload = this.decodeToken(token);
    if (!payload || payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      this.userSubject.next(null);
      return;
    }

    this.userSubject.next({
      id: (payload[CLAIM_ID] as string) ?? '',
      name: (payload[CLAIM_NAME] as string)
        || (payload['unique_name'] as string)
        || (payload['name'] as string)
        || 'Përdorues',
      email: (payload['email'] as string) ?? '',
      role: this.normalizeRole(payload[CLAIM_ROLE] as string),
    });
  }
  private normalizeRole(role: string): UserRole {
    const map: Record<string, UserRole> = {
      SUPERADMIN: UserRole.Superadmin,
      ADMIN: UserRole.Admin,
      MANAGER: UserRole.Manager,
    };
    return map[role?.toUpperCase()] ?? role as UserRole;
  }
  private decodeToken(token: string): JwtPayload | null {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64)) as JwtPayload;
    } catch {
      return null;
    }
  }
}
