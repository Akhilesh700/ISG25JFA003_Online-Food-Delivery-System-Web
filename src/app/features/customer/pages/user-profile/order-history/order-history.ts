import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import Router for navigation
import { OrderHistoryResponse, OrderService, OrderStatus } from 'src/app/core/services/customer/order-history.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './order-history.html'
})
export class OrderHistoryComponent implements OnInit  {

  orders: OrderHistoryResponse[] = [];
  selectedOrder: OrderHistoryResponse | null = null;
  isDialogVisible: boolean = false;                 

  private orderService = inject(OrderService);
  private router = inject(Router); 

  ngOnInit(): void { 
    this.loadOrderHistory();
  }

  loadOrderHistory(): void {
    this.orderService.getOrderHistory().subscribe({
      next: (data) => {
        this.orders = this.sortOrders(data);
      },
      error: (err) => {
        console.error('Error fetching order history:', err);
      }
    });
  }

  private sortOrders(orders: OrderHistoryResponse[]): OrderHistoryResponse[] {
    return orders.sort((a, b) => {
      if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
      if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
      return 0;
    });
  }

  getStatusClass(status: OrderStatus): string {
    const baseClasses = 'inline-block px-3 py-1 text-xs font-semibold rounded-full';
    switch (status) {
      case 'DELIVERED':
        return `${baseClasses} bg-green-700 text-green-100`; 
      case 'OUT_FOR_DELIVERY':
        return `${baseClasses} bg-blue-700 text-blue-100`;   
      case 'PREPARING':
      case 'PENDING':
      case 'PLACED':
        return `${baseClasses} bg-yellow-700 text-yellow-100`;
      case 'FAILED':
      case 'NOT_ACCEPTED':
        return `${baseClasses} bg-red-700 text-red-100`;     
      default:
        return `${baseClasses} bg-gray-600 text-gray-200`;  
    }
  }
  onViewDetails(order: OrderHistoryResponse): void {
    console.log('Opening details for order:', order.orderId);
    this.selectedOrder = order;
    this.isDialogVisible = true;
  }

  closeDialog(): void {
    this.isDialogVisible = false;
    this.selectedOrder = null; 
  }
  onPayNow(order: OrderHistoryResponse): void {
    console.log('Navigating to payment for order:', order.orderId);
  }
}