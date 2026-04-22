import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { take, Subscription } from 'rxjs';
import { LoginGQL } from '../../../graphql/generated/graphql';
import { AuthService } from '../../funcServices/auth.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

type MessageType = 'error' | 'success' | null;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  readonly loginForm: FormGroup;

  isLoading = false;
  showPassword = false;
  errorMessage: string | null = null;
  messageType: MessageType = null;
  isAccountBlocked = false;

  private returnUrl = '/admin-panel';
  private errorTimeout: any = null;
  private loginSubscription: Subscription | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly loginGQL: LoginGQL,
    private readonly authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    // Redirect away if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin-panel']);
      return;
    }

    // Pre-fill username if saved
    const savedUsername = localStorage.getItem('remembered_username');
    if (savedUsername) {
      this.loginForm.patchValue({ username: savedUsername });
      this.loginForm.patchValue({ rememberMe: true });
    }

    // Pick up returnUrl from guard redirect
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/admin-panel';
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
  }

  // ─── Getters for template convenience ────────────────────────────────────

  get usernameControl() { return this.loginForm.get('username')!; }
  get passwordControl() { return this.loginForm.get('password')!; }
  get rememberMeControl() { return this.loginForm.get('rememberMe')!; }

  // ─── Actions ─────────────────────────────────────────────────────────────

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  handleLogin(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.messageType = null;
    this.isAccountBlocked = false;

    const { username, password, rememberMe } = this.loginForm.value as {
      username: string;
      password: string;
      rememberMe: boolean;
    };

    // Save username if remember me is checked
    if (rememberMe) {
      localStorage.setItem('remembered_username', username);
    } else {
      localStorage.removeItem('remembered_username');
    }

    this.loginSubscription = this.loginGQL
      .mutate({ variables: { username, password, rememberMe } })
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.isLoading = false;

          // Get the login result from the response
          const loginResult = result.data?.login;

          // Check for errors in the AuthPayload response
          if (loginResult?.errors && loginResult.errors.length > 0) {
            const authError = loginResult.errors[0];
            this.handleAuthError(authError.message, authError.code);
            return;
          }

          // Check if login was successful
          if (loginResult?.isSuccess && loginResult?.token) {
            this.authService.setToken(loginResult.token, rememberMe);
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.setError('Invalid response from server.', 'error');
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);

          // Handle GraphQL errors
          if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            const graphQLError = error.graphQLErrors[0];
            const code = graphQLError.extensions?.['code'];
            this.handleAuthError(graphQLError.message, code);
          } else if (error.networkError) {
            this.setError('Network error. Please check your connection.', 'error');
          } else {
            this.setError('An error occurred. Please try again.', 'error');
          }
        },
      });
  }

  // ─── Private Methods ─────────────────────────────────────────────────────

  private handleAuthError(message: string, code?: string): void {
    // Handle different error types with user-friendly messages
    switch (code) {
      case 'ACCOUNT_BLOCKED':
        this.isAccountBlocked = true;
        if (message.includes('organization') || message.includes('Your organization')) {
          this.setError(
            '❌ Your organization account has been suspended. Please contact your administrator.',
            'error'
          );
        } else {
          this.setError(
            '❌ Your account has been suspended. Please contact support.',
            'error'
          );
        }
        // Disable login form for blocked accounts
        this.loginForm.disable();
        break;

      case 'RATE_LIMITED':
        this.setError(
          '⏰ Too many failed attempts. Please try again after 15 minutes.',
          'error'
        );
        this.loginForm.disable();
        // Re-enable after 15 minutes
        setTimeout(() => {
          this.loginForm.enable();
          this.errorMessage = null;
          this.isAccountBlocked = false;
        }, 15 * 60 * 1000);
        break;

      case 'AUTH_FAILED':
      default:
        this.setError('Invalid username or password.', 'error');
        break;
    }
  }

  private setError(message: string, type: MessageType): void {
    this.errorMessage = message;
    this.messageType = type;

    // Auto-clear error after 5 seconds (unless account is blocked)
    if (!this.isAccountBlocked) {
      if (this.errorTimeout) {
        clearTimeout(this.errorTimeout);
      }
      this.errorTimeout = setTimeout(() => {
        this.errorMessage = null;
        this.messageType = null;
        this.errorTimeout = null;
      }, 5000);
    }
  }
}
