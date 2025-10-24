import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../../core/services/restaurant/restaurant.service';
import { 
  RestaurantOrderHistoryResponse, 
  RestaurantDashboardStats, 
  MonthlyEarnings 
} from '../../../models/restaurant.models';
import { Subject, takeUntil, interval } from 'rxjs';
import { toast } from 'ngx-sonner';

interface Order { 
  id: number; 
  customerName: string; 
  date: string; 
  price: number; 
  status: string; 
  
  customerPhone: string;
  specialReq: string;
}
interface WeekData { day: string; value: number; date: Date; }

@Component({
  selector: 'app-dashboard-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-content.html',
  styleUrls: ['./dashboard-content.css']
})
export class DashboardContentComponent implements OnInit, OnDestroy {
  pendingOrders: Order[] = [];
  weeklyData: WeekData[] = [];
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
    // Fetch all orders from backend API and filter for PLACED status on frontend
    this.restaurantService.getOrderHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orderHistory) => {
          // Map ALL orders for internal tracking
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
              specialReq: o.specialReq || ''
            };
          });
          
          // Calculate dashboard statistics from ALL orders
          this.calculateDashboardStats(orderHistory);
          
          // Calculate weekly earnings from ALL orders
          this.calculateWeeklyEarnings(orderHistory);
          
          // Filter to show only PLACED orders in incoming orders section
          this.filterPendingOrders();
        },
        error: (error) => {
        }
      });
  }

  private calculateDashboardStats(orders: RestaurantOrderHistoryResponse[]): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let todayOrders = 0;
    let todayEarnings = 0;
    let totalEarnings = 0;
    let pendingOrders = 0;
    let completedOrders = 0;
    let rejectedOrders = 0;

    orders.forEach(order => {
      const orderDate = new Date(order.orderTime);
      orderDate.setHours(0, 0, 0, 0);
      
      // Extract status - handle both enum object and string
      const statusValue = typeof order.status === 'object' ? (order.status as any).statusType || order.status : order.status;
      const status = String(statusValue).toUpperCase().trim();
      
      // Check if order is from today
      const isToday = orderDate.getTime() === today.getTime();
      
      // Count today's orders (regardless of status)
      if (isToday) {
        todayOrders++;
        
        // Add to today's earnings if NOT rejected
        // Include: PENDING, PREPARING, PLACED, OUT_FOR_DELIVERY, DELIVERED
        // Exclude: NOT_ACCEPTED, FAILED
        if (status !== 'NOT_ACCEPTED' && status !== 'FAILED') {
          todayEarnings += Number(order.totalAmount) || 0;
        }
      }
      
      // Add to total earnings only if NOT rejected
      if (status !== 'NOT_ACCEPTED' && status !== 'FAILED') {
        totalEarnings += Number(order.totalAmount) || 0;
      }
      
      // Count by status
      if (status === 'PENDING') {
        pendingOrders++;
      } else if (status === 'PLACED' || status === 'PREPARING' || status === 'OUT_FOR_DELIVERY') {
        completedOrders++;
      } else if (status === 'DELIVERED') {
        completedOrders++;
      } else if (status === 'NOT_ACCEPTED' || status === 'FAILED') {
        rejectedOrders++;
      }
    });

    this.dashboardStats = {
      todayOrders,
      todayEarnings,
      totalOrders: orders.length,
      totalEarnings,
      pendingOrders,
      completedOrders,
      rejectedOrders
    };
  }

  private calculateWeeklyEarnings(orders: RestaurantOrderHistoryResponse[]): void {
    const now = new Date();
    this.weeklyData = [];
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      this.weeklyData.push({
        day: dayName,
        value: 0,
        date: new Date(date)
      });
    }
    
    // Aggregate orders by day, excluding NOT_ACCEPTED and FAILED orders
    orders.forEach(order => {
      const orderDate = new Date(order.orderTime);
      orderDate.setHours(0, 0, 0, 0);
      
      // Extract status - handle both enum object and string
      const statusValue = typeof order.status === 'object' ? (order.status as any).statusType || order.status : order.status;
      const status = String(statusValue).toUpperCase().trim();
      
      // Only add earnings if order is NOT rejected or failed
      if (status !== 'NOT_ACCEPTED' && status !== 'FAILED') {
        // Find matching day in weeklyData
        const dayData = this.weeklyData.find(d => d.date.getTime() === orderDate.getTime());
        if (dayData) {
          dayData.value += Number(order.totalAmount) || 0;
        }
      }
    });
  }

  onUpdateStatus(order: Order, action: 'accept' | 'reject'): void {
    // Call backend API: PUT /api/v1/restaurant/update-status/{orderId}?action=accept/reject
    // Backend validates PENDING status and updates to PREPARING or NOT_ACCEPTED
    this.restaurantService.updateOrderStatus(order.id, action)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Show success message to user
          const actionText = action === 'accept' ? 'accepted' : 'rejected';
          const newStatus = action === 'accept' ? 'Preparing' : 'Not Accepted';
          toast.success(`✅ Order has been ${actionText} successfully!\n\nNew Status: ${newStatus}`);
          
          // Reload dashboard to fetch updated order list from API
          // Order will be removed from incoming orders as it's no longer PENDING
          this.loadDashboardData();
        },
        error: (error) => {
          // Handle different error scenarios
          if (error.status === 400) {
            const errorMsg = error.error?.message || 'Invalid request';
            alert(`❌ Cannot ${action} this order\n\nReason: ${errorMsg}`);
          } else if (error.status === 404) {
            alert(`❌ Order #${order.id} not found.\n\nIt may have been deleted or is not from your restaurant.`);
          } else if (error.status === 403) {
            alert(`❌ Access denied.\n\nYou don't have permission to ${action} this order.`);
          } else {
            alert(`❌ Failed to ${action} order #${order.id}\n\nError: ${error.statusText || 'Unknown error'}\n\nPlease try again or contact support.`);
          }
          
          // Reload to refresh current state
          this.loadDashboardData();
        }
      });
  }

  private filterPendingOrders(): void {
    // Frontend filtering: Show only PENDING orders in "Incoming Orders" section
    // These are new orders from customers awaiting restaurant action (accept/reject)
    // Once accepted → PREPARING, once rejected → NOT_ACCEPTED (handled by backend)
    this.pendingOrders = this.orders.filter(order => {
      const status = order.status?.toUpperCase().trim() || '';
      return status === 'PENDING';
    });
  }

  getMaxEarnings(): number {
    if (this.weeklyData.length === 0) return 1;
    return Math.max(...this.weeklyData.map(d => d.value), 1);
  }

  getWeeklyTotal(): number {
    return this.weeklyData.reduce((sum, d) => sum + d.value, 0);
  }

  getLinePoints(): string {
    if (this.weeklyData.length === 0) return '';
    const maxEarnings = this.getMaxEarnings();
    return this.weeklyData.map((d, i) => {
      const x = i * 100 / (this.weeklyData.length - 1 || 1);
      const y = 100 - (d.value / maxEarnings * 100);
      return `${x},${y}`;
    }).join(' ');
  }

  getPointX(index: number): number {
    if (this.weeklyData.length <= 1) return 50;
    return index * 100 / (this.weeklyData.length - 1);
  }

  getPointY(value: number): number {
    const maxEarnings = this.getMaxEarnings();
    return 100 - (value / maxEarnings * 100);
  }
}
