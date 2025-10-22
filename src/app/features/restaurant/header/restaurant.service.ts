import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  RestaurantOrderHistoryResponse, 
  AcceptRejectOrderResponse,
  RestaurantDashboardStats,
  MonthlyEarnings 
} from '../models/restaurant.models';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  private apiUrl = '/api/v1/restaurant';

  constructor(private http: HttpClient) { }

  getOrderHistory(): Observable<RestaurantOrderHistoryResponse[]> {
    return this.http.get<RestaurantOrderHistoryResponse[]>(`${this.apiUrl}/order-history`);
  }

  updateOrderStatus(orderId: number, action: string): Observable<AcceptRejectOrderResponse> {
    return this.http.put<AcceptRejectOrderResponse>(`${this.apiUrl}/update-status/${orderId}`, null, { params: { action } });
  }

  getDashboardStats(): Observable<RestaurantDashboardStats> {
    return this.http.get<RestaurantDashboardStats>(`${this.apiUrl}/dashboard-stats`);
  }

  getMonthlyEarnings(): Observable<MonthlyEarnings[]> {
    return this.http.get<MonthlyEarnings[]>(`${this.apiUrl}/monthly-earnings`);
  }
}