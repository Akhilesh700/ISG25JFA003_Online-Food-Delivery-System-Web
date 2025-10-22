import { Component } from '@angular/core';

interface Step {
  number: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [],
  templateUrl: './how-it-works.html',
})
export class HowItWorksComponent {
  steps: Step[] = [
    { number: 1, title: 'Browse & Select', description: 'Explore restaurants and dishes near you' },
    { number: 2, title: 'Place Order', description: 'Add items to cart and checkout securely' },
    { number: 3, title: 'Fast Delivery', description: 'Track your order in real-time' },
    { number: 4, title: 'Enjoy Food', description: 'Fresh food delivered to your doorstep' }
  ];
}