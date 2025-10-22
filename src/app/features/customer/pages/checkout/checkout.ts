// import { Component, effect, inject, NgZone, OnInit, signal } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { first, forkJoin, map, Observable, ObservedValueOf, pipe, switchMap, tap } from 'rxjs';
// import { IDish, IResturant } from 'src/app/models/resturantInterface';
// import { AppState } from 'src/app/state/app.state';
// import { selectCartItems, selectCartRestaurant, selectTotalPrice } from 'src/app/state/cart/cart.selector';
// import { DeliveryDetails } from "./components/delivery-details/delivery-details";
// import { OrderSummary } from "./components/order-summary/order-summary";
// import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";
// import { CartSummary } from "./components/cart-summary/cart-summary";
// import { RestaurantCheckoutCart } from "./components/restaurant-checkout-cart/restaurant-checkout-cart";
// import { IOrderSummary } from 'src/app/models/iOrderSummary';
// import { IUser, userService } from 'src/app/core/services/customer/userService';
// import { Router } from '@angular/router';
// import { ZardDialogService } from '@shared/components/dialog/dialog.service';
// import { PaymentSucessDialog } from './components/payment-sucess-dialog/payment-sucess-dialog';
// import { emptyCart } from 'src/app/state/cart/cart.action';
// import { OrderApiService } from 'src/app/core/services/customer/order-api.service';
// import { CartApiService } from 'src/app/core/services/customer/checkout/cart-api.service';
// import { toast } from 'ngx-sonner';

// type PaymentStatus = {
//   paymentId?: string,
//   status : 'PENDING' | 'SUCCESS' | 'FAILED',
//   date?: string
// }


// @Component({
//   selector: 'app-checkout',
//   standalone: true,
//   imports: [DeliveryDetails, OrderSummary, ZardBreadcrumbModule, CartSummary, RestaurantCheckoutCart],
//   templateUrl: './checkout.html',
//   styleUrl: './checkout.css'
// })
// export class Checkout implements OnInit {

//   protected readonly store = inject<Store<AppState>>(Store);
//   protected readonly zone = inject(NgZone);
//   protected readonly userService = inject(userService)
//   protected readonly router = inject(Router);
//   private dialogService = inject(ZardDialogService);
//   private cartApiService = inject(CartApiService);
//   private orderApiService = inject(OrderApiService);

  
//   protected readonly isPaymentSuccess = signal<PaymentStatus>({
//     status : 'PENDING'
//   })



//   cartItem$: Observable<IDish[]> = this.store.select(selectCartItems);
//   restaurant$: Observable<IResturant> = this.store.select(selectCartRestaurant) as unknown as Observable<IResturant>;
//   summary$: Observable<IOrderSummary>;

  
//   amount!: number;
//   currentRestaurant!: IResturant;

//   constructor() {
//     const totalPrice$: Observable<number> = this.store.select(selectTotalPrice);
//     this.summary$ = totalPrice$.pipe(
//       map(price => {
//         const promotion = price * 0.03;
//         const deliveryFee = Math.max(price * 0.12, 40);
//         const deliveryDiscount = Math.min(deliveryFee * 0.2, 10);
//         const taxesAndFees = price*0.18 + price*0.05;
//         const oldTaxesAndFees = price*0.28 + price*0.12;

//         const finalTotal = price - promotion + deliveryFee - deliveryDiscount + taxesAndFees;
//         this.amount = finalTotal;
//         return {
//           subtotal: price,
//           promotion: promotion,
//           deliveryFee: deliveryFee,
//           deliveryDiscount: deliveryDiscount,
//           taxesAndFees: taxesAndFees,
//           oldTaxesAndFees: oldTaxesAndFees,
//           total: finalTotal
//         }
//       })
//     )

//     // effect(() => {
//     //   if(this.isPaymentSuccess().status === 'SUCCESS') {
//     //     setTimeout(() => {
          
//     //       this.router.navigate(['user/home'])
//     //       this.openSucessDialog();
//     //     },300)
//     //   }
//     //   if(this.isPaymentSuccess().status === 'FAILED') {
//     //     setTimeout(() => {
//     //       this.router.navigate(['/payment-failed'], {
//     //         queryParams: {
//     //           paymentId : this.isPaymentSuccess().paymentId 
//     //         }
//     //       })
//     //     },1000)
//     //   }
//     // })
    

//   }

//   ngOnInit(): void {
//          this.restaurant$.pipe(
//       map(e => {
//         this.currentRestaurant = {...e};
//         console.log(this.currentRestaurant)
//         return null
//       })
//     )
//   }


//   currentUser:IUser = this.userService.useCurrentUser()

