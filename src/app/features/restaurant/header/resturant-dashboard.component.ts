import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardContent } from '../resturant-dashboard/dashboard-content/dashboard-content';
import { OrderHistoryComponent } from '../resturant-dashboard/order-history/order-history';
import { RestaurantService } from '../header/restaurant.service';
import { Order } from './order.model';
import { map, tap } from 'rxjs/operators';
import { toast } from 'ngx-sonner';

interface MappedOrder {
  id: string;
  customerName: string;
  date: string;
  price: string;
  status: string;
  originalOrder: Order;
}

@Component({
  selector: 'app-resturant-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardContent, OrderHistoryComponent],
  templateUrl: './resturant-dashboard.component.html',
  styleUrls: ['./resturant-dashboard.component.css']
})
export class ResturantDashboardComponent implements OnInit {
  isDarkMode = false;
  selectedStatus = 'All Status';

  allOrders: MappedOrder[] = [];
  filteredOrders: MappedOrder[] = [];
  pendingOrders: MappedOrder[] = [];

  // This can also be fetched from the backend
  monthlyData = [
    { month: 'Jan', value: 120 },
    { month: 'Feb', value: 110 },
    { month: 'Mar', value: 130 },
    { month: 'Apr', value: 115 },
    { month: 'May', value: 125 },
  ];

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.loadOrderHistory();
  }

  loadOrderHistory(): void {
    this.restaurantService.getOrderHistory().pipe(
      map(orders => orders.map(this.mapOrderToDisplay)),
      tap(mappedOrders => {
        this.allOrders = mappedOrders;
        this.applyFilter();
        this.filterPendingOrders();
      })
    ).subscribe({
      error: (err) => console.error('Error fetching order history', err)
    });
  }

  private mapOrderToDisplay(order: Order): MappedOrder {
    return {
      id: `#ORD-${String(order.orderId).padStart(3, '0')}`,
      customerName: order.customerName,
      date: new Date(order.orderTime).toLocaleDateString('en-CA'), // Format as YYYY-MM-DD
      price: `$${order.totalAmount.toFixed(2)}`,
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase(),
      originalOrder: order
    };
  }

  handleFilterChange(event: any): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedStatus = selectElement.value;
    this.applyFilter();
  }

  handleOrderStatusUpdate({ order, status }: { order: MappedOrder, status: string }): void {
    this.restaurantService.updateOrderStatus(order.originalOrder.orderId, status).subscribe({
      next: () => {
        toast.success(`Order ${order.id} has been ${status.toLowerCase()}.`);
        this.loadOrderHistory(); // Reload data to reflect changes
      },
      error: (err) => {
        toast.error(`Failed to update order ${order.id}.`);
        console.error(err);
      }
    });
  }

  applyFilter(): void {
    if (this.selectedStatus === 'All Status') {
      this.filteredOrders = this.allOrders;
    } else {
      this.filteredOrders = this.allOrders.filter(
        (order) => order.status === this.selectedStatus
      );
    }
  }

  filterPendingOrders(): void {
    this.pendingOrders = this.allOrders.filter(
      (order) => order.status === 'Pending'
    );
  }
}
