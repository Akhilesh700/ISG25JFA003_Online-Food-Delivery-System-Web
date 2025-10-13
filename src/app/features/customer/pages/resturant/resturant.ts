import { Component, inject } from '@angular/core';
import { ResturantService } from '../../../../core/services/customer/resturants/RestaurantService'
import { IResturant } from 'src/app/models/resturantInterface';
import { ItemCard } from "./item-card/item-card";
import { ZardSkeletonComponent } from "@shared/components/skeleton/skeleton.component";

@Component({
  selector: 'app-resturant',
  imports: [ItemCard, ZardSkeletonComponent],
  templateUrl: './resturant.html',
  styleUrl: './resturant.css'
})
export class Resturant {


  param:number = window.location.pathname.split('/').pop() as unknown as number;

  isLoading: boolean = true;


  private readonly resturantService = inject(ResturantService)

  resturant:IResturant = this.resturantService.getResturantById(this.param);

  temp() {
    console.log(this.param);
  }

  constructor() {
    this.temp();
    setTimeout(() => {
      this.isLoading = false;
    },3000);
  }

}