//   orderDetails:any = {
//     orderId: "#ORD_xhsa75Gs"
//   };


  




  // onPay() {
  //   const amount = this.amount
  //   const self = this;
  //   const options = {
  //       key: 'rzp_test_1DP5mmOlF5G5ag', // Demo key
  //       amount: amount * 100 , // Amount in paise
  //       currency: 'INR',
  //       name: 'Dine Cognizant',
  //       description: 'Your Tasty Food is Waiting....',
  //       image: this.currentUser.avatarUrl,
  //       handler: function (response: any) {
  //         self.zone.run(() => {
  //           self.orderDetails = {
  //             paymentId: response.razorpay_payment_id,
  //             amount: amount,
  //             date: new Date().toLocaleString()
  //           };
  //           self.isPaymentSuccess.set({
  //             paymentId: response.razorpay_payment_id,
  //             status: 'SUCCESS',
  //             date: new Date().toLocaleString()
  //           })
  //         });
  //         self.store.dispatch(emptyCart());
  //       },
  //       prefill: {
  //         name: this.currentUser.name,
  //         email: this.currentUser.email,
  //         contact: this.currentUser.phone
  //       },
  //       theme: {
  //         color: '#fc6f03'
  //       }
  //     };
  //   const rzp = new (window as any).Razorpay(options);
  //   rzp.open();
  // }


//   onPay() {
//     forkJoin({
//       items: this.cartItem$.pipe(first()),
//       restaurant: this.restaurant$.pipe(first())      
//     }).pipe(
//       switchMap(({items}) => this.cartApiService.saveCart(items).pipe(
//         switchMap(cartResponse => this.orderApiService.placeOrder(cartResponse.cartId)),
//         tap(orderResponse => this.openRazorPay(orderResponse.orderId, this.amount))
//       ))
//     ).subscribe({
//       error(err) {
//           toast.error('Failed to place the order')
//           console.error(err);

//       },
//     })
//   }

//   openRazorpay(orderId: number, amount: number) {
//     const options = {
//       key: "rzp_test_1DP5mmOlF5G5ag",
//       amount: amount * 100,
//       currency: 'INR',
//       name: 'Dine Cognizant',
//       description: 'Your Tasty Food is Waiting....',
//       image: this.currentUser.avatarUrl,
//       orderId: orderId,
//       handler: (response: any) => {
//         this.zone.run(() => {
//           this.orderApiService.updatePaymentStatus(orderId, response.razorpay_payment_id, 'Successful').subscribe(()=>{
//             this.store.dispatch(emptyCart());
//             this.openSucessDialog(orderId, response.razorpay_payment_id, amount)
//           })
//         })
//       },
//       modal:{
//         ondismiss: () => {
//           this.zone.run(() => {
//             this.orderApiService.updatePaymentStatus(orderId, 238741 , 'Failed').subscribe(() => {
//               toast.message('Paymnet failed or cancelled');
//               console.log('Payment failed or was cancelled by the user.');
//             });
//           })
//         }
//       },
//       prefill: {
//         name: this.currentUser.name,
//         email: this.currentUser.email,
//         contact: this.currentUser.phone
//       },

//       theme: {
//         color: '#fc6f03'
//       }

//     }



//     const rzp = new (window as any).Razorpay(options);
//     rzp.open();
//   }



//   openSucessDialog(orderId: string, paymentId: string, amount: number) {

//     this.dialogService.create({
//       zTitle: 'Payment Sucess',
//       zDescription: `Your order has been placed successfully.`,
//       zContent: PaymentSucessDialog,
//       zData: {
//         orderId: orderId,
//         paymentId: paymentId,
//         paymentDate: new Date().toLocaleString(),
//         resturant: this.currentRestaurant,
//         amount : amount 
//       } as any,
//       zOkText: 'Track Order',
//       zOnOk: (instance) => {
//         instance.trackOrder()
//       },
//       zWidth: '425px',
//     });
//   }










// }

