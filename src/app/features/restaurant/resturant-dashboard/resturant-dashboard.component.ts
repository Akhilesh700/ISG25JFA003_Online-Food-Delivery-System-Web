import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { OrderHistoryComponent } from './order-history/order-history.component';

// Define data types used on this page
interface Order { id: string; customerName: string; date: string; price: string; status: 'Completed' | 'Pending' | 'Rejected'; }
interface MonthData { month: string; value: number; }

@Component({
  selector: 'app-resturant-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardContentComponent,
    OrderHistoryComponent
  ],
  templateUrl: './resturant-dashboard.component.html',
  styleUrls: ['./resturant-dashboard.component.css']
})
export class ResturantDashboard implements OnInit {
  isDarkMode: boolean = false;
  
  orders: Order[] = [
    { id: '#ORD-001', customerName: 'Jackson Williams', date: '2025-10-15', price: '$45.50', status: 'Completed' },
    { id: '#ORD-002', customerName: 'Sarah Mitchell', date: '2025-10-15', price: '$32.80', status: 'Pending' },
    { id: '#ORD-003', customerName: 'Adam Mccall', date: '2025-10-15', price: '$67.20', status: 'Completed' },
    { id: '#ORD-004', customerName: 'Emma Thompson', date: '2025-10-14', price: '$28.90', status: 'Rejected' },
    { id: '#ORD-005', customerName: 'Michael Chen', date: '2025-10-14', price: '$54.30', status: 'Completed' },
    { id: '#ORD-006', customerName: 'Sophie Anderson', date: '2025-10-14', price: '$41.75', status: 'Pending' },
  ];
  
  pendingOrders: Order[] = [];
  
  monthlyData: MonthData[] = [
    { month: 'Jan', value: 120 },
    { month: 'Feb', value: 110 },
    { month: 'Mar', value: 130 },
    { month: 'Apr', value: 115 },
    { month: 'May', value: 125 }
  ];

  ngOnInit(): void {
    this.filterPendingOrders();
  }
  
  handleOrderStatusUpdate({ order, status }: { order: Order; status: 'Completed' | 'Rejected' }): void {
    const orderInMainList = this.orders.find(o => o.id === order.id);
    if (orderInMainList) {
      orderInMainList.status = status;
      this.filterPendingOrders();
    }
  }

  private filterPendingOrders(): void {
    this.pendingOrders = this.orders.filter(order => order.status === 'Pending');
  }
}
