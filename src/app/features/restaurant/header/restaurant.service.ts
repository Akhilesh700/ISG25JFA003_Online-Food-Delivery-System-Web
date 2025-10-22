import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  // It's better to move this to an environment file
  private apiUrl = '/api/v1/restaurant';

  constructor(private http: HttpClient) { }

  getOrderHistory(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/order-history`);
  }

  updateOrderStatus(orderId: number, action: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-status/${orderId}`, null, { params: { action } });
  }
}