import { Component, OnInit } from '@angular/core';
// 1. Import CommonModule and ReactiveFormsModule
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-address-dialog',
  // 2. Add standalone: true and imports
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './address-dialog.html',
  styleUrl: './address-dialog.css'
})
export class AddressDialog implements OnInit { // Added OnInit

  // 3. Make form public so the dialog service instance can access it
  public addressForm!: FormGroup;

  // List of areas in Coimbatore as requested
  coimbatoreAreas: string[] = [
    'Gandhipuram',
    'R.S. Puram',
    'Saibaba Colony',
    'Peelamedu',
    'Saravanampatti',
    'Singanallur',
    'Town Hall',
    'Ukkadam',
    'Vadavalli',
    'Kovaipudur',
    'Ramanathapuram'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      laneNo: ['', Validators.required],
      area: [this.coimbatoreAreas[0], Validators.required], // Default to the first area
      city: [{ value: 'Coimbatore', disabled: true }, Validators.required],
      state: [{ value: 'Tamil Nadu', disabled: true }, Validators.required]
    });
  }


  public save(): boolean {
    if (this.addressForm.valid) {
  
      return true;
    } else {
      this.addressForm.markAllAsTouched();
      return false;
    }
  }
  
}