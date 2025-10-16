import { Component, OnInit } from '@angular/core';
import { RestaurantFormComponent } from '../signup-form/restaurant-form/restaurant-form.component';
import { DeliveryAgentFormComponent } from '../signup-form/delivery-agent-form/delivery-agent-form.component';
import { CustomerFormComponent } from '../signup-form/customer-form/customer-form.component';
import { ZardCardComponent } from "@shared/components/card/card.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  imports: [
    RestaurantFormComponent,
    DeliveryAgentFormComponent,
    CustomerFormComponent,
    ZardCardComponent
],
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.css']
})
export class SignupPageComponent implements OnInit {

  formType: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.formType = params.get('type');
    });
  }

}
