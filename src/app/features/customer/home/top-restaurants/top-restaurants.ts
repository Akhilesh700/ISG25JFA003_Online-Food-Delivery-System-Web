import { Component } from '@angular/core';

interface Restaurant {
  name: string;
  cuisines: string;
  rating: number;
  deliveryTime: string;
  imageUrl: string;
}

@Component({
  selector: 'app-top-restaurants',
  standalone: true,
  imports: [],
  templateUrl: './top-restaurants.html',
})
export class TopRestaurantsComponent {
  restaurants: Restaurant[] = [
    { name: 'The Golden Fork', cuisines: 'Italian, Continental', rating: 4.5, deliveryTime: '30-40 min', imageUrl: '/assets/images/restaurant1.jpg' },
    { name: 'Café Delights', cuisines: 'American, Fast Food', rating: 4.3, deliveryTime: '20-30 min', imageUrl: '/assets/images/restaurant2.jpg' },
    { name: 'Urban Bistro', cuisines: 'Asian, Fusion', rating: 4.7, deliveryTime: '35-45 min', imageUrl: '/assets/images/restaurant3.jpg' },
    { name: 'Spice Kitchen', cuisines: 'Indian, Thai', rating: 4.6, deliveryTime: '25-35 min', imageUrl: '/assets/images/restaurant4.jpg' },
  ];
}