import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuItem } from '../../../../shared/models/menuitem';

@Component({
  selector: 'app-menu-item-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './menu-item-dialog.html' // Ensure this exists
})
export class MenuItemDialogComponent implements OnInit {
  @Input() item: MenuItem | null = null;
  // Emit type no longer includes restId
  @Output() save = new EventEmitter<Omit<MenuItem, 'itemId' | 'restId'> & { itemId?: number }>(); 
  @Output() close = new EventEmitter<void>();

  menuForm!: FormGroup;
  isEditMode = false;

  // AuthService is removed
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.menuForm = this.fb.group({
      itemId: [null], 
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      imgUrl: [''], 
      cuisineType: ['General', Validators.required],
      isAvailable: [true],
      isVegetarian: [false],
      size: ['medium'],
      prepTime: [10, Validators.min(1)],

    });

    // If editing, populate the form
    if (this.item) {
      this.isEditMode = true;
      // patchValue will ignore the missing restId control if item has it
      this.menuForm.patchValue(this.item); 
    } else {
      this.isEditMode = false;
    }
  }

  onSave(): void {
    if (this.menuForm.valid) {
      // Emit the raw form value (JSON object without restId)
      this.save.emit(this.menuForm.value); 
    }
  }

  onClose(): void {
    this.close.emit();
  }
}