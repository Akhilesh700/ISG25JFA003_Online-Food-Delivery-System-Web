import { Component, EventEmitter, inject, Input, input, OnInit, Output } from '@angular/core';
import { IDish } from 'src/app/models/resturantInterface';
import { ZardBadgeComponent } from "@shared/components/badge/badge.component";
import { selectCartItems } from 'src/app/state/cart/cart.selector';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { ZardDialogService } from '@shared/components/dialog/dialog.service';
import { CardModal } from '../components/card-modal/card-modal';

@Component({
  selector: 'app-item-card',
  imports: [ZardBadgeComponent],
  templateUrl: './item-card.html',
  styleUrl: './item-card.css'
})
export class ItemCard implements OnInit {
  protected readonly storeSerice = inject<Store<AppState>>(Store);
  private dialogService = inject(ZardDialogService);

  @Input()
  dish : IDish = null as unknown as IDish;

  @Output()
  handleAdd = new EventEmitter();

  @Output()
  handleIncrement = new EventEmitter();

  @Output()
  handleDecrement = new EventEmitter();

  @Output()
  handleRemove = new EventEmitter();

  ngOnInit(): void {
      console.log(this.dish)
  }

  


  addToCart(dish: IDish) {
    this.handleAdd.emit(dish);
  }


  incrementCartItem(dishId: number) {
    this.handleIncrement.emit(dishId);
  }


  decrementCartItem(dishId: number) {
    this.handleDecrement.emit(dishId);
  }

  removeFromCart(dishId: number) {
    this.handleRemove.emit(dishId)
  }


  openDialog() {
    this.dialogService.create({
      zTitle: this.dish.name,
      zDescription: `${this.dish.description}`,
      zContent: CardModal,
      zData: {
        menuItem : this.dish
      },
      zOkText: null,
      zWidth: '',
      zCancelText: null
    });
  }




}
