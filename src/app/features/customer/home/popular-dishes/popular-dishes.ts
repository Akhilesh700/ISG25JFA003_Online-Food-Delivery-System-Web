import { Component } from '@angular/core';

interface Dish {
  name: string;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-popular-dishes',
  standalone: true,
  imports: [],
  templateUrl: './popular-dishes.html',
})
export class PopularDishesComponent {
  dishes: Dish[] = [
    { name: 'Classic Burger', description: 'Juicy beef patty with fresh toppings', imageUrl: '/assets/images/dish-burger.jpg' },
    { name: 'Margherita Pizza', description: 'Fresh tomato sauce and mozzarella', imageUrl: '/assets/images/dish-pizza.jpg' },
    { name: 'Sushi Platter', description: 'Authentic Japanese sushi rolls', imageUrl: '/assets/images/dish-sushi.jpg' },
    { name: 'Spaghetti Carbonara', description: 'Creamy pasta with pancetta', imageUrl: '/assets/images/dish-pasta.jpg' }
  ];
}