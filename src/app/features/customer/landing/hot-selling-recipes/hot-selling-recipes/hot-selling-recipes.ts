import { Component } from '@angular/core';

@Component({
  selector: 'app-hot-selling-recipes',
  templateUrl: './hot-selling-recipes.html'
})
export class HotSellingRecipes {
  recipes = [
    { name: 'Classic Buger', image: 'img/food1.jpg' },
    { name: 'Pizza', image: 'img/food2.jpg' },
    { name: 'White Sauce Pasta', image: 'img/food3.png' }
  ];
}