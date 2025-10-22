import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Order { id: string; customerName: string; date: string; price: string; status: 'Completed' | 'Pending' | 'Rejected'; }

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [
    { id: '#ORD-001', customerName: 'Jackson Williams', date: '2025-10-15', price: '$45.50', status: 'Completed' },
    { id: '#ORD-002', customerName: 'Sarah Mitchell', date: '2025-10-15', price: '$32.80', status: 'Pending' },
    { id: '#ORD-003', customerName: 'Adam Mccall', date: '2025-10-15', price: '$67.20', status: 'Completed' },
    { id: '#ORD-004', customerName: 'Emma Thompson', date: '2025-10-14', price: '$28.90', status: 'Rejected' },
    { id: '#ORD-005', customerName: 'Michael Chen', date: '2025-10-14', price: '$54.30', status: 'Completed' },
    { id: '#ORD-006', customerName: 'Sophie Anderson', date: '2025-10-14', price: '$41.75', status: 'Pending' },
    { id: '#ORD-007', customerName: 'David Brown', date: '2025-10-13', price: '$58.90', status: 'Completed' },
    { id: '#ORD-008', customerName: 'Lisa Davis', date: '2025-10-13', price: '$39.50', status: 'Completed' },
  ];
  
  filteredOrders: Order[] = [];
  selectedStatus: string = 'All Status';

  ngOnInit(): void {
    this.applyFilter();
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
}
