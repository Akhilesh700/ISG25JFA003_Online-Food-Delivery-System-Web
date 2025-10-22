import { Component, OnInit } from '@angular/core';
import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZardCardComponent } from "@shared/components/card/card.component";

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

  restaurantRegistrationForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

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
      console.log('Registration Successful!', this.restaurantRegistrationForm.value);
      // Here you would typically send the data to your backend service
    } else {
      // If the form is invalid, log an error and mark all fields as 'touched'
      // This will trigger the validation messages to display in your template
      console.error('Form is invalid. Please check the fields.');
      this.restaurantRegistrationForm.markAllAsTouched();
    }
  }

}
