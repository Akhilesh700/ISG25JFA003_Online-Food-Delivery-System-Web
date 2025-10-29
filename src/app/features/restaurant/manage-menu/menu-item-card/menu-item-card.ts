import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../../shared/models/menuitem';


@Component({
  selector: 'app-menu-item-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-item-card.html', 
})
export class MenuItemCardComponent {
  @Input({ required: true }) item!: MenuItem;
  @Output() edit = new EventEmitter<MenuItem>();
  @Output() delete = new EventEmitter<number>(); 

  onEdit(): void {
    this.edit.emit(this.item);
  }

  onDelete(): void {
    if (this.item?.itemId) { 
      this.delete.emit(this.item.itemId);
    } else {
      console.error('Delete clicked, but item ID (itemId) is missing:', this.item);
    }
  }
}