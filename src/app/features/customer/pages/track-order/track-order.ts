import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderTimeline } from "./order-timeline/order-timeline";
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryStatus, IOrderInfoResponse } from 'src/app/core/services/customer/track-order/delivery-status.service';
import { DeliveryAgentCard } from "./delivery-agent-card/delivery-agent-card";
import { RestaurantCheckoutCart } from "../checkout/components/restaurant-checkout-cart/restaurant-checkout-cart";
import { ResturantTrackOrder } from "./resturant-track-order/resturant-track-order";
import { OrderItemsTracking } from "./order-items-tracking/order-items-tracking";
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from 'ngx-sonner';

const orderStatusSet = {
  'PLACED': 1,
  'PREPARING': 2,
  'OUT_FOR_DELIVERY': 3, // Keys with spaces must be in quotes
  'DELIVERED': 4
};

@Component({
  selector: 'app-track-order',
  imports: [OrderTimeline, DeliveryAgentCard, ResturantTrackOrder, OrderItemsTracking],
  templateUrl: './track-order.html',
  styleUrl: './track-order.css'
})
export class TrackOrder implements OnInit {

  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly deliveryStatus = inject(DeliveryStatus);

  orderId!: number;
  orderStatus:string = "";
  order!: IOrderInfoResponse;
  currentStep!: number;

  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.orderId = params['orderId']

        this.fetchOrderInfo()
      });
  }


  fetchOrderInfo(): void {
    // Guard against running before orderId is set
    if (!this.orderId) {
      return;
    }

    this.deliveryStatus.getDeliveryStatus(this.orderId).subscribe(
      (orderInfo: IOrderInfoResponse) => {
      this.orderStatus = orderInfo.status;
      this.order = orderInfo;
      this.currentStep = orderStatusSet[this.orderStatus as keyof typeof orderStatusSet];
      console.log("Data (re)fetched, current step is:", this.currentStep);
      },    
      (error: HttpErrorResponse) => {
        console.error("Error fetching order info:", error);

      
        let errorMessage:string = error.error?.message || 'Failed to find the order.';
        if(errorMessage.startsWith("This order does not belongs to customer")) {
          errorMessage = "This order does not belongs to you"
        }
        toast.error(errorMessage);
        
        //TODO: Change it to 'user/orders'
        this.router.navigate(['user/home'])
      }
    
    
    );
  }
  

  handleRefresh(): void {
    console.log("Child requested a refresh. Re-fetching data...");
    this.fetchOrderInfo();
  }

}
