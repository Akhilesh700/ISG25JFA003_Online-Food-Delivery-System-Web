import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError, switchMap, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MenuItem } from '../../../shared/models/menuitem';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly apiUrl = `${environment.apiUrl}api/${environment.version}`; 
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>([]);
  public menuItems$: Observable<MenuItem[]> = this.menuItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/restaurant/menu`).pipe( 
      tap(items => this.menuItemsSubject.next(items)),
      catchError(this.handleError)
    );
  }
  addMenuItem(itemData: Omit<MenuItem, 'itemId'>): Observable<any> { 
    return this.http.post<MenuItem>(`${this.apiUrl}/menu/`, itemData).pipe(
      // Reloads the menu after adding
      switchMap(() => this.loadMenuItems()), 
      catchError(this.handleError)
    );
  }
  updateMenuItem(itemId: number, itemData: Omit<MenuItem, 'restId'>): Observable<any> { // Ensure itemData matches the model
    return this.http.put<MenuItem>(`${this.apiUrl}/menu/update-menu/${itemId}`, itemData).pipe(
      // Reloads the menu after updating
      switchMap(() => this.loadMenuItems()), 
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a menu item.
   * Backend verifies ownership via JWT.
   * Matches @DeleteMapping("/delete/{menuItemId}")
   */
  deleteMenuItem(itemId: number): Observable<void> {
    return this.http.delete(`${this.apiUrl}/menu/delete/${itemId}`, { responseType: 'text' }).pipe(
      // Reloads the menu after deleting
      switchMap(() => this.loadMenuItems()), 
      map(() => void 0), 
      catchError(this.handleError)
    );
  }
  private handleError(error: any) {
    console.error('An API error occurred:', error);
    return throwError(() => new Error('Something went wrong with the menu service; please try again later.'));
  }
}