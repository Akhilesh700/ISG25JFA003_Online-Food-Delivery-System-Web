import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { take } from 'rxjs';
import { navigateToDashboard } from '@shared/utils/navigations.utils';
import { LoginCredentials } from 'src/app/core/services/auth/auth.models';
import { toast } from 'ngx-sonner';
import { DeviceInfoService } from 'src/app/core/services/auth/device-info.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  private deviceInfoService = inject(DeviceInfoService);

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
    const deviceInfo = this.deviceInfoService.getDeviceInfo() || this.deviceInfoService.getDefaultDeviceInfo();
    const credentials: LoginCredentials = {
      username: this.loginForm.value.email,
      password: this.loginForm.value.password,
      rememberMe: this.loginForm.value.rememberMe,
      deviceName: deviceInfo.name,
      browserName: deviceInfo.browserName,
      browserVersion: deviceInfo.browserVersion,
      timezone: deviceInfo.timezone,
      deviceType: deviceInfo.deviceType
    };
    this.authService.login(credentials).subscribe({
      next: (role) => {
        this.isLoading = false;
        navigateToDashboard(role, this.router);
      },
      error: (error: unknown) => { 
        let message = 'Login failed. Please try again.';

        if (error instanceof HttpErrorResponse) {
             message = error.error?.message || error.error?.error || `Error: ${error.statusText}`;
        } else if (error instanceof Error) {
            message = error.message;
        }

        toast.error(message); 

        this.loginForm.reset({
             email: this.loginForm.value.email,
             password: '',
             rememberMe: this.loginForm.value.rememberMe 
        });

        this.submitted = false;
        this.isLoading = false;
        this.loginError = message;
      }
    });
  }
}