import { Component, inject, OnInit } from '@angular/core';
import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZardCardComponent } from "@shared/components/card/card.component";
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Router } from '@angular/router';
import { RestaurantSignupResponse } from 'src/app/core/services/auth/auth.models';
import { toast } from 'ngx-sonner';
import { HttpErrorResponse } from '@angular/common/http';
import { delay, finalize, interval, map, switchMap, take, timer } from 'rxjs';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.css'],
  imports: [
    ZardBreadcrumbModule,
    ReactiveFormsModule,
    ZardCardComponent
  ]
})
export class RestaurantFormComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  restaurantRegistrationForm!: FormGroup;


  ngOnInit(): void {
    // Initialize the form with controls and their validators
    this.restaurantRegistrationForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Validates a 10-digit number
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      openTime: ['', [Validators.required]],
      closeTime: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });
  }

  //Getter to access controls in the form
  get f() {
    return this.restaurantRegistrationForm.controls;
  }

  onSubmit(): void {
    // Check if the form is valid
    if (this.restaurantRegistrationForm.valid) {
      // If valid, log the form data to the console
      console.log(this.restaurantRegistrationForm.value);
      // Here you would typically send the data to your backend service
      const credentials: iRestaurantSignup = {
        email: this.restaurantRegistrationForm.value.email,
        password: this.restaurantRegistrationForm.value.password,
        name: this.restaurantRegistrationForm.value.name,
        openTime: this.restaurantRegistrationForm.value.openTime,
        closeTime: this.restaurantRegistrationForm.value.closeTime,
        phone: this.restaurantRegistrationForm.value.phone,
        address: this.restaurantRegistrationForm.value.address,
      }

      this.authService.restaurantSignUp(credentials).subscribe({
        next: () => {
          toast.success(`Account created succesfully! Now redirecting to login!`);
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3500);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            const message = err.error?.message || 'User already exists'
            toast.error(message);
          } else {
            // --- Handling all other errors (400, 500, etc.) ---
            const message = err.error?.message || 'An unknown error occurred';
            toast.error(message);
          }
        }
      })

    } else {
      // If the form is invalid, log an error and mark all fields as 'touched'
      // This will trigger the validation messages to display in your template
      console.error('Form is invalid. Please check the fields.');
      this.restaurantRegistrationForm.markAllAsTouched();
    }
  }

}
