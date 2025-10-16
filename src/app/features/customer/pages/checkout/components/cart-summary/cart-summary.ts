import { Component, Input } from '@angular/core';
import { IDish } from 'src/app/models/resturantInterface';

@Component({
  selector: 'app-cart-summary',
  imports: [],
  templateUrl: './cart-summary.html',
  styleUrl: './cart-summary.css'
})
export class CartSummary {

  @Input() cartItems!:IDish[] ;
  
  isCollapsed:boolean = true;

  accordion() {
    this.isCollapsed = !this.isCollapsed;
  }


}
