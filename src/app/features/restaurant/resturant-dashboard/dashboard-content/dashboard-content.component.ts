import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Order { id: string; customerName: string; date: string; price: string; status: 'Completed' | 'Pending' | 'Rejected'; }
interface MonthData { month: string; value: number; }

@Component({
  selector: 'app-dashboard-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-content.html',
  styleUrls: ['./dashboard-content.css']
})
export class DashboardContentComponent implements OnInit {
  pendingOrders: Order[] = [];
  monthlyData: MonthData[] = [];
  isDarkMode: boolean = false;

  private orders: Order[] = [
    { id: '#ORD-001', customerName: 'Jackson Williams', date: '2025-10-15', price: '$45.50', status: 'Completed' },
    { id: '#ORD-002', customerName: 'Sarah Mitchell', date: '2025-10-15', price: '$32.80', status: 'Pending' },
    { id: '#ORD-003', customerName: 'Adam Mccall', date: '2025-10-15', price: '$67.20', status: 'Completed' },
    { id: '#ORD-004', customerName: 'Emma Thompson', date: '2025-10-14', price: '$28.90', status: 'Rejected' },
    { id: '#ORD-005', customerName: 'Michael Chen', date: '2025-10-14', price: '$54.30', status: 'Completed' },
    { id: '#ORD-006', customerName: 'Sophie Anderson', date: '2025-10-14', price: '$41.75', status: 'Pending' },
  ];

  ngOnInit(): void {
    this.filterPendingOrders();
    this.monthlyData = [
      { month: 'Jan', value: 120 },
      { month: 'Feb', value: 110 },
      { month: 'Mar', value: 130 },
      { month: 'Apr', value: 115 },
      { month: 'May', value: 125 }
    ];
  }

  onUpdateStatus(order: Order, status: 'Completed' | 'Rejected'): void {
    const orderInList = this.orders.find(o => o.id === order.id);
    if (orderInList) {
      orderInList.status = status;
      this.filterPendingOrders();
    }
  }

  private filterPendingOrders(): void {
    this.pendingOrders = this.orders.filter(order => order.status === 'Pending');
  }
}
