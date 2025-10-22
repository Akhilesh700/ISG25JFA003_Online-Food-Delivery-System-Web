import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface for type safety
interface Order {
  id: string;
  date: string;
  items: string;
  total: number;
  status: 'Delivered' | 'In Transit' | 'Processing';
}

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistoryComponent {
  // Receive the orders array from the parent component
  @Input() orders: Order[] = [];

  // Helper function to dynamically apply CSS classes based on order status
  getStatusClass(status: string) {
    switch (status) {
      case 'Delivered':
        return 'status-delivered';
      case 'In Transit':
        return 'status-in-transit';
      case 'Processing':
        return 'status-processing';
      default:
        return '';
    }
  }
}