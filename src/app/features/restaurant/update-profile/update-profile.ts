import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { RestaurantService } from '../../../core/services/restaurant/restaurant.service';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-profile.html',
  styleUrls: ['./update-profile.css']
})
export class UpdateProfileComponent implements OnInit {
  profileForm!: FormGroup;
  profileImageUrl: string | ArrayBuffer | null = './img/avatar/restaurant_profile.jpg';
  isLoading: boolean = false;
  isSaving: boolean = false;

  constructor(
    private router: Router,
    private restaurantService: RestaurantService
  ) { }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
      address: new FormControl('', [Validators.required]),
      openTime: new FormControl(''),
      closeTime: new FormControl('')
    });

    // Load current profile data from API
    this.loadProfileData();
  }

  loadProfileData(): void {
    this.isLoading = true;
    this.restaurantService.getProfile().subscribe({
      next: (profile) => {
        this.isLoading = false;
        
        // Populate form with existing profile data (time in HH:mm:ss format)
        this.profileForm.patchValue({
          name: profile.name || '',
          phone: profile.phone || '',
          address: profile.address || '',
          openTime: profile.openTime || '',
          closeTime: profile.closeTime || ''
        });
        
        // Update profile image if available from backend
        if (profile.profileImageUrl) {
          this.profileImageUrl = profile.profileImageUrl;
        }
      },
      error: (error) => {
        this.isLoading = false;
        
        // If API fails, show warning but allow user to enter data
        if (error.status === 404) {
          toast.info('No existing profile found. Please enter your details.');
        } else {
          toast.warning('Could not load existing profile data. You can still update your profile.');
        }
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSaving = true;
      
      // Build profile data object with time in HH:mm:ss format (LocalTime)
      const profileData: any = {
        name: this.profileForm.value.name,
        phone: this.profileForm.value.phone,
        address: this.profileForm.value.address,
        openTime: this.profileForm.value.openTime || null,
        closeTime: this.profileForm.value.closeTime || null
      };

      this.restaurantService.updateProfile(profileData).subscribe({
        next: (response) => {
          this.isSaving = false;
          toast.success('✅ Profile updated successfully!');
          
          // Reload the profile data from backend to show the updated values
          this.loadProfileData();
          
          // Mark form as pristine since data is now in sync with backend
          this.profileForm.markAsPristine();
        },
        error: (error) => {
          this.isSaving = false;
          const errorMsg = error.error?.message || 'Failed to update profile';
          toast.error(`❌ ${errorMsg}`);
        }
      });
    } else {
      this.profileForm.markAllAsTouched();
      toast.error('❌ Please fill all required fields correctly');
    }
  }

  onCancel(): void {
    this.router.navigate(['/restaurant']);
  }
}