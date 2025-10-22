import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { OrderHistoryComponent } from './order-history/order-history';
// Import the new child component

// Interfaces can be moved to a separate file, but are kept here for simplicity
interface Order {
  id: string;
  date: string;
  items: string;
  total: number;
  status: 'Delivered' | 'In Transit' | 'Processing';
}
interface PaymentMethod {
  type: 'Visa' | 'Mastercard';
  last4: string;
  expires: string;
  isPreferred: boolean;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    // OrderHistoryComponent
  ],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css']
})
export class UserProfileComponent implements OnInit {
  isEditing = false;
  user = {
    name: 'Sarah Anderson',
    email: 'sarah.anderson@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Apartment 4B, San Francisco, CA 94102',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop'
  };
  previewImageUrl: string | ArrayBuffer | null = this.user.imageUrl;
  profileForm!: FormGroup;

  stats = { totalOrders: 24, completed: 20, inProgress: 4 };
  orders: Order[] = [
    { id: 'ORD-2024-001', date: 'Oct 12, 2025', items: 'Wireless Headphones, Phone Case', total: 159.99, status: 'Delivered' },
    { id: 'ORD-2024-002', date: 'Oct 8, 2025', items: 'Laptop Stand', total: 49.99, status: 'Delivered' },
    { id: 'ORD-2024-003', date: 'Oct 5, 2025', items: 'USB-C Cable (3 pack)', total: 24.99, status: 'Delivered' },
    { id: 'ORD-2024-004', date: 'Oct 3, 2025', items: 'Mechanical Keyboard', total: 129.99, status: 'In Transit' },
    { id: 'ORD-2024-005', date: 'Oct 1, 2025', items: 'Desk Organizer, Mouse Pad', total: 34.99, status: 'Processing' }
  ];
  paymentMethods: PaymentMethod[] = [
    { type: 'Visa', last4: '4242', expires: '12/26', isPreferred: true },
    { type: 'Mastercard', last4: '8888', expires: '09/27', isPreferred: false }
  ];

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      name: new FormControl(this.user.name, [Validators.required]),
      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
      phone: new FormControl(this.user.phone),
      address: new FormControl(this.user.address)
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm.setValue({
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone,
        address: this.user.address
      });
      this.previewImageUrl = this.user.imageUrl;
    }
  }

  onSave(): void {
    if (this.profileForm.valid) {
      this.user = { ...this.user, ...this.profileForm.value };
      if (this.previewImageUrl) {
        this.user.imageUrl = this.previewImageUrl as string;
      }
      this.isEditing = false;
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { this.previewImageUrl = reader.result; };
      reader.readAsDataURL(file);
    }
  }
}