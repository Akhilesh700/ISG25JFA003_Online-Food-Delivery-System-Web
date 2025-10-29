import { Component, Input } from '@angular/core';
import { IOrderInfoResponse } from 'src/app/core/services/customer/track-order/delivery-status.service';

@Component({
  selector: 'app-order-items-tracking',
  imports: [],
  templateUrl: './order-items-tracking.html',
  styleUrl: './order-items-tracking.css'
})
export class OrderItemsTracking {
  @Input() order!: IOrderInfoResponse;
}
