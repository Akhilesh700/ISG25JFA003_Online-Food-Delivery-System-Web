import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Offer {
  title: string;
  subtitle: string;
  code: string;
  bgColor: string;
  icon: string;
}

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offers.html',
})
export class OffersComponent {
  offers: Offer[] = [
    { title: '50% OFF', subtitle: 'Up to ₹100', code: 'FIRST50', bgColor: 'from-orange-600 to-orange-500', icon: 'percent' },
    { title: 'Free Delivery', subtitle: 'On orders above ₹199', code: 'FREEDEL', bgColor: 'from-blue-600 to-blue-500', icon: 'time' },
    { title: 'Buy 1 Get 1', subtitle: 'On selected items', code: 'BOGO', bgColor: 'from-purple-600 to-purple-500', icon: 'gift' },
    { title: 'Flash Sale', subtitle: '30% off for next 2 hours', code: 'FLASH30', bgColor: 'from-red-600 to-red-500', icon: 'flash' },
  ];
}