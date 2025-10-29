import { Component, Input } from '@angular/core';
import { IOrderInfoResponse } from 'src/app/core/services/customer/track-order/delivery-status.service';

@Component({
  selector: 'app-delivery-agent-card',
  imports: [],
  templateUrl: './delivery-agent-card.html',
  styleUrl: './delivery-agent-card.css'
})
export class DeliveryAgentCard {

  @Input()
  order!: IOrderInfoResponse;
}
