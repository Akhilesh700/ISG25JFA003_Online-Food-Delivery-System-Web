import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'; // Importing HttpErrorResponse
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError, filter, finalize, switchMap, take } from 'rxjs/operators';

import { TokenService } from './token.service'; // Adjusting path if needed
import { RefreshRequest, RefreshResponse } from './auth.models'; // Adjusting path if needed
import { environment } from 'src/environments/environment'; // Adjusting path if needed

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | Error | null> = new BehaviorSubject<string | Error | null>(null);
  private refreshTokenUrl = `${environment.apiUrl}api/${environment.version}/auth/refresh`;

  /**
   * Attempts refreshing the access token using the stored refresh token.
   * Manages concurrent requests preventing multiple refresh attempts.
   * @returns Observable emitting the new RefreshResponse on success, or an error.
   */
  refreshToken(): Observable<RefreshResponse> {
    if (this.isRefreshing) {
      // Waiting for the ongoing refresh result
      return this.refreshTokenSubject.pipe(
        filter(result => result !== null), // Filtering out initial null value
        take(1), // Taking only the first emitted result (token or error)
        switchMap(result => {
          if (result instanceof Error) {
            return throwError(() => result); // Propagating the error if refresh failed
          }
          // Returning the expected structure for the interceptor upon success
          return of({ accessToken: result as string, tokenType: 'Bearer' } as RefreshResponse);
        })
      );
    } else {
      const storedRefreshToken = this.tokenService.getRefreshToken();
      if (!storedRefreshToken) {
        // Letting the caller (interceptor/AuthService) handle logout as no refresh token exists.
        return throwError(() => new Error('Refresh token not available'));
      }

      this.isRefreshing = true;
      this.refreshTokenSubject.next(null); // Signaling refresh process start

      const payload: RefreshRequest = { refreshToken: storedRefreshToken };
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      // Posting the refresh token to the backend endpoint
      return this.http.post<RefreshResponse>(this.refreshTokenUrl, payload, { headers }).pipe(
        tap(response => {
          const newAccessToken = response.accessToken; // Or response.jwt depending on backend response key
          if (!newAccessToken) {
              const err = new Error("New access token not found in refresh response");
              this.refreshTokenSubject.next(err); // Notifying waiting requests of the failure
              throw err; // Ensuring the error propagates through the observable chain
          }
          this.tokenService.saveAccessToken(newAccessToken); // Saving the newly obtained access token
          if (response.refreshToken) { // Handling potential refresh token rotation
            this.tokenService.saveRefreshToken(response.refreshToken); // Saving the new refresh token if received
          }
          // Emitting the new access token for any waiting requests
          this.refreshTokenSubject.next(newAccessToken);
        }),
        catchError(error => {
          // Emitting the specific error for waiting requests
          this.refreshTokenSubject.next(error);
          // Letting the caller (interceptor/AuthService) decide on logout based on the received error
          return throwError(() => error);
        }),
        // Ensuring the refreshing flag is reset regardless of success or failure
        finalize(() => this.isRefreshing = false)
      );
    }
  }
}