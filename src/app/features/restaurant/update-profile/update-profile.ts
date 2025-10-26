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
  profileImageUrl: string | ArrayBuffer | null = 'https://via.placeholder.com/150';
  isLoading: boolean = false;

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
      this.isLoading = true;
      
      // Build profile data object, only sending name, phone, and address
      // openTime and closeTime are excluded due to backend LocalDate type mismatch
      const profileData: any = {
        name: this.profileForm.value.name,
        phone: this.profileForm.value.phone,
        address: this.profileForm.value.address
      };

      this.restaurantService.updateProfile(profileData).subscribe({
        next: (response) => {
          this.isLoading = false;
          toast.success('✅ Profile updated successfully!');
          this.router.navigate(['/restaurant']);
        },
        error: (error) => {
          this.isLoading = false;
          const errorMsg = error.error?.message || 'Failed to update profile';
          toast.error(`❌ ${errorMsg}`);
          console.error('Profile update error:', error);
        }
      });
    } else {
      console.error('Form is invalid.');
      this.profileForm.markAllAsTouched();
      toast.error('❌ Please fill all required fields correctly');
    }
  }

  onCancel(): void {
    this.router.navigate(['/restaurant']);
  }
}