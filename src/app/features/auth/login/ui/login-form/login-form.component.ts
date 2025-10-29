import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { take } from 'rxjs';
import { navigateToDashboard } from '@shared/utils/navigations.utils';
import { LoginCredentials, Role } from 'src/app/core/services/auth/auth.models';
import { toast } from 'ngx-sonner';
import { DeviceInfoService } from 'src/app/core/services/auth/device-info.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { userService } from 'src/app/core/services/customer/userService';
import { UserProfileComponent } from 'src/app/features/customer/pages/user-profile/user-profile';
import { userProfileService } from 'src/app/core/services/customer/user-profile/user-profile.service';
import { addUser } from 'src/app/state/user/user.action';
import { IUser } from "src/app/core/services/customer/userService";
import { DeliveryAgentService } from 'src/app/core/services/delivery-agent/delivery-agent.service';

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
  protected userService = inject(userProfileService);
  private router = inject(Router);
  private deviceInfoService = inject(DeviceInfoService);
  protected readonly store = inject<Store<AppState>>(Store);
  private deliveryAgentService = inject(DeliveryAgentService);

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
      next: (role : Role) => {
        this.isLoading = false;
        if(role === 'ROLE_CUSTOMER') {
          const store = this.store
          this.userService.getUserProfile().subscribe({
            next(user) {
                store.dispatch(addUser({user}))
                console.log(user);
            },
            error(err) {
              console.error("Unable to load the user in the state store", err);
            },
          })
        }
        if(role == 'ROLE_DELIVERY_AGENT') {
          this.deliveryAgentService.updateAgentStatus('Available');
        }
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