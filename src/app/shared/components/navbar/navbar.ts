import { Component, inject, NgModule, OnInit } from '@angular/core';
import { ZardSwitchComponent } from "../switch/switch.component";
import { DarkModeService } from '@shared/services/darkmode.service';
import { FormsModule } from '@angular/forms';
import { ZardSheetService } from '../sheet/sheet.service';
import { CartSheet } from './cart-sheet/cart-sheet';
import { UserOptionsSheet } from './user-options-sheet/user-options-sheet';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { selectCartItems, selectCartState } from 'src/app/state/cart/cart.selector';
import { AsyncPipe } from '@angular/common';
import { IDish } from 'src/app/models/resturantInterface';
import { Router, RouterLink } from '@angular/router';

const getCurrentUser = () => {
  return {
    userId: '123',
    name: 'John Doe',
    avatarUrl: 'https://i.pravatar.cc/300',
    location: 'Coimbatore, In'
  }
}
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ZardSwitchComponent, FormsModule, AsyncPipe, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  protected readonly darkmodeService = inject(DarkModeService);
  protected readonly sheetService = inject(ZardSheetService)
  protected readonly storeSerice = inject<Store<AppState>>(Store);
  protected readonly router = inject(Router);



  isDarkMode: boolean = this.darkmodeService.getCurrentTheme() === 'dark';
  currentUser = getCurrentUser();



  
  isCartEmpty = true;
  cartItems$ = this.storeSerice.select(selectCartItems);
  
  toggleTheme(): void {
    this.darkmodeService.toggleTheme();

    this.isDarkMode = this.darkmodeService.getCurrentTheme() === 'dark';
  }

  openCartSheet() {
    this.sheetService.create({
      zTitle: 'Cart',
      zContent: CartSheet,
      zOkText: !this.isCartEmpty ? 'Checkout' : null,
      zSize: 'lg',
      zOnOk: () => {
          this.router.navigate(['user/checkout'])
      }
    });
  }

  openOptionsSheet() {
    this.sheetService.create({
      zContent: UserOptionsSheet,
      zSize: 'sm',
      zSide: 'left',
      zOkText: null,
    });
  }

  ngOnInit(): void {
      const items = this.cartItems$.subscribe((items:IDish[]) => {
        if(items && items.length>0) {

          this.isCartEmpty = false;
        }else{
          this.isCartEmpty = true;

        }
      })
      
  }

  getHomeRoute(): string {
    return '/user/home'
  }


}
