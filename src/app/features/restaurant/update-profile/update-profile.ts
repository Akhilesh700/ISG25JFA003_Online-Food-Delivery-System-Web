import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      name: new FormControl('Albert Juan', [Validators.required]),
      email: new FormControl('albert.juan@example.com', [Validators.required, Validators.email]),
      phone: new FormControl('+91 98765 43210', [Validators.required])
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
      console.log('Form Submitted! Data:', this.profileForm.value);
      toast.success('Profile has been updated');
      this.router.navigate(['/restaurant']);
    } else {
      console.error('Form is invalid.');
      this.profileForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/restaurant']);
  }
}