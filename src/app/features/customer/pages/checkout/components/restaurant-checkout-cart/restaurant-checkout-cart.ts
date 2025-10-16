import { Component, Input } from '@angular/core';
import { IResturant } from 'src/app/models/resturantInterface';
import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";
import { ZardButtonComponent } from '@shared/components/button/button.component';


@Component({
  selector: 'app-restaurant-checkout-cart',
  standalone: true,
  imports: [ZardButtonComponent],
  templateUrl: './restaurant-checkout-cart.html',
  styleUrl: './restaurant-checkout-cart.css'
})
export class RestaurantCheckoutCart {

  @Input() restaurant: IResturant = null as unknown as IResturant;

}
