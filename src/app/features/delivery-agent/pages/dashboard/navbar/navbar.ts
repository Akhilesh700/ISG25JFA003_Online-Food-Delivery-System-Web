import { Component, inject, Input, OnInit } from '@angular/core';
import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";
import { toast } from 'ngx-sonner';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { DeliveryAgentService } from '../../../../../core/services/delivery-agent/delivery-agent.service';
import { DeliveryAgentStatus, IDeliveryAgent } from '../../../../../models/delivery-agent/IDeliveryAgent';
import { ZardSwitchComponent } from "@shared/components/switch/switch.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar-delivery',
  imports: [ZardBreadcrumbModule, FormsModule, ZardSwitchComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarDelivery implements OnInit {

  protected authService = inject(AuthService);
  protected deliveryService = inject(DeliveryAgentService);

  deliveryAgentStatus!: DeliveryAgentStatus;
  agentName!: string;
  


  ngOnInit(): void {
    this.deliveryService.getAgentStatus().subscribe({
      next : (status : DeliveryAgentStatus) => {
        this.deliveryAgentStatus = status
        console.log(this.deliveryAgentStatus)
      },
      error : (err) => {
          toast.error(err)
      },
    });

    this.deliveryService.getAgentProfile().subscribe({
      next: (profile: IDeliveryAgent) => {
        this.agentName = profile.name;
      },
      error: (err) => {
        console.error(err);
        toast.error('Error while fetching delivery agent. Try again later.');
      }
    })

  }

  toggleStatus() {
    const newStatus: DeliveryAgentStatus  = this.deliveryAgentStatus === 'Available' ? 'Offline' : 'Available';
    this.deliveryService.updateAgentStatus(newStatus);
    
    console.log("I was colled.")
  }

  onLogout() {
    this.deliveryService.updateAgentStatus('Offline');
    this.authService.logout();
  }



}
