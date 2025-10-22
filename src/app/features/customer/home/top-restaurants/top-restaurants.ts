import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from 'src/app/core/services/customer/restaurants/RestaurantService';

@Component({
  selector: 'app-top-restaurants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-restaurants.html',
})
export class TopRestaurantsComponent implements OnInit {
  private restaurantService = inject(RestaurantService);

  // Expose the read-only signal directly to the template for reactive updates.
  public restaurants = this.restaurantService.topRestaurantsSignal;

  ngOnInit(): void {
    // When the component initializes, trigger the data fetch.
    // The component doesn't need to handle the subscription itself;
    // the template will react automatically when the signal updates.
    this.restaurantService.fetchRestaurants().subscribe();
  }
}