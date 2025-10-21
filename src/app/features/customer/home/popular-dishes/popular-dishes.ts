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
    { name: 'Classic Burger', description: 'Juicy patty with fresh toppings', imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max' },
    { name: 'Margherita Pizza', description: 'Fresh tomato sauce and mozzarella', imageUrl: 'https://tinyurl.com/j2mkvmkw' },
    { name: 'Sushi Platter', description: 'Authentic Japanese sushi rolls', imageUrl: 'https://tinyurl.com/bdcmfesc' },
    { name: 'Spaghetti Carbonara', description: 'Creamy pasta with pancetta', imageUrl: 'https://tinyurl.com/2w5hw5zf' }
  ];
}