import { Component, inject, OnInit } from '@angular/core';
import { RestaurantService } from '../../../../core/services/customer/restaurants/RestaurantService'
import { IDish, IResturant } from 'src/app/models/resturantInterface';
import { ItemCard } from "./item-card/item-card";
import { ZardSkeletonComponent } from "@shared/components/skeleton/skeleton.component";
import { Store } from '@ngrx/store';
import { addToCard, decrement, increment, removeFromCart } from 'src/app/state/cart/cart.action';
import { AppState } from 'src/app/state/app.state';
import { combineLatest, map, Observable, of, startWith } from 'rxjs';
import { selectCartItems } from 'src/app/state/cart/cart.selector';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-resturant',
  imports: [ItemCard, ZardSkeletonComponent, AsyncPipe],
  templateUrl: './resturant.html',
  styleUrl: './resturant.css'
})
// export class Resturant implements OnInit {
  
//   private readonly resturantService = inject(ResturantService)
//   protected readonly store = inject<Store<AppState>>(Store);

//   param:number = window.location.pathname.split('/').pop() as unknown as number;
  
//   isLoading: boolean = false;
  
//   resturant:IResturant =this.resturantService.getResturantById(this.param);

//   menuItems$:Observable<IDish[]> = of(this.resturant.dishes);
//   cartItem$: Observable<IDish[]> = this.store.select(selectCartItems);
//   mergeDishes$!: Observable<IDish[]>;


//   ngOnInit(): void {
//       this.mergeDishes$ = combineLatest([
//         this.menuItems$,
//         this.cartItem$
//       ]).pipe(
//         map(([menuItems, cartItems]) => {
//           // Create a map for quick lookup of cart quantities
//             const cartQuantities = cartItems.reduce((acc, item) => {
//             acc[item.id] = item.quantity;
//             return acc;
//           }, {} as { [id: string]: number });

//           // Merge menu dishes with cart quantity
//         return menuItems.map(menuDish => ({
//           ...menuDish,
//           // Set quantity from cart, or 0 if not in cart
//           quantity: cartQuantities[menuDish.id] || 0
//         }));
//         } )
//       )
//   }

//   addItemToCart(dish: IDish) {
//     this.store.dispatch(addToCard({dish}))
//   }

//   increaseCartItem(dishId: number) {
//     this.store.dispatch(increment({dishId}))
//   }

//   decreseCartItem(dishId: number) {
//     this.store.dispatch(decrement({dishId}));
//   }

//   removeItemFromCart(dishId: number) {
//     this.store.dispatch(removeFromCart({dishId}));
//   }



// }
export class Resturant implements OnInit {
  private readonly resturantService = inject(RestaurantService);
  protected readonly store = inject<Store<AppState>>(Store);
  param: number = Number(window.location.pathname.split('/').pop());

  resturant$!: Observable<IResturant>;
  menuItems$!: Observable<IDish[]>;
  cartItems$: Observable<IDish[]> = this.store.select(selectCartItems);
  mergedDishes$!: Observable<IDish[]>;


  ngOnInit(): void {
      // 1. Get the restaurant as an observable stream from the service.
    this.resturant$ = this.resturantService.getResturantById(this.param);
    
    // 2. Derive the menu items stream directly from the restaurant stream.
    this.menuItems$ = this.resturant$.pipe(
      map(restaurant => restaurant.dishes || []) // Safely access dishes
    );

    // 3. Combine menu and cart streams to sync quantities. This part was mostly correct.
    this.mergedDishes$ = combineLatest([
      this.menuItems$,
      this.cartItems$.pipe(startWith([])) // Use startWith to ensure it emits immediately
    ]).pipe(
      map(([menuItems, cartItems]) => {
        const cartMap = new Map<number, number>();
        cartItems.forEach(item => cartMap.set(item.itemId, item.quantity));

        return menuItems.map(menuDish => ({
          ...menuDish,
          quantity: cartMap.get(menuDish.itemId) || 0
        }));
      })
    );
  }


  addItemToCart(dish: IDish, restaurant: IResturant) {
    // This assumes your `addToCard` action has been updated to accept the restaurant.
    // If not, the action would be: this.store.dispatch(addToCard({ dish }));
    this.store.dispatch(addToCard({ dish, restaurant }));
  }

  increaseCartItem(dishId: number) {
    this.store.dispatch(increment({ dishId }));
  }

  decreseCartItem(dishId: number) {
    this.store.dispatch(decrement({ dishId }));
  }

  removeItemFromCart(dishId: number) {
    this.store.dispatch(removeFromCart({ dishId }));
  }




}
