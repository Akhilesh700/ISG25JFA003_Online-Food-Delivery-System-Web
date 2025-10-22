import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';
import { 
  RestaurantOrderHistoryResponse, 
  RestaurantDashboardStats, 
  MonthlyEarnings 
} from '../../models/restaurant.models';
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
interface MonthData { month: string; value: number; }

@Component({
  selector: 'app-dashboard-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-content.html',
  styleUrls: ['./dashboard-content.css']
})
export class DashboardContentComponent implements OnInit, OnDestroy {
  pendingOrders: Order[] = [];
  monthlyData: MonthData[] = [];
  isDarkMode: boolean = false;
  
  // Dashboard stats
  dashboardStats: RestaurantDashboardStats = {
    todayOrders: 0,
    todayEarnings: 0,
    totalOrders: 0,
    totalEarnings: 0,
    pendingOrders: 0,
    completedOrders: 0,
    rejectedOrders: 0
  };

  private destroy$ = new Subject<void>();
  private orders: Order[] = [];

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.loadDashboardData();
    
    // Auto-refresh every 30 seconds
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadDashboardData();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    // Load dashboard stats
    this.restaurantService.getDashboardStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.dashboardStats = stats;
        },
        error: (error) => {
          console.error('Error loading dashboard stats:', error);
        }
      });

    // Load monthly earnings
    this.restaurantService.getMonthlyEarnings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (earnings) => {
          this.monthlyData = earnings.map(e => ({
            month: e.month,
            value: Number(e.earnings)
          }));
        },
        error: (error) => {
          console.error('Error loading monthly earnings:', error);
        }
      });

    // Load order history
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
          this.filterPendingOrders();
        },
        error: (error) => {
          console.error('Error loading order history:', error);
        }
      });
  }

  onUpdateStatus(order: Order, action: 'accept' | 'reject'): void {
    this.restaurantService.updateOrderStatus(order.id, action)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Order status updated:', response);
          // Reload dashboard data to reflect changes
          this.loadDashboardData();
        },
        error: (error) => {
          console.error('Error updating order status:', error);
        }
      });
  }

  private filterPendingOrders(): void {
    this.pendingOrders = this.orders.filter(
      order => order.status === 'PLACED' || order.status === 'PREPARING' || order.status === 'PENDING'
    );
  }

  getMaxEarnings(): number {
    if (this.monthlyData.length === 0) return 1;
    return Math.max(...this.monthlyData.map(d => d.value), 1);
  }
}
