import { AsyncPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Z_MODAL_DATA } from '@shared/components/dialog/dialog.service';
import { map, Observable } from 'rxjs';
import { IResturant } from 'src/app/models/resturantInterface';

interface orderDetails {
  orderId: string,
  paymemtId: string,
  date: string,
  resturant: IResturant,
  amount: number
}

@Component({
  selector: 'app-payment-sucess-dialog',
  imports: [],
  templateUrl: './payment-sucess-dialog.html',
  styleUrl: './payment-sucess-dialog.css'
})
export class PaymentSucessDialog {

  protected readonly router = inject(Router); 
  protected orderDetails: orderDetails = inject(Z_MODAL_DATA);

  
  trackOrder() {
    this.router.navigate([`track-order`], {
      queryParams: {orderId : this.orderDetails.orderId}
    })
  }

  backToHome() {

  }
}
