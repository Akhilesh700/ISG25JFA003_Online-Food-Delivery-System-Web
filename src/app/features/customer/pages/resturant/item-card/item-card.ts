import { Component, Input, input } from '@angular/core';
import { IDishes } from 'src/app/models/resturantInterface';
import { ZardBadgeComponent } from "@shared/components/badge/badge.component";

@Component({
  selector: 'app-item-card',
  imports: [ZardBadgeComponent],
  templateUrl: './item-card.html',
  styleUrl: './item-card.css'
})
export class ItemCard {

  @Input()
  dish : IDishes = null as unknown as IDishes










}
