import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { take } from 'rxjs';
import { navigateToDashboard } from '@shared/utils/navigations.utils';
import { LoginCredentials } from 'src/app/core/services/auth/auth.models';
import { toast } from 'ngx-sonner';

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

    this.authService.login(credentials).subscribe({
      next: (role) => {
        this.isLoading = false;
        navigateToDashboard(role, this.router);
      },
      error: (error) => {
        toast.error(error.error.message);
        this.loginForm.reset();
        this.submitted = false;
        this.isLoading = false;
      }
    });
  }
}