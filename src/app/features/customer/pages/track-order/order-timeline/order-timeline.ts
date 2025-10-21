import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { toast } from 'ngx-sonner';
import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";

interface OrderStep {
  icon: string; 
  label: string;
  time: string;
  completed: boolean;
}

@Component({
  selector: 'app-order-timeline',
  standalone: true,
  imports: [NgClass, ZardBreadcrumbModule],
  templateUrl: './order-timeline.html',
  styleUrl: './order-timeline.css'
})
export class OrderTimeline {
  currentStatus: number = 3;

  // Updated with PrimeIcons class names
  orderSteps: OrderStep[] = [
    {
      icon: 'pi pi-shopping-cart', // Changed
      label: 'Order Placed',
      time: '2:30 PM',
      completed: true
    },
    {
      icon: 'pi pi-heart',         // Changed
      label: 'Prepering',
      time: '2:32 PM',
      completed: true
    },
    {
      icon: 'pi pi-box',           // Changed
      label: 'Out for Delivery',
      time: '2:45 PM',
      completed: true
    },
    {
      icon: 'pi pi-check-circle', // Changed
      label: 'Delivered',
      time: 'Pending',
      completed: false
    }
  ];

  constructor() {
    const firstIncomplete = this.orderSteps.findIndex(step => !step.completed);
    this.currentStatus = (firstIncomplete === -1) ? (this.orderSteps.length - 1) : firstIncomplete;
  }

  showToast() {
    console.log("I am clicked");
    toast('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo'),
      },
    });
  }
}
