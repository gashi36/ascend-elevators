import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuthService, AuthUser } from '../../Guards/auth.service';
import { ChangePasswordGQL } from '../../../graphql/generated/graphql';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

// ─── Pure validator ───────────────────────────────────────────────────────────

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const group = control as FormGroup;
  const newPass = group.get('newPassword')?.value;
  const confirm = group.get('confirmPassword')?.value;
  if (!newPass || !confirm) return null;
  return newPass === confirm ? null : { mismatch: true };
}

// ─── Component ───────────────────────────────────────────────────────────────

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslatePipe, LanguageSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  // Drawer
  drawerOpen = false;
  mobileServicesOpen = false;

  // Modals
  showProfileModal = false;
  showPasswordModal = false;

  // Password visibility toggles
  showCurrent = false;
  showNew = false;
  showConfirm = false;

  // Auth state
  currentUser: AuthUser | null = null;

  // Change-password form
  readonly passwordForm: FormGroup;
  isLoading = false;
  profileMessage: string | null = null;
  messageType: 'success' | 'error' = 'success';

  // Cleanup
  private readonly destroy$ = new Subject<void>();
  private messageTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly changeMyPasswordGQL: ChangePasswordGQL,
    public readonly authService: AuthService,
  ) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required, Validators.minLength(8)]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator },
    );
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => (this.currentUser = user));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearMessageTimer();
  }

  // ─── Drawer ───────────────────────────────────────────────────────────────

  toggleDrawer(): void {
    this.drawerOpen = !this.drawerOpen;
    if (!this.drawerOpen) this.mobileServicesOpen = false;
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.mobileServicesOpen = false;
  }

  toggleMobileServices(): void {
    this.mobileServicesOpen = !this.mobileServicesOpen;
  }

  // ─── Profile modal ────────────────────────────────────────────────────────

  openProfileModal(): void {
    this.closeDrawer();
    this.showProfileModal = true;
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
    this.showPasswordModal = false;
    this.profileMessage = null;
    this.isLoading = false;
    this.showCurrent = false;
    this.showNew = false;
    this.showConfirm = false;
    this.passwordForm.reset();
    this.clearMessageTimer();
  }

  openPasswordModal(): void {
    this.passwordForm.reset();
    this.profileMessage = null;
    this.showPasswordModal = true;
    this.closeDrawer();
  }

  // ─── Auth actions ─────────────────────────────────────────────────────────

  logout(): void {
    this.closeDrawer();
    this.showProfileModal = false;
    this.showPasswordModal = false;
    this.clearMessageTimer();
    this.authService.logout();
  }

  changePassword(): void {
    if (this.passwordForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.profileMessage = null;

    this.changeMyPasswordGQL
      .mutate({
        variables: {
          currentPassword: this.passwordForm.value.currentPassword as string,
          newPassword: this.passwordForm.value.newPassword as string,
        },
      })
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.messageType = 'success';
          this.profileMessage = 'Fjalëkalimi u ndryshua me sukses!';
          this.passwordForm.reset();
          this.messageTimer = setTimeout(() => this.closeProfileModal(), 2000);
        },
        error: (err: Error) => {
          this.isLoading = false;
          this.messageType = 'error';
          this.profileMessage = err.message ?? 'Ndodhi një gabim. Provoni sërish.';
        },
      });
  }

  // ─── Navigation ───────────────────────────────────────────────────────────

  navigateToAdminPanel(): void {
    this.closeDrawer();
    this.router.navigate(['/admin-panel']);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  hasAdminAccess(): boolean {
    return this.authService.hasAdminAccess();
  }

  private clearMessageTimer(): void {
    if (this.messageTimer !== null) {
      clearTimeout(this.messageTimer);
      this.messageTimer = null;
    }
  }
}
