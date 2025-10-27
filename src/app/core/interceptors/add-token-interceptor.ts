// src/app/core/interceptors/auth.interceptor.ts
import { inject } from '@angular/core';
import {
  HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service'; // Adjust path
import { TokenService } from '../services/auth/token.service'; // Adjust path
// Import RefreshTokenService if needed, but AuthService orchestrates it
// import { RefreshTokenService } from '../services/auth/refresh-token.service';
import { environment } from 'src/environments/environment'; // Adjust path

const LOGIN_PATH = `api/${environment.version}/auth/login`;
const REFRESH_PATH = `api/${environment.version}/auth/refresh`;

export const addTokenInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<any>> => {
    const authService = inject(AuthService); // Inject orchestrator AuthService
    const tokenService = inject(TokenService);
    const accessToken = tokenService.getAccessToken();

    // Add token if available and not expired
    if (accessToken && !tokenService.isAccessTokenExpired()) {
       req = addTokenHeader(req, accessToken);
    }

    return next(req).pipe(
        catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                // Do NOT attempt refresh for login or refresh endpoints
                if (req.url.includes(LOGIN_PATH) || req.url.includes(REFRESH_PATH)) {
                    // Let the error propagate to the component/service caller
                    return throwError(() => error);
                }
                // If 401 is from another endpoint, attempt refresh via AuthService
                return handle401Error(req, next, authService);
            }
            // Propagate other errors
            return throwError(() => error);
        })
    );
};

// Helper function for adding the token header
function addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

// Helper function for handling 401 (triggers refresh via AuthService)
function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService): Observable<HttpEvent<any>> {
    // Delegate refresh attempt to AuthService
    return authService.attemptRefreshToken().pipe(
        switchMap((response: any) => { // response has new accessToken
            // Retry the original request with the new token
            return next(addTokenHeader(request, response.accessToken));
        }),
        catchError((refreshError) => {            
            return throwError(() => refreshError);
        })
    );
}