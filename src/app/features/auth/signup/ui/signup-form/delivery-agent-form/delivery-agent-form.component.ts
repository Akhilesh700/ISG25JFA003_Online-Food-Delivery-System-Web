import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { toast } from 'ngx-sonner';
import { AuthService } from '../../../../../../core/services/auth/auth.service';
import { AgentSignupResponse } from '../../../../../../core/services/auth/auth.models';
import { iAgentSignup } from '../../../../../../models/iSignUp';


@Component({
  selector: 'app-delivery-agent-form', // Ensure this selector matches your usage
  standalone: true,
  imports: [
    ReactiveFormsModule, // Required for FormGroup
    CommonModule // Required for @for, @if
    // Removed ZardCardComponent as your new HTML uses plain divs with Tailwind
  ],
  templateUrl: './delivery-agent-form.component.html', // Path to your HTML file
  styleUrls: ['./delivery-agent-form.component.css']  // Path to your CSS file
})
export class DeliveryAgentFormComponent implements OnInit {
  
  // --- Dependency Injection ---
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // --- Component State ---
  deliveryAgentForm!: FormGroup;
  submitted = false;
  isLoading = false;

  // Options for the Identity Proof dropdown
  identityProofTypes: string[] = [
    'Aadhaar Card',
    'Voter ID Card',
    'Driving License',
    'Passport'
  ];

  ngOnInit(): void {
    // Initialize the form with controls and their validators
    this.deliveryAgentForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Validates a 10-digit number
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      identityProofType: ['', [Validators.required]],
      identityProofNo: ['', [Validators.required]]
    });
  }

  // Getter to access form controls easily in the template
  get f() {
    return this.deliveryAgentForm.controls;
  }

  /**
   * Handles the form submission by validating, calling the auth service,
   * and providing user feedback.
   */
  onSubmit(): void {
    this.submitted = true;
    
    // Check if the form is valid
    if (this.deliveryAgentForm.invalid) {
      console.error('Form is invalid. Please check the fields.');
      this.deliveryAgentForm.markAllAsTouched(); // Trigger validation messages
      return; // Stop submission
    }

    this.isLoading = true; // Show loading indicator

    // Construct the payload from form values
    const credentials: iAgentSignup = {
      email: this.f['email'].value,
      password: this.f['password'].value,
      name: this.f['name'].value,
      phone: this.f['phone'].value,
      identityProofType: this.f['identityProofType'].value,
      identityProofNo: this.f['identityProofNo'].value,
    };

    // Call the auth service to sign up the agent
    this.authService.agentSignUp(credentials).pipe(
      finalize(() => this.isLoading = false) // Ensure loading is turned off on complete/error
    ).subscribe({
      next: (response: AgentSignupResponse) => {
        toast.success(`Account created successfully! Redirecting to login...`);
        // Redirect to login after a short delay
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3500); // 3.5 second delay
      },
      error: (err: HttpErrorResponse) => {
        this.submitted = false; // Allow user to try again
        
        // Handle specific "Conflict" error (user already exists)
        if (err.status === 409) {
          const message = err.error?.message || 'An account with this email or phone number already exists.';
          toast.error(message);
        } else {
          // Handle all other errors (400, 500, etc.)
          const message = err.error?.message || 'An unknown error occurred during signup. Please try again.';
          toast.error(message);
        }
      }
    });
  }
}