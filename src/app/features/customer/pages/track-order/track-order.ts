import { Component } from '@angular/core';
import { OrderTimeline } from "./order-timeline/order-timeline";

@Component({
  selector: 'app-track-order',
  imports: [OrderTimeline],
  templateUrl: './track-order.html',
  styleUrl: './track-order.css'
})
export class TrackOrder {

}
