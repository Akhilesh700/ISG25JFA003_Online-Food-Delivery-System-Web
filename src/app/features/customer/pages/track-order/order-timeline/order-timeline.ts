import { NgClass } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { toast } from 'ngx-sonner';
import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";

interface OrderStep {
  currentStep: number,
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
export class OrderTimeline implements OnChanges {
  @Input() 
  currentStatus: number = 1;
  
  // Updated with PrimeIcons class names
  orderSteps: OrderStep[] = [
    {
      currentStep: 1,
      icon: 'pi pi-shopping-cart', // Changed
      label: 'Order Placed',
      time: '2:30 PM',
      completed: true
    },
    {
      currentStep: 2,
      icon: 'pi pi-heart',         // Changed
      label: 'Prepering',
      time: '2:32 PM',
      completed: false
    },
    {
      currentStep: 3,
      icon: 'pi pi-box',           // Changed
      label: 'Out for Delivery',
      time: '2:45 PM',
      completed: false
    },
    {
      currentStep: 4,
      icon: 'pi pi-check-circle', // Changed
      label: 'Delivered',
      time: 'Pending',
      completed: false
    }
  ];

  constructor() {
    const startTime = new Date(Date.now());

    const options = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    } as const;

   const formatter = new Intl.DateTimeFormat('en-US', options);

    const ONE_MINUTE_MS = 60000; 

    // 4. Create new Date objects for each step by adding minutes
    //    We use .getTime() to get the base timestamp (in milliseconds) and add to it.
    const timeStep1 = new Date(startTime.getTime() + 0 * ONE_MINUTE_MS);
    const timeStep2 = new Date(startTime.getTime() + 2 * ONE_MINUTE_MS);
    const timeStep3 = new Date(startTime.getTime() + 12 * ONE_MINUTE_MS);
    const timeStep4 = new Date(startTime.getTime() + 24 * ONE_MINUTE_MS);

    // 5. Now, format each Date object into a string and assign it
    this.orderSteps[0].time = formatter.format(timeStep1);
    this.orderSteps[1].time = formatter.format(timeStep2) + " (Expected)";
    this.orderSteps[2].time = formatter.format(timeStep3) + " (Expected)";
    this.orderSteps[3].time = formatter.format(timeStep4) + " (Expected)";

    
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.orderSteps = this.orderSteps.map(o => {
      if(o.currentStep <= this.currentStatus){
        o.time = o.time.split(" (Expected)")[0]
        o.completed=true;
      }
      return o;
    })  
    console.log(changes)
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
