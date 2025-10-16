import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, ObservedValueOf } from 'rxjs';
import { IDish, IResturant } from 'src/app/models/resturantInterface';
import { AppState } from 'src/app/state/app.state';
import { selectCartItems, selectCartRestaurant, selectTotalPrice } from 'src/app/state/cart/cart.selector';
import { DeliveryDetails } from "./components/delivery-details/delivery-details";
import { OrderSummary } from "./components/order-summary/order-summary";
import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";
import { CartSummary } from "./components/cart-summary/cart-summary";
import { RestaurantCheckoutCart } from "./components/restaurant-checkout-cart/restaurant-checkout-cart";
import { IOrderSummary } from 'src/app/models/iOrderSummary';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [DeliveryDetails, OrderSummary, ZardBreadcrumbModule, CartSummary, RestaurantCheckoutCart],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
  protected readonly store = inject<Store<AppState>>(Store);

  cartItem$: Observable<IDish[]> = this.store.select(selectCartItems);
  restaurant$: Observable<IResturant> = this.store.select(selectCartRestaurant) as unknown as Observable<IResturant>;
  
  summary$: Observable<IOrderSummary>
  
  constructor() {
    const totalPrice$: Observable<number> = this.store.select(selectTotalPrice);
    this.summary$ = totalPrice$.pipe(
      map(price => {
        const promotion = price * 0.03;
        const deliveryFee = Math.max(price * 0.12, 40);
        const deliveryDiscount = Math.min(deliveryFee * 0.2, 10);
        const taxesAndFees = price*0.18 + price*0.05;
        const oldTaxesAndFees = price*0.28 + price*0.12;

        const finalTotal = price - promotion + deliveryFee - deliveryDiscount + taxesAndFees;

        return {
          subtotal: price,
          promotion: promotion,
          deliveryFee: deliveryFee,
          deliveryDiscount: deliveryDiscount,
          taxesAndFees: taxesAndFees,
          oldTaxesAndFees: oldTaxesAndFees,
          total: finalTotal
        }
      })
    )

  }


}
