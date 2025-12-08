import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { LoginGQL, LoginInput } from '../../../graphql/generated/graphql';
import { Router } from '@angular/router';
import { UserRole } from '../../../graphql/generated/graphql';
@Component({
  selector: 'app-login',
  imports: [CommonModule, NgClass, ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoading = false;
  statusMessage: string | null = null;
  statusClass: string = '';

  private router = inject(Router);

  constructor(private loginGQL: LoginGQL, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['ascend.rks@gmail.com', [Validators.required, Validators.email]],
      password: ['dnecsa2025$', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('jwt_token')) {
      this.statusMessage = 'A token already exists in localStorage.';
      this.statusClass = 'p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm';
    }
  }

  handleLogin(): void {
    if (this.loginForm.invalid) {
      this.statusMessage = 'Validation failed: Please enter a valid email and a password of at least 8 characters.';
      this.statusClass = 'p-3 bg-red-100 text-red-800 rounded-lg text-sm';
      return;
    }

    this.isLoading = true;
    this.statusMessage = 'Attempting login...';
    this.statusClass = 'p-3 bg-blue-100 text-blue-800 rounded-lg text-sm';

    const credentials: LoginInput = this.loginForm.value;

    this.loginGQL.mutate({ variables: { input: credentials } })
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          const payload = result.data?.login;

          if (payload?.token && payload.success) {
            localStorage.setItem('jwt_token', payload.token);

            this.statusMessage = `SUCCESS! Logged in as ${payload.user?.email} (${payload.user?.role}).`;
            this.statusClass = 'p-3 bg-green-100 text-green-800 rounded-lg text-sm font-semibold';
            const role = payload.user?.role;
            // Redirect based on role
            if (role === UserRole.SuperAdmin) {
              this.router.navigate(['/superadmin-panel']);
            } else if (role === UserRole.Admin) {
              this.router.navigate(['/admin-panel']);
            } else {
              this.router.navigate(['/']); // fallback
            }

          } else if (payload?.message) {
            this.statusMessage = `Login Failed: ${payload.message}`;
            this.statusClass = 'p-3 bg-red-100 text-red-800 rounded-lg text-sm';
          } else {
            this.statusMessage = 'Login Failed: Unexpected response or network error.';
            this.statusClass = 'p-3 bg-red-100 text-red-800 rounded-lg text-sm';
          }
        },
        error: (e) => {
          this.isLoading = false;
          this.statusMessage = 'Authentication Error: Network problem or server connection failed.';
          this.statusClass = 'p-3 bg-red-100 text-red-800 rounded-lg text-sm font-semibold';
          console.error('GraphQL Mutation Error:', e);
        }
      });
  }
}
