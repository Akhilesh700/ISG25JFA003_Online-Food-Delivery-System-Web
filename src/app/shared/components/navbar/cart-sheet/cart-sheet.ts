import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ZardDialogService } from '@shared/components/dialog/dialog.service';
import { NoteModal } from './note-modal/note-modal';
import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";
import { IDish } from 'src/app/models/resturantInterface';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { selectCartItems, selectTotalPrice } from 'src/app/state/cart/cart.selector';
import { Router, RouterLink } from '@angular/router';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { decrement, increment, removeFromCart } from 'src/app/state/cart/cart.action';


interface cartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  description: string;
  rating: number;
}



@Component({
  selector: 'app-cart-sheet',
  imports: [ZardBreadcrumbModule, ZardButtonComponent],
  templateUrl: './cart-sheet.html',
  styleUrl: './cart-sheet.css'
})
export class CartSheet {


  
  @Output() 
  readonly checkout = new EventEmitter<cartItem[]>();
  
  
  protected readonly storeSerice = inject<Store<AppState>>(Store);
  protected readonly dialogService = inject(ZardDialogService); 
  private readonly router = inject(Router);
  
  cartItems$ = this.storeSerice.select(selectCartItems);
  totalPrice$ = this.storeSerice.select(selectTotalPrice);

 

  // sampleCartItems: cartItem[] = [];

  restaurant = {
    name: 'Gourmet Bistro',
    address: '123 Culinary Ave, Foodie City',
    contact: '(123) 456-7890',
    hours: 'Mon-Sun: 8am - 10pm',
    banner : 'https://img.freepik.com/free-photo/top-view-fast-food-mix-mozzarella-sticks-club-sandwich-hamburger-mushroom-pizza-caesar-shrimp-salad-french-fries-ketchup-mayo-cheese-sauces-table_141793-3998.jpg',
    description: 'Experience culinary excellence with our farm-to-table dishes, crafted from the freshest local ingredients. Join us for a memorable dining experience that delights the senses.'
  }


 
  public triggerCheckout():void {
    this.router.createUrlTree(['checkout'])
  }


  increaseCartItem(dishId: number) {
    this.storeSerice.dispatch(increment({ dishId }));
  }

  decreseCartItem(dishId: number) {
    this.storeSerice.dispatch(decrement({ dishId }));
  }

  removeItemFromCart(dishId: number) {
    this.storeSerice.dispatch(removeFromCart({ dishId }));
  }




  openDialog() {
    this.dialogService.create({
      zTitle: 'Add a Note',
      zContent: NoteModal,
      zOkText: 'Save',
      zWidth: '425px',
      zOnOk: (instance) => {
        instance.saveNote();
      }
    });
  }



}
