import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";
import { ZardBadgeComponent } from "@shared/components/badge/badge.component";
import { Observable } from 'rxjs';
import { IUserResponse, userProfileService } from 'src/app/core/services/customer/user-profile/user-profile.service';
import { ZardDialogService } from '@shared/components/dialog/dialog.service';
// 1. Import the standalone component
import { AddressDialog } from './address-dialog/address-dialog';

type DeliveryType = 'Delivery' | 'Pickup';
type DeliveryOption = 'Priority' | 'Standard' | 'Eco-Saver';

@Component({
  selector: 'app-delivery-details',
  // 2. Add standalone: true
  standalone: true, 
  // 3. Import AddressDialog here
  imports: [NgClass, ZardBreadcrumbModule, ZardBadgeComponent, AddressDialog],
  templateUrl: './delivery-details.html',
  styleUrl: './delivery-details.css'
})
export class DeliveryDetails {

  private userService = inject(userProfileService);
  private dialoagService = inject(ZardDialogService);

  @Input() selectedDeliveryType: DeliveryType = 'Delivery';
  @Input() selectedDeliveryOption: DeliveryOption = 'Standard';
  @Input() userProfile$!: Observable<IUserResponse>;
  @Output() deliveryTypeChange = new EventEmitter<DeliveryType>();
  @Output() deliveryOptionChange = new EventEmitter<DeliveryOption>();

  
  selectDeliveryType(type: DeliveryType): void {
    this.deliveryTypeChange.emit(type);
  }

  selectDeliveryOption(option: DeliveryOption): void {
    this.deliveryOptionChange.emit(option);
  }

  onEdit(section: 'location' | 'instructions'): void {
    if(section == 'location'){
      console.log('Called.')
      this.openDialog()
    }
  }

  openDialog() {
    this.dialoagService.create({
      zTitle: 'Change Address',
      zContent: AddressDialog,
      zOkText: 'Save',
      zOnOk: (instance: AddressDialog) => {
        const isValid = instance.save();

        if (isValid) {
          
          const formValue = instance.addressForm.getRawValue();
          const addressString = `${formValue.laneNo}, ${formValue.area}, ${formValue.city}, ${formValue.state}`;
          this.userService.updateUserAddress(addressString);
          return;

        } else {
         
          return false;
        }
      },
      zCancelText: 'Cancel',
      zWidth: '425px',
    });
  }
}