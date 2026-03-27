import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { LoginGQL } from '../../../graphql/generated/graphql';
import { AuthService } from '../../Guards/auth.service';

type MessageType = 'error' | 'success' | null;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  readonly loginForm: FormGroup;

  isLoading = false;
  showPassword = false;
  errorMessage: string | null = null;
  messageType: MessageType = null;

  private returnUrl = '/admin-panel';

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
    });
  }

  ngOnInit(): void {
    // Redirect away if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/admin-panel']);
      return;
    }

    // Pick up returnUrl from guard redirect (e.g. ?returnUrl=/admin-panel/buildings)
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/admin-panel';
  }

  // ─── Getters for template convenience ────────────────────────────────────

  get usernameControl() { return this.loginForm.get('username')!; }
  get passwordControl() { return this.loginForm.get('password')!; }

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

    const { username, password } = this.loginForm.value as { username: string; password: string };

    this.loginGQL
      .mutate({ variables: { username, password } })
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          const token = result.data?.login?.token;

          if (token) {
            this.authService.setToken(token);
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.setError('Emri i përdoruesit ose fjalëkalimi është i gabuar.');
          }
        },
        error: () => {
          this.isLoading = false;
          this.setError('Ndodhi një gabim. Provoni sërish.');
        },
      });
  }

  // ─── Private ─────────────────────────────────────────────────────────────

  private setError(message: string): void {
    this.errorMessage = message;
    this.messageType = 'error';
  }
}
