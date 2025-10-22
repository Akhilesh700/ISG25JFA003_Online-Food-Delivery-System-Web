import { Component, Input, Output, EventEmitter } from '@angular/core';
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
export class DashboardContent {
  @Input() pendingOrders: Order[] = [];
  @Input() monthlyData: MonthData[] = [];
  @Input() isDarkMode: boolean = false;
  @Output() orderStatusUpdated = new EventEmitter<{ order: Order; status: 'Completed' | 'Rejected' }>();

  onUpdateStatus(order: Order, status: 'Completed' | 'Rejected'): void {
    this.orderStatusUpdated.emit({ order, status });
  }
}