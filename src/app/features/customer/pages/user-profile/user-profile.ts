import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
// Import ReactiveForms modules
import { ReactiveFormsModule, FormGroup, FormControl, Validators }from '@angular/forms';
import { finalize } from 'rxjs';
import { CustomerProfile, ProfileService, UpdateCustomerProfile } from 'src/app/core/services/customer/user-profile.service';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './user-profile.html'
})
export class UserProfileComponent implements OnInit {
  
  user: CustomerProfile | null = null; 
  profileService = inject(ProfileService);
  isEditing = false;
  isSaving = false; 
  profileForm!: FormGroup; 

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl(''),
      address: new FormControl(''),
      dob: new FormControl('', [Validators.required]),
      preferredPayment: new FormControl('') 
    });
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.user = data; 
        this.profileForm.patchValue(data);
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) {
      this.profileForm.patchValue(this.user);
    }
  }

  onSave(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    this.profileForm.disable(); 
    const profileUpdateData = this.profileForm.value as UpdateCustomerProfile;
    this.profileService.updateProfile(profileUpdateData).pipe(
      finalize(() => {
        this.isSaving = false;
        this.profileForm.enable();
      })
    ).subscribe({
      next: (updatedUser) => {
        this.user = { 
          ...(this.user as CustomerProfile),  
          ...this.profileForm.value           
        };
        this.isEditing = false; 
      },
      error: (err) => {
        console.error('Error updating profile:', err);
      }
    });
  }
}