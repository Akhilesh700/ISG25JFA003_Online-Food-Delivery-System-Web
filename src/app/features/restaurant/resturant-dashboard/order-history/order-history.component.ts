import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';
import { RestaurantOrderHistoryResponse } from '../../models/restaurant.models';
import { Subject, takeUntil, interval } from 'rxjs';

interface Order { 
  id: number; 
  customerName: string; 
  date: string; 
  price: number; 
  status: string;
  customerPhone: string;
  specialReq: string;
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedStatus: string = 'All Status';
  
  private destroy$ = new Subject<void>();

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.loadOrderHistory();
    
    // Auto-refresh every 30 seconds
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadOrderHistory();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrderHistory(): void {
    this.restaurantService.getOrderHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orderHistory) => {
          this.orders = orderHistory.map(o => ({
            id: o.orderId,
            customerName: o.customerName,
            date: new Date(o.orderTime).toLocaleDateString(),
            price: o.totalAmount,
            status: o.status,
            customerPhone: o.customerPhone,
            specialReq: o.specialReq
          }));
          this.applyFilter();
        },
        error: (error) => {
          console.error('Error loading order history:', error);
        }
      });
  }

  onFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedStatus = selectElement.value;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.selectedStatus === 'All Status') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.selectedStatus);
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PLACED':
      case 'PREPARING':
      case 'PENDING':
      case 'OUT_FOR_DELIVERY':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'NOT_ACCEPTED':
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  }

  getStatusLabel(status: string): string {
    switch(status) {
      case 'PLACED': return 'Placed';
      case 'PREPARING': return 'Preparing';
      case 'PENDING': return 'Pending';
      case 'OUT_FOR_DELIVERY': return 'Out for Delivery';
      case 'DELIVERED': return 'Delivered';
      case 'NOT_ACCEPTED': return 'Rejected';
      case 'FAILED': return 'Failed';
      default: return status;
    }
  }
}
