import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delivery-agent-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule // Needed for @if, @for, etc.
  ],
  templateUrl: './delivery-agent-form.component.html',
  styleUrls: ['./delivery-agent-form.component.css']
})
export class DeliveryAgentFormComponent implements OnInit {
  deliveryAgentForm!: FormGroup;

  // Options for the identity proof dropdown
  identityProofTypes = ['Aadhaar Card', 'PAN Card', "Driver's License", 'Passport'];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.deliveryAgentForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      email: ['', [Validators.required, Validators.email]], // From related User entity
      password: ['', [Validators.required, Validators.minLength(8)]], // From related User entity
      identityProofType: ['', [Validators.required]],
      identityProofNo: ['', [Validators.required]]
    });
  }

  // Getter to access form controls easily in the template
  get f() {
    return this.deliveryAgentForm.controls;
  }

  onSubmit(): void {
    if (this.deliveryAgentForm.valid) {
      console.log('Delivery Agent Registration Successful!', this.deliveryAgentForm.value);
      // Here you would send the data to your backend service
    } else {
      console.error('Form is invalid. Please check the fields.');
      this.deliveryAgentForm.markAllAsTouched();
    }
  }
}