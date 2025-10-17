import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { take } from 'rxjs';
import { navigateToDashboard } from '@shared/utils/navigations.utils';
import { LoginCredentials } from 'src/app/core/services/auth/auth.models';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  // --- Dependency Injection ---
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // --- Component State ---
  loginForm!: FormGroup;
  submitted = false;
  isLoading = false;
  loginError: string | null = null;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  get f() { return this.loginForm.controls; }

  /**
   * Handles the form submission by calling the auth service and delegating navigation.
   */
  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.loginError = null;

    const credentials: LoginCredentials = {
      username: this.loginForm.value.email,
      password: this.loginForm.value.password,
      rememberMe: this.loginForm.value.rememberMe
    };

    // The login method now returns an Observable that completes with the user's role.
    this.authService.login(credentials).subscribe({
      next: (role) => {
        // By the time 'next' is called, the role is guaranteed to be fetched and the state is resolved.
        this.isLoading = false;
        navigateToDashboard(role, this.router);
      },
      error: (error) => {
        this.loginError = 'Login failed. Please check your credentials.';
        console.error('Login error:', error);
        this.isLoading = false;
      }
    });
  }
}