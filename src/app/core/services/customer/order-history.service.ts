import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type OrderStatus = 'PLACED' | 'PENDING' | 'PREPARING' | 
                          'OUT_FOR_DELIVERY' | 'DELIVERED' | 
                          'FAILED' | 'NOT_ACCEPTED';

export interface OrderHistoryResponse {
  orderId: number;
  restaurant: string; 
  restaurantAddress: string;
  totalPrice: number; 
  orderItems: any[]; 
  status: OrderStatus;
  specialRequest: string;

}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient); 

  getOrderHistory(): Observable<OrderHistoryResponse[]> {
    return this.http.get<OrderHistoryResponse[]>(`http://localhost:8080/api/v1/customer/orders/history`);
  }
}