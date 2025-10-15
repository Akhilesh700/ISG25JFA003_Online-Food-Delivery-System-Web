import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";
import { ZardBadgeComponent } from "@shared/components/badge/badge.component";

type DeliveryType = 'Delivery' | 'Pickup';
type DeliveryOption = 'Priority' | 'Standard' | 'Eco-Saver'

@Component({
  selector: 'app-delivery-details',
  imports: [NgClass, ZardBreadcrumbModule, ZardBadgeComponent],
  templateUrl: './delivery-details.html',
  styleUrl: './delivery-details.css'
})
export class DeliveryDetails {
  /**
   * INPUTS: Data passed down from the parent component.
   */

  // Determines which toggle is active: 'Delivery' or 'Pickup'.
  @Input() selectedDeliveryType: DeliveryType = 'Delivery';

  // Determines which delivery option is highlighted.
  @Input() selectedDeliveryOption: DeliveryOption = 'Standard';

  /**
   * OUTPUTS: Events emitted up to the parent component.
   */

  // Emits when the user toggles between 'Delivery' and 'Pickup'.
  @Output() deliveryTypeChange = new EventEmitter<DeliveryType>();

  // Emits when the user selects a new delivery option.
  @Output() deliveryOptionChange = new EventEmitter<DeliveryOption>();

  // Emits when the user clicks an 'Edit' button, passing which section to edit.
  @Output() edit = new EventEmitter<'location' | 'instructions'>();


  /**
   * METHODS: Internal functions to handle user interactions.
   */

  // Called when a delivery type button is clicked.
  selectDeliveryType(type: DeliveryType): void {
    // Note: We don't change the state here directly.
    // We emit an event to let the parent component manage the state.
    this.deliveryTypeChange.emit(type);
  }

  // Called when a delivery option card is clicked.
  selectDeliveryOption(option: DeliveryOption): void {
    this.deliveryOptionChange.emit(option);
  }

  // Called when an edit button is clicked.
  onEdit(section: 'location' | 'instructions'): void {
    this.edit.emit(section);
  }
}
