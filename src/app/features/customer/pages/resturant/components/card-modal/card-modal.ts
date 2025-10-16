import { Component, inject, Input } from '@angular/core';
import { ItemCard } from '../../item-card/item-card';
import { IDish } from 'src/app/models/resturantInterface';
import { Z_MODAL_DATA } from '@shared/components/dialog/dialog.service';

@Component({
  selector: 'app-card-modal',
  imports: [],
  templateUrl: './card-modal.html',
  styleUrl: './card-modal.css'
})
export class CardModal {

  private zData: {menuItem: IDish} = inject(Z_MODAL_DATA);
  menuItem: IDish = null as unknown as IDish;
  constructor() {
    if(this.zData){
      this.menuItem = this.zData.menuItem;
    }
  }

}
