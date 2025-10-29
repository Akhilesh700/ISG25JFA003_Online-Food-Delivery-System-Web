import { Component, inject, OnInit } from '@angular/core';
import { DeliveryAgentService } from 'src/app/core/services/delivery-agent/delivery-agent.service';
import { DeliveryAgentStatus } from 'src/app/models/delivery-agent/IDeliveryAgent';
import { AssignedOrderCard } from "./assigned-order-card/assigned-order-card";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [AssignedOrderCard, NgClass],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  protected deliveryService = inject(DeliveryAgentService);

  deliveryAgentStatus: DeliveryAgentStatus = 'Offline'

  ngOnInit(): void {
    const self = this;
    this.deliveryService.getAgentStatus().subscribe({
      next(status : DeliveryAgentStatus) {
        self.deliveryAgentStatus = status
      },
      error(err) {
        console.error("Failed to get agent status:", err);
        self.deliveryAgentStatus = 'Offline';
      }
    })
  }


  

}
