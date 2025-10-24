import { Component } from '@angular/core';
import { IResturant } from 'src/app/models/resturantInterface';

@Component({
  selector: 'app-resturant-track-order',
  imports: [],
  templateUrl: './resturant-track-order.html',
  styleUrl: './resturant-track-order.css'
})
export class ResturantTrackOrder {
  restaurant: IResturant = {
      id: 12,
      name: "Shakti Dahaba",
      address: "IT park road near Rasoi Coimbatore, TN.",
      bannerUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxrvG1Be8Iysx__yU7FQhF9SYwStFtXVDvNTZavsuWpahC8S7Nhhx-G-peqB49dWI84gE&usqp=CAU",
      logoUrl: "",
      rating: 1,
      ETA: "22:22",
      isOpen: true,
      deliveryFee: 88.2,
      dishes: []
  }
}
