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
    { name: 'Pizza', imageUrl: 'https://tinyurl.com/scuer6hh' },
    { name: 'Burgers', imageUrl: 'https://tinyurl.com/486fhnyz' },
    { name: 'Biryani', imageUrl: 'https://tinyurl.com/7k6f322r' },
    { name: 'Dosa', imageUrl: 'https://tinyurl.com/mhhetav4' },
    { name: 'Desserts', imageUrl: 'https://tinyurl.com/mpeydpnu' },
    { name: 'Salads', imageUrl: 'https://tinyurl.com/35jwyb3v' }
  ];
}