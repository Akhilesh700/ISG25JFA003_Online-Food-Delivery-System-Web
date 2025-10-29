import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
export interface CustomerProfile {
  name: string;
  email: string;
  dob: string;
  phone: string;
  address: string;
  preferredPayment: string | null;
}

export interface UpdateCustomerProfile {
  name: string;
  email: string;
  dob: string;
  phone: string;
  address: string;
  preferredPayment: string | null; 
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}api/${environment.version}/customer`; 

  getProfile(): Observable<CustomerProfile> {
    return this.http.get<CustomerProfile>(`${this.apiUrl}`);
  }

  updateProfile(profileData: UpdateCustomerProfile): Observable<CustomerProfile> {
    return this.http.put<CustomerProfile>(`${this.apiUrl}/update-profile`, profileData);
  }
}