import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Order { id: string; customerName: string; date: string; price: string; status: 'Completed' | 'Pending' | 'Rejected'; }

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.html',
})
export class OrderHistoryComponent implements OnInit {
  @Input() orders: Order[] = [];
  
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
