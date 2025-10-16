import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ZardDialogService } from '@shared/components/dialog/dialog.service';
import { NoteModal } from './note-modal/note-modal';
import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";
import { IDish } from 'src/app/models/resturantInterface';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { selectCartItems } from 'src/app/state/cart/cart.selector';
import { Router, RouterLink } from '@angular/router';
import { ZardButtonComponent } from '@shared/components/button/button.component';


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


  sampleCartItems: cartItem[] = [
  {
    id: '5',
    name: 'Artisan Sourdough Loaf',
    price: 6.75,
    quantity: 1,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE9r-lTbqJKsW1nwiQTdVftDfHtIbyqbzyPQ&s',
    description: 'Freshly baked, slow-fermented, rustic crust.',
    rating: 4.7,
  },
  {
    id: '6',
    name: 'Organic Free-Range Eggs (Dozen)',
    price: 4.99,
    quantity: 2,
    imageUrl: 'https://m.media-amazon.com/images/I/61B8rojWqTL._UF894,1000_QL80_.jpg',
    description: 'Large, brown eggs from pasture-raised hens.',
    rating: 4.5,
  },
  {
    id: '7',
    name: 'Dark Roast Coffee Beans (12oz)',
    price: 12.95,
    quantity: 1,
    imageUrl: 'https://coffeebros.com/cdn/shop/articles/dark-roast-coffee.jpg?v=1649761951',
    description: 'Bold, smoky flavor with notes of chocolate and caramel.',
    rating: 4.9,
  },
  {
    id: '8',
    name: 'Gourmet Italian Pasta (500g)',
    price: 3.25,
    quantity: 4,
    imageUrl: 'https://images.squarespace-cdn.com/content/v1/5dd5b5e9f226644911c4d733/1632856351292-A448T7ULQK0N8XQ8Y6MB/famous-italian-pasta-dishes.jpg',
    description: 'Bronze-die extruded semolina pasta for a perfect sauce cling.',
    rating: 4.3,
  }]


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
    this.router.navigate(['/checkout'])
  }


  increaseItemQuantity(itemId: string) : void {
    this.sampleCartItems = this.sampleCartItems.map(item => {
      if( item.id === itemId) {
        if(item.quantity === 10) {
          return item; // Prevent quantity from going above 10
        }
        return { ...item, quantity: item.quantity + 1 }
      }
      return item;
    })
  }

  decreaseItemQuantity(itemId: string) : void {
    this.sampleCartItems = this.sampleCartItems.map(item => {
      if( item.id === itemId) {
        
        return { ...item, quantity: item.quantity - 1 }
      }
      return item;
    }).filter(item => item.quantity > 0) // Remove items with quantity 0
  }




  openDialog() {
    this.dialogService.create({
      zTitle: 'Add a Note',
      zContent: NoteModal,
      zOkText: 'Save',
      zWidth: '425px',
    });
  }










}
