import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

// Matches the backend's PlaceOrderRequestDto
export interface PlaceOrderRequest {
  note: string
}

// Matches the backend's PlaceOrderResponseDto
export interface PlaceOrderResponse {
  orderId: number;
  items: number;
  note: string
  // Add any other properties
}

type status = 'Successful' | 'Pending' | 'Failed'
// Matches the backend's UpdatePaymentRequestDto
export interface UpdatePaymentRequest {
  paymentId: string;
  status: status;
  amount: number
}

@Injectable({
  providedIn: 'root'
})
export class OrderApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}api/${environment.version}/customer/orders`; // Using proxy

  placeOrder(cartId: number): Observable<PlaceOrderResponse> {
    const request: PlaceOrderRequest = { note:"Fetch it from user" };
    return this.http.post<PlaceOrderResponse>(`${this.apiUrl}/place`, request);
  }

  updatePaymentStatus(orderId: number, paymentId: string, status: status, amount: number): Observable<void> {
    const request: UpdatePaymentRequest = { paymentId, status, amount };
    return this.http.put<void>(`${this.apiUrl}/${orderId}/payment`, request);
  }
}
