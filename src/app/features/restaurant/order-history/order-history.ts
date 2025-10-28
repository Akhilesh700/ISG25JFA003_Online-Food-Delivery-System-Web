import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../../core/services/restaurant/restaurant.service';
import { RestaurantOrderHistoryResponse } from '../../../models/restaurant.models';
import { Subject, takeUntil, interval } from 'rxjs';

interface Order { 
  id: number; 
  customerName: string; 
  date: string; 
  price: number; 
  status: string;
  customerPhone: string;
  specialReq: string;
  orderTime: string;
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedStatus: string = 'PLACED'; // Default filter to show only PLACED orders
  selectedOrder: Order | null = null;
  isModalOpen: boolean = false;
  
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
          this.orders = orderHistory.map(o => {
            // Extract status - it might be an object or string
            const statusValue = typeof o.status === 'object' ? (o.status as any).statusType || o.status : o.status;
            const statusString = String(statusValue).toUpperCase();
            
            return {
              id: o.orderId,
              customerName: o.customerName,
              date: new Date(o.orderTime).toLocaleDateString(),
              price: o.totalAmount,
              status: statusString,
              customerPhone: o.customerPhone,
              specialReq: o.specialReq || '',
              orderTime: o.orderTime
            };
          }).filter(order => order.status !== 'PENDING'); // Exclude PENDING orders from history
          
          this.applyFilter();
        },
        error: (error) => {
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

  openOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedOrder = null;
  }

  formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
