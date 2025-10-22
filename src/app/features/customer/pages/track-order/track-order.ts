import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderTimeline } from "./order-timeline/order-timeline";
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryStatus, IOrderInfoResponse } from 'src/app/core/services/customer/track-order/delivery-status.service';

const orderStatusSet = {
  'PLACED': 1,
  'PREPARING': 2,
  'OUT_FOR_DELIVERY': 3, // Keys with spaces must be in quotes
  'DELIVERED': 4
};

@Component({
  selector: 'app-track-order',
  imports: [OrderTimeline],
  templateUrl: './track-order.html',
  styleUrl: './track-order.css'
})
export class TrackOrder implements OnInit {

  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly deliveryStatus = inject(DeliveryStatus);

  orderId!: number;
  orderStatus:string = "";

  currentStep!: number;



  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.orderId = params['orderId']

        this.deliveryStatus.getDeliveryStatus(this.orderId).subscribe((orderInfo: IOrderInfoResponse) => {
          this.orderStatus = orderInfo.status;
          console.log(orderInfo);
          this.currentStep= orderStatusSet[this.orderStatus as keyof typeof orderStatusSet]
          console.log(this.currentStep);
        })
      });



  }
  

}
