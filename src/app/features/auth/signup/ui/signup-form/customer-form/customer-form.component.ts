// src/app/features/auth/components/customer-form/customer-form.component.ts (Adjust path as needed)
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from 'ngx-sonner';

import { ZardCardComponent } from "@shared/components/card/card.component"; // Adjust path
import { AuthService } from 'src/app/core/services/auth/auth.service'; // Adjust path
import { CustomerSignupResponse } from 'src/app/core/services/auth/auth.models'; // Adjust path
import { finalize } from 'rxjs';

@Component({
  selector: 'app-customer-form',
  standalone: true, // Mark as standalone
  imports: [
    ReactiveFormsModule,
    CommonModule, // Include CommonModule for directives like ngIf
    ZardCardComponent // Import necessary shared components
  ],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'] // Link to the CSS file
})
export class CustomerFormComponent implements OnInit {
  // --- Dependency Injection ---
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // --- Component State ---
  customerRegistrationForm!: FormGroup;
  submitted = false;

  ngOnInit(): void {
    // Initialize the form with controls and their validators
    this.customerRegistrationForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      dob: ['', [Validators.required]],
    });
  }

  get f() {
    return this.customerRegistrationForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.customerRegistrationForm.invalid) {
      console.error('Form is invalid. Please check the fields.');
      this.customerRegistrationForm.markAllAsTouched();
      return;
    }


    const credentials: iCustomerSignup = {
      email: this.customerRegistrationForm.value.email,
      password: this.customerRegistrationForm.value.password,
      name: this.customerRegistrationForm.value.name,
      phone: this.customerRegistrationForm.value.phone,
      dob: this.customerRegistrationForm.value.dob,
    };

    // Call the AuthService for customer signup
    this.authService.customerSignUp(credentials)
      .subscribe({
        next: (response: CustomerSignupResponse) => {
          toast.success(`Account created successfully! Now login...`);
          // Redirecting to login after a short delay
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3500);
        },
        error: (err: HttpErrorResponse) => {
          this.submitted = false;
          // Handling user conflict error
          if (err.status === 409) {
            const message = 'An account with this email already exists.';
            toast.error(message);
          } else {
            // Handling all other errors (400, 500, etc.)
            const message = err.error?.message || 'An unknown error occurred during signup. Please try again.';
            toast.error(message);
          }
        }
      });
  }
}