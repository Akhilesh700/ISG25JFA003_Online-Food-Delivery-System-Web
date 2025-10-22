import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgentSignupResponse, AuthResponse, CustomerSignupResponse, LoginCredentials, RestaurantSignupResponse, Role } from './auth.models';
import { environment } from 'src/environments/environment';

/**
 * Service dedicated to making authentication-related HTTP requests to the backend.
 * This service is solely responsible for API communication.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}api/${environment.version}`;

  /**
   * Sends login credentials to the authentication endpoint.
   * @param credentials The user's username and password.
   * @returns An Observable of the AuthResponse.
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials);
  }

  /**
   * Sends signup credentials to the signup authentication endpoint.
   * @param credentials Credentials for registering based on role
   * @returns An Observable of the SignupResponse.
   */
  customerSignup(credentials: iCustomerSignup): Observable<CustomerSignupResponse> {
    return this.http.post<CustomerSignupResponse>(`${this.apiUrl}/auth/customer/sign-up`, credentials)
  }
  agentSignup(credentials: iAgentSignup): Observable<AgentSignupResponse> {
    return this.http.post<AgentSignupResponse>(`${this.apiUrl}/auth/delivery-agent/sign-up`, credentials)
  }
  restaurantSignup(credentials: iRestaurantSignup): Observable<RestaurantSignupResponse> {
    return this.http.post<RestaurantSignupResponse>(`${this.apiUrl}/auth/restaurant/sign-up`, credentials)
  }

  /**
   * Fetches the role for a given user ID from the user endpoint.
   * @param userId The unique identifier of the user.
   * @returns An Observable containing the user's role.
   */
  fetchUserRole(userId: string): Observable<{ role: Role }> {
    return this.http.get<{ role: Role }>(`${this.apiUrl}/user/${userId}`);
  }
}