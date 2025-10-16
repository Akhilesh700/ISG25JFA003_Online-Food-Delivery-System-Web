import { Component } from '@angular/core';

interface Cuisine {
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-cuisines',
  standalone: true,
  imports: [],
  templateUrl: './cuisines.html',
})
export class CuisinesComponent {
  cuisines: Cuisine[] = [
    { name: 'Pizza', imageUrl: '/assets/images/pizza.jpg' },
    { name: 'Burgers', imageUrl: '/assets/images/burger.jpg' },
    { name: 'Biryani', imageUrl: '/assets/images/biryani.jpg' },
    { name: 'Chinese', imageUrl: '/assets/images/chinese.jpg' },
    { name: 'Desserts', imageUrl: '/assets/images/desserts.jpg' },
    { name: 'Salads', imageUrl: '/assets/images/salads.jpg' }
  ];
}