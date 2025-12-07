import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // <-- Added form imports
import { take } from 'rxjs/operators';
import { LoginGQL, LoginInput } from '../../../graphql/generated/graphql';

@Component({
  selector: 'app-login',
  standalone: true,
  // ADDED ReactiveFormsModule to handle dynamic forms
  imports: [CommonModule, NgClass, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup; // Declare the form group

  isLoading = false;
  statusMessage: string | null = null;
  statusClass: string = '';

  // Inject the generated Apollo service and FormBuilder
  constructor(private loginGQL: LoginGQL, private fb: FormBuilder) {
    // Initialize the form group with controls and validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('jwt_token')) {
      this.statusMessage = 'A token already exists in localStorage.';
      this.statusClass = 'p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm';
    }
  }

  // Renamed to handleLogin to reflect dynamic input
  handleLogin(): void {
    // Check if the form is valid before submitting
    if (this.loginForm.invalid) {
      this.statusMessage = 'Validation failed: Please enter a valid email and a password of at least 8 characters.';
      this.statusClass = 'p-3 bg-red-100 text-red-800 rounded-lg text-sm';
      return;
    }

    this.isLoading = true;
    this.statusMessage = 'Attempting login...';
    this.statusClass = 'p-3 bg-blue-100 text-blue-800 rounded-lg text-sm';

    // Extract credentials from the form
    const credentials: LoginInput = this.loginForm.value;

    // FIX: Wrapping the mutation variables in the 'variables' property
    this.loginGQL.mutate({ variables: { input: credentials } })
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          const payload = result.data?.login;

          if (payload?.token && payload.success) {
            // CRITICAL STEP: Save the token for the Apollo AuthLink to pick up!
            localStorage.setItem('jwt_token', payload.token);

            this.statusMessage = `SUCCESS! Token saved for user ${payload.user?.email} (${payload.user?.role}).`;
            this.statusClass = 'p-3 bg-green-100 text-green-800 rounded-lg text-sm font-semibold';

          } else if (payload?.message) {
            // Login failed due to credential issue
            this.statusMessage = `Login Failed: ${payload.message}`;
            this.statusClass = 'p-3 bg-red-100 text-red-800 rounded-lg text-sm';
          } else {
            // Unexpected server response
            this.statusMessage = 'Login Failed: Unexpected response or network error.';
            this.statusClass = 'p-3 bg-red-100 text-red-800 rounded-lg text-sm';
          }
        },
        error: (e) => {
          this.isLoading = false;
          // Network error, CORS error, etc.
          this.statusMessage = `Authentication Error: Network problem or server connection failed. See console for details.`;
          this.statusClass = 'p-3 bg-red-100 text-red-800 rounded-lg text-sm font-semibold';
          console.error('GraphQL Mutation Error:', e);
        }
      });
  }
}
