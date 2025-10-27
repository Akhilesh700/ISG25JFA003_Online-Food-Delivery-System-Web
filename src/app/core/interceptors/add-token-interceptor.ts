import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/auth/token.service';
import { environment } from 'src/environments/environment';

const LOGIN_PATH = `api/${environment.version}/auth/login`;
const REFRESH_PATH = `api/${environment.version}/auth/refresh`;

export const addTokenInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<any>> => {
    const authService = inject(AuthService);
    const tokenService = inject(TokenService);
    const accessToken = tokenService.getAccessToken();

    if (accessToken && !tokenService.isAccessTokenExpired()) {
       req = addTokenHeader(req, accessToken);
    }

    return next(req).pipe(
        catchError(error => {
            // Checking for 401 Unauthorized
            if (error instanceof HttpErrorResponse && error.status === 401) {
                if (req.url.includes(LOGIN_PATH) || req.url.includes(REFRESH_PATH)) {
                     if (req.url.includes(LOGIN_PATH)) {
                        authService.handleLogout();
                     }
                    return throwError(() => error);
                }
                return handle401Error(req, next, authService);
            }
            return throwError(() => error);
        })
    );
};

// Helper function for adding the token header
function addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
}

// Helper function for handling 401 (triggers refresh)
function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService): Observable<HttpEvent<any>> {
    return authService.refreshToken().pipe(
        switchMap((response: any) => { 
            return next(addTokenHeader(request, response.accessToken));
        }),
        catchError((refreshError) => {
            return throwError(() => refreshError);
        })
    );
}