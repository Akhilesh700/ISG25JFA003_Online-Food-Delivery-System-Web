import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { toast } from 'ngx-sonner';
import { DeliveryAgentService } from 'src/app/core/services/delivery-agent/delivery-agent.service';
import { IOrderHistroy, OrderStatus } from 'src/app/models/delivery-agent/IOrder';
import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";
import { BehaviorSubject, catchError, map, of, shareReplay, switchMap } from 'rxjs';

@Component({
  selector: 'app-assigned-order-card',
  imports: [AsyncPipe, ZardBreadcrumbModule],
  templateUrl: './assigned-order-card.html',
  styleUrl: './assigned-order-card.css'
})
export class AssignedOrderCard implements OnInit {


  private deliveryAgentService = inject(DeliveryAgentService);
  
  // A subject to trigger a refresh of the order list
  private refreshTrigger = new BehaviorSubject<void>(undefined);

  agentOrders$ = this.deliveryAgentService.getAgentOrderHistory();
  Math = Math

  private allOrders$ = this.refreshTrigger.pipe(
    switchMap(() => 
      this.deliveryAgentService.getAgentOrderHistory().pipe(
        catchError(err => {
          console.error("Failed to fetch orders:", err);
          toast.error("Could not load orders. Please try again later.");
          return of([]); // Return empty array on error
        })
      )
    ),
    shareReplay(1) // Cache the last emission
  );

  // assigned order
  assignedOrders$ = this.allOrders$.pipe(
    map(orders => orders?.filter(o => o.status === 'PREPARING' || o.status === 'OUT_FOR_DELIVERY') || [])
  );

  // Observable for past orders
  orderHistory$ = this.allOrders$.pipe(
    map(orders => orders?.filter(o => o.status !== 'PREPARING' && o.status !== 'OUT_FOR_DELIVERY') || [])
  );


  // Triggers an order status update and refreshes the list on success.
  private updateOrder(orderId: number, status: 4 | 5 | 6, successMessage: string) {
    this.deliveryAgentService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        toast.success(successMessage);
        this.refreshTrigger.next(); // Trigger list refresh
      },
      error: (err) => {
        console.error(`Failed to update order ${orderId}:`, err);
        toast.error('Failed to update order status.');
      }
    });
  }





  ngOnInit(): void {
      
  }

  onOrderPickUp(orderId: number) {
    // 4 = OUT_FOR_DELIVERY
    this.updateOrder(orderId, 4, 'Order marked as "Out for Delivery"');
  }

  onOrderDelivered(orderId: number) {
    // 5 = DELIVERED
    this.updateOrder(orderId, 5, 'Order marked as "Delivered"');
  } 

  onOrderFailed(orderId: number) {
    // 6 = FAILED
    this.updateOrder(orderId, 6, 'Order marked as "Failed"');
  }


  // returns Tailwind class for status badge
  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case 'PREPARING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'FAILED':
      case 'NOT_ACCEPTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'PENDING':
      case 'PLACED':
      default:
        return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200';
    }
  }


}
