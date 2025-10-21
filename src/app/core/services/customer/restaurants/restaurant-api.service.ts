import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Restaurant } from 'src/app/models/resturantInterface';

/**
 * Service dedicated to making HTTP requests for restaurant data.
 */
@Injectable({
  providedIn: 'root'
})
export class RestaurantApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}api/${environment.version}/user`;

  /**
   * Fetches a list of top-rated restaurants from the backend.
   * @returns An Observable array of Restaurant objects.
   */
  getRestaurants(): Observable<Restaurant[]> {
    // Assuming your backend has an endpoint like '/api/v1/restaurants/top'
    return this.http.get<Restaurant[]>(`${this.apiUrl}/all-restaurants`);
  }

}