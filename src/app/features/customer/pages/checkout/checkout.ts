import { Component, effect, inject, NgZone, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, ObservedValueOf, pipe } from 'rxjs';
import { IDish, IResturant } from 'src/app/models/resturantInterface';
import { AppState } from 'src/app/state/app.state';
import { selectCartItems, selectCartRestaurant, selectTotalPrice } from 'src/app/state/cart/cart.selector';
import { DeliveryDetails } from "./components/delivery-details/delivery-details";
import { OrderSummary } from "./components/order-summary/order-summary";
import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";
import { CartSummary } from "./components/cart-summary/cart-summary";
import { RestaurantCheckoutCart } from "./components/restaurant-checkout-cart/restaurant-checkout-cart";
import { IOrderSummary } from 'src/app/models/iOrderSummary';
import { IUser, userService } from 'src/app/core/services/customer/userService';
import { Router } from '@angular/router';
import { ZardDialogService } from '@shared/components/dialog/dialog.service';
import { PaymentSucessDialog } from './components/payment-sucess-dialog/payment-sucess-dialog';
import { emptyCart } from 'src/app/state/cart/cart.action';

type PaymentStatus = {
  paymentId?: string,
  status : 'PENDING' | 'SUCCESS' | 'FAILED',
  date?: string
}


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [DeliveryDetails, OrderSummary, ZardBreadcrumbModule, CartSummary, RestaurantCheckoutCart],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  protected readonly store = inject<Store<AppState>>(Store);
  protected readonly zone = inject(NgZone);
  protected readonly userService = inject(userService)
  protected readonly router = inject(Router);
  private dialogService = inject(ZardDialogService);

  protected readonly isPaymentSuccess = signal<PaymentStatus>({
    status : 'PENDING'
  })



  cartItem$: Observable<IDish[]> = this.store.select(selectCartItems);
  restaurant$: Observable<IResturant> = this.store.select(selectCartRestaurant) as unknown as Observable<IResturant>;
  
  summary$: Observable<IOrderSummary>;

  
  amount!: number;
  currentRestaurant!: IResturant;

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
        this.amount = finalTotal;
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

    effect(() => {
      if(this.isPaymentSuccess().status === 'SUCCESS') {
        setTimeout(() => {
          // this.router.navigate(['/payment-confirmed'], {
          //   queryParams: {
          //     paymentId : this.isPaymentSuccess().paymentId 
          //   }
          // })
          this.router.navigate([''])
          this.openSucessDialog();
          this.store.dispatch(emptyCart());
        },1000)
      }
      if(this.isPaymentSuccess().status === 'FAILED') {
        setTimeout(() => {
          this.router.navigate(['/payment-failed'], {
            queryParams: {
              paymentId : this.isPaymentSuccess().paymentId 
            }
          })
        },1000)
      }
    })
    

  }

  ngOnInit(): void {
         this.restaurant$.pipe(
      map(e => {
        this.currentRestaurant = { ...e };
        console.log(this.currentRestaurant)
        return null
      })
    )
  }


  currentUser:IUser = this.userService.useCurrentUser()

  orderDetails:any = {
    orderId: "#ORD_xhsa75Gs"
  };


  




  onPay() {
    const amount = this.amount
    const self = this;
    const options = {
        key: 'rzp_test_1DP5mmOlF5G5ag', // Demo key
        amount: amount * 100 , // Amount in paise
        currency: 'INR',
        name: 'Dine Cognizant',
        description: 'Your Tasty Food is Waiting....',
        image: this.currentUser.avatarUrl,
        handler: function (response: any) {
          self.zone.run(() => {
            self.orderDetails = {
              paymentId: response.razorpay_payment_id,
              amount: amount,
              date: new Date().toLocaleString()
            };
            self.isPaymentSuccess.set({
              paymentId: response.razorpay_payment_id,
              status: 'SUCCESS',
              date: new Date().toLocaleString()
            })
          });
        },
        prefill: {
          name: this.currentUser.name,
          email: this.currentUser.email,
          contact: this.currentUser.phone
        },
        theme: {
          color: '#fc6f03'
        }
      };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }



  openSucessDialog() {
    this.dialogService.create({
      zTitle: 'Payment Sucess',
      zDescription: `Your order has been placed successfully.`,
      zContent: PaymentSucessDialog,
      zData: {
        orderId : "#ORD_agsidakautf",
        payementId: this.isPaymentSuccess().date,
        paymentDate : this.isPaymentSuccess().date,
        resturant: this.currentRestaurant,
        amount : this.orderDetails.amount 
      } as any,
      zOkText: 'Track Order',
      zOnOk: (instance) => {
        instance.trackOrder()
      },
      zWidth: '425px',
    });
  }










}