import { Component, inject, NgZone, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { forkJoin, map, Observable, switchMap, tap, first } from 'rxjs';

import { IDish, IResturant } from 'src/app/models/resturantInterface';
import { IOrderSummary } from 'src/app/models/iOrderSummary';
import { IUser, userService } from 'src/app/core/services/customer/userService';
import { CartApiService } from 'src/app/core/services/customer/checkout/cart-api.service';
import { OrderApiService } from 'src/app/core/services/customer/order-api.service';

import { AppState } from 'src/app/state/app.state';
import { emptyCart } from 'src/app/state/cart/cart.action';
import { selectCartItems, selectCartRestaurant, selectTotalPrice } from 'src/app/state/cart/cart.selector';

import { DeliveryDetails } from "./components/delivery-details/delivery-details";
import { OrderSummary } from "./components/order-summary/order-summary";
import { CartSummary } from "./components/cart-summary/cart-summary";
import { RestaurantCheckoutCart } from "./components/restaurant-checkout-cart/restaurant-checkout-cart";
import { PaymentSucessDialog } from './components/payment-sucess-dialog/payment-sucess-dialog';

import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";
import { ZardDialogService } from '@shared/components/dialog/dialog.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    DeliveryDetails,
    OrderSummary,
    ZardBreadcrumbModule,
    CartSummary,
    RestaurantCheckoutCart
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  // Injected services and store
  protected readonly store = inject<Store<AppState>>(Store);
  protected readonly zone = inject(NgZone);
  protected readonly userService = inject(userService);
  protected readonly router = inject(Router);
  private dialogService = inject(ZardDialogService);
  private cartApiService = inject(CartApiService);
  private orderApiService = inject(OrderApiService);

  // UI state signal
  isLoading = signal(false);

  // Observables from the NgRx store
  cartItems$: Observable<IDish[]> = this.store.select(selectCartItems);
  restaurant$: Observable<IResturant> = this.store.select(selectCartRestaurant) as unknown as Observable<IResturant>;
  summary$: Observable<IOrderSummary>;
  
  // Class properties
  amount!: number;
  currentUser: IUser = this.userService.useCurrentUser();

  constructor() {
    const totalPrice$: Observable<number> = this.store.select(selectTotalPrice);
    this.summary$ = totalPrice$.pipe(
      map(price => {
        const promotion = price * 0.03;
        const deliveryFee = Math.max(price * 0.12, 40);
        const deliveryDiscount = Math.min(deliveryFee * 0.2, 10);
        const taxesAndFees = price * 0.18 + price * 0.05;
        const oldTaxesAndFees = price * 0.28 + price * 0.12;

        const finalTotal = price - promotion + deliveryFee - deliveryDiscount + taxesAndFees;
        this.amount = finalTotal;
        
        return {
          subtotal: price,
          promotion,
          deliveryFee,
          deliveryDiscount,
          taxesAndFees,
          oldTaxesAndFees,
          total: finalTotal
        };
      })
    );
  }

  ngOnInit(): void {}

  onPay() {
    this.isLoading.set(true);

    // 1. Get the latest cart and restaurant data from the store
    forkJoin({
      items: this.cartItems$.pipe(first()),
      restaurant: this.restaurant$.pipe(first())
    }).pipe(
      // 2. Save the cart, but keep 'restaurant' for the next step
      switchMap(({ items, restaurant }) => 
        this.cartApiService.saveCart(items).pipe(
          map(cartResponse => ({ cartResponse, restaurant })) // Pass restaurant along
        )
      ),
      // 3. Place the order, but keep 'restaurant'
      switchMap(({ cartResponse, restaurant }) => 
        this.orderApiService.placeOrder(cartResponse.cartId).pipe(
          map(orderResponse => ({ orderResponse, restaurant })) // Pass restaurant along again
        )
      ),
      // 4. Open Razorpay, now with access to the order and restaurant
      tap(({ orderResponse, restaurant }) => 
        this.openRazorpay(orderResponse.orderId, this.amount, restaurant)
      )
    ).subscribe({
      error: (err) => {
        console.error('Failed to place order:', err);
        this.isLoading.set(false);
        // You could show an error toast/message to the user here
      }
    });
  }

  openRazorpay(orderId: number, amount: number, restaurant:IResturant) {

    const options = {
      key: 'rzp_test_1DP5mmOlF5G5ag', // Demo key
      amount: amount * 100 , // Amount in paise
      currency: 'INR',
      name: 'Dine Cognizant',
      description: 'Your Tasty Food is Waiting....',
      image: this.currentUser.avatarUrl,
     
      handler: (response: any) => {
        this.zone.run(() => {
          // 5a. On successful payment, update status in the backend
          this.orderApiService.updatePaymentStatus(orderId, response.razorpay_payment_id, 'Successful', amount).subscribe(() => {
            this.store.dispatch(emptyCart());
            this.openSuccessDialog(orderId, response.razorpay_payment_id, amount, restaurant);
            this.isLoading.set(false);
          });
        });
      },
      modal: {
        ondismiss: () => {
          this.zone.run(() => {
            // 5b. On payment dismissal/failure, update status
            toast.error("Payment Failed.")
            this.store.dispatch(emptyCart());
            this.orderApiService.updatePaymentStatus(orderId, "TXN_FAILED_ajhf63refYAG", 'Failed', amount).subscribe(() => {
              console.log('Payment failed or was cancelled by the user.');
              this.isLoading.set(false);
              // Optionally show a "Payment Failed" message
            });
          });
        }
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

  openSuccessDialog(orderId: number, paymentId: number, amount: number, restaurant:IResturant) {
    this.dialogService.create({
      zTitle: 'Payment Success',
      zDescription: `Your order has been placed successfully.`,
      zContent: PaymentSucessDialog,
      zData: {
        orderId: orderId,
        paymentId: paymentId,
        paymentDate: new Date().toLocaleString(),
        restaurant: restaurant, 
        amount: amount
      },
      zOkText: 'Track Order',
      zOnOk: (i) => {
        i.trackOrder();
      },
      zWidth: '425px',
    });
  }
}