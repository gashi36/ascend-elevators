// header.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs/operators';
import { ChangeMyPasswordGQL } from '../../../graphql/generated/graphql';
import { AuthService } from '../../Guards/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isOpen = false;
  mobileServicesOpen = false;
  showProfileModal = false;
  showPasswordModal = false;

  // User info
  currentUser: any = null;

  // Password change form
  passwordForm: FormGroup;

  // Loading states
  isLoading = false;

  // Messages
  profileMessage: string | null = null;
  messageType: 'success' | 'error' = 'success';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private changeMyPasswordGQL: ChangeMyPasswordGQL,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

    // Listen for login/logout events
    this.setupAuthListeners();
  }

  ngOnInit() {
    this.loadUserFromToken();
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  toggleMobileServices() {
    this.mobileServicesOpen = !this.mobileServicesOpen;
  }

  // Listen for auth state changes
  setupAuthListeners() {
    // Listen for route changes to update user info
    this.router.events.subscribe(() => {
      if (this.authService.isAuthenticated() && !this.currentUser) {
        this.loadUserFromToken();
      }
    });
  }

  // Load user info from JWT token - IMPROVED VERSION
  loadUserFromToken() {
    const token = localStorage.getItem('jwt_token');

    if (token && this.authService.isAuthenticated()) {
      try {
        // Decode the token to get user info
        const payload = this.decodeToken(token);

        if (payload) {
          this.currentUser = {
            id: payload.sub || payload.userId || payload.id,
            email: payload.email,
            firstName: payload.firstName || payload.given_name,
            lastName: payload.lastName || payload.family_name,
            role: payload.role || payload.Role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
            username: payload.username || payload.preferred_username || payload.email?.split('@')[0]
          };
          console.log('User loaded from token:', this.currentUser);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        this.currentUser = null;
      }
    } else {
      this.currentUser = null;
    }
  }

  // Copy decodeToken method from AuthService
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding JWT token:', e);
      return null;
    }
  }

  // Password match validator
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  // Show profile info in modal
  openProfileModal() {
    this.showProfileModal = true;
    this.profileMessage = null;
    this.isOpen = false; // Close mobile menu if open
  }

  closeProfileModal() {
    this.showProfileModal = false;
    this.showPasswordModal = false;
    this.passwordForm.reset();
  }

  // Open password change modal
  openPasswordModal() {
    this.showProfileModal = true;
    this.showPasswordModal = true;
    this.passwordForm.reset();
    this.profileMessage = null;
  }

  // Change password
  changePassword() {
    if (this.passwordForm.invalid) {
      this.profileMessage = 'Please fill all fields correctly.';
      this.messageType = 'error';
      return;
    }

    this.isLoading = true;

    this.changeMyPasswordGQL.mutate({
      variables: {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
      }
    })
      .pipe(take(1))
      .subscribe({
        next: (result: any) => {
          this.isLoading = false;
          const response = result.data?.changeMyPassword;

          if (response?.success) {
            this.profileMessage = response.message || 'Password changed successfully!';
            this.messageType = 'success';
            this.passwordForm.reset();

            // Auto-close after success
            setTimeout(() => {
              this.closeProfileModal();
            }, 2000);
          } else {
            this.profileMessage = response?.message || 'Failed to change password.';
            this.messageType = 'error';
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          this.profileMessage = 'An error occurred. Please try again.';
          this.messageType = 'error';
          console.error('Error changing password:', error);
        }
      });
  }

  // Navigate to admin panel based on user role
  navigateToAdminPanel() {
    if (this.authService.isSuperAdmin()) {
      this.router.navigate(['/superadmin-panel']);
    } else if (this.authService.isNormalAdmin()) {
      this.router.navigate(['/admin-panel']);
    }
    this.isOpen = false; // Close mobile menu if open
  }

  // Logout function - using auth service
  logout() {
    this.authService.logout();
    this.currentUser = null;
    this.isOpen = false;
    this.closeProfileModal();
  }

  // Helper to get user role
  getUserRole(): string {
    return this.authService.getUserRole() || '';
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.authService.isNormalAdmin();
  }

  // Check if user is superadmin
  isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  // Check if user has any admin role
  hasAdminAccess(): boolean {
    return this.authService.isAuthenticated() &&
      (this.authService.isNormalAdmin() || this.authService.isSuperAdmin());
  }
}
