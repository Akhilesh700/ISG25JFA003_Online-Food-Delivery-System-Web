import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { 
  RestaurantOrderHistoryResponse, 
  AcceptRejectOrderResponse,
  RestaurantDashboardStats,
  MonthlyEarnings,
  RestaurantProfileUpdateRequest,
  RestaurantProfileUpdateResponse,
  RestaurantResponse
} from '../../../models/restaurant.models';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  private apiUrl = '/api/v1/restaurant';
  private profileSubject = new BehaviorSubject<RestaurantResponse | null>(null);
  public profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient) { }

  getOrderHistory(): Observable<RestaurantOrderHistoryResponse[]> {
    return this.http.get<RestaurantOrderHistoryResponse[]>(`${this.apiUrl}/order-history`);
  }

  updateOrderStatus(orderId: number, action: string): Observable<AcceptRejectOrderResponse> {
    return this.http.put<AcceptRejectOrderResponse>(`${this.apiUrl}/update-status/${orderId}`, null, { params: { action } });
  }

  updateProfile(profileData: RestaurantProfileUpdateRequest): Observable<RestaurantProfileUpdateResponse> {
    return this.http.put<RestaurantProfileUpdateResponse>(`${this.apiUrl}/update-profile`, profileData).pipe(
      tap(response => {
        if (response.restaurant) {
          this.profileSubject.next(response.restaurant);
        }
      })
    );
  }

  getProfile(): Observable<RestaurantResponse> {
    return this.http.get<RestaurantResponse>(`${this.apiUrl}/profile`).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }

  getCurrentProfile(): RestaurantResponse | null {
    return this.profileSubject.value;
  }

}