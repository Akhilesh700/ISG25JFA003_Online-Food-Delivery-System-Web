// src/app/core/services/auth/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, map, switchMap, take } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

import { TokenService } from './token.service';
import { AuthApiService } from './auth-api.service';
import { AuthStateService } from './auth-state.service';
import { RefreshTokenService } from './refresh-token.service';
import {
    AgentSignupResponse, AuthResponse, CustomerSignupResponse, JwtPayload,
    LoginCredentials, RestaurantSignupResponse, Role, RefreshResponse,
} from './auth.models';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { emptyCart } from 'src/app/state/cart/cart.action';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // --- Injected Services ---
    private authApiService = inject(AuthApiService);
    private tokenService = inject(TokenService);
    private authStateService = inject(AuthStateService);
    private refreshTokenService = inject(RefreshTokenService);
    private router = inject(Router);
    protected readonly storeService = inject<Store<AppState>>(Store);

    // --- Expose State (Readonly) ---
    public readonly userRoleSignal = this.authStateService.userRole; 
    public readonly userRole$ = this.authStateService.userRole$;
    public readonly isAuthStateResolved$ = this.authStateService.isAuthStateResolved$;


    public initializeAuthState(): void {
        if (!this.authStateService.isAuthStateResolved()) {
            this.loadInitialRole();
        }
    }

    // --- Login ---
    login(credentials: LoginCredentials): Observable<Role | null> {
        this.authStateService.setResolved(false);

        return this.authApiService.login(credentials).pipe(
            switchMap((response: AuthResponse) => {
                if (!response?.jwt) {
                     throw new Error('Access token missing in login response');
                }
                this.tokenService.saveAccessToken(response.jwt);
                if(response?.refreshToken){
                    this.tokenService.saveRefreshToken(response.refreshToken);
                }

                const userId = this.getUserIdFromToken();
                if (!userId) {
                    throw new Error('Invalid token received after login.');
                }
                return this.authApiService.fetchUserRole(userId).pipe(
                    map(roleResponse => roleResponse.role as Role)
                );
            }),
            tap(role => {
                this.authStateService.setAuthState(role, true);
            }),
            catchError(error => {
                // Clearing tokens/state when login or role fetch fails
                // Using internal logout without navigation
                this.handleLogoutInternal(); 
                return throwError(() => error);
            })
        );
    }

    // --- Signup Methods (Delegated to ApiService, manage state) ---
    restaurantSignUp(credentials: iRestaurantSignup): Observable<RestaurantSignupResponse> {
        this.authStateService.setResolved(false);
        return this.authApiService.restaurantSignup(credentials).pipe(
            tap({
                next: () => this.authStateService.setResolved(true),
                error: (err) => { this.authStateService.setResolved(true); throw err; }
            })
        );
    }
    agentSignUp(credentials: iAgentSignup): Observable<AgentSignupResponse> {
         this.authStateService.setResolved(false);
         return this.authApiService.agentSignup(credentials).pipe(
             tap({
                next: () => this.authStateService.setResolved(true),
                error: (err) => { this.authStateService.setResolved(true); throw err; }
             })
         );
    }
    customerSignUp(credentials: iCustomerSignup): Observable<CustomerSignupResponse> {
         this.authStateService.setResolved(false);
         return this.authApiService.customerSignup(credentials).pipe(
             tap({
                next: () => this.authStateService.setResolved(true),
                error: (err) => { this.authStateService.setResolved(true); throw err; }
             })
         );
    }

    // --- Logout ---
    logout(): void {
        this.handleLogoutInternal();
        this.router.navigate(['auth/login']);
    }

    // Centralized internal state clearing logic
    private handleLogoutInternal(): void {
        this.tokenService.removeAllTokens();
        localStorage.clear();
        this.storeService.dispatch(emptyCart());
        this.authStateService.clearAuthState();
    }

    // Public method for interceptor/guards to trigger logout sequence
    public triggerLogoutAndRedirect(): void {
        this.handleLogoutInternal();
        this.router.navigate(['auth/login']);
    }


    // --- Refresh Token Call (Delegated) ---
    // This is now primarily for the interceptor to call
    public attemptRefreshToken(): Observable<RefreshResponse> {
       return this.refreshTokenService.refreshToken().pipe(
           catchError(error => {
               // If refresh fails with specific auth error, triggering full logout
                if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403 || error.status === 400)) {
                   this.triggerLogoutAndRedirect();
                }
                // Re-throwing the error for the interceptor/caller
                return throwError(() => error);
           })
       );
    }


    // --- Utility Methods ---
    public get isLoggedIn(): boolean {
        // Check state service OR token service - choose one source of truth
        // Using TokenService is often more direct for guards/interceptors
        return this.tokenService.hasAccessToken() && !this.tokenService.isAccessTokenExpired();
    }

    private getUserIdFromToken(): string | null {
        const token = this.tokenService.getAccessToken();
        if (!token) return null;
        try {
            const decodedToken: JwtPayload = jwtDecode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                return null;
            }
            return decodedToken.userId;
        } catch (error) {
            return null;
        }
    }

    // Initial load logic remains complex, needs careful state management
    private loadInitialRole(): void {
        const accessTokenExists = this.tokenService.hasAccessToken();
        const refreshTokenExists = this.tokenService.hasRefreshToken();
        
        // Case 1 : If both token does not exists
        if (!accessTokenExists && !refreshTokenExists) {
            this.authStateService.setAuthState(null, true);
            return;
        }
        
        // Case 2 : If access token exists
        if (accessTokenExists) {
            const isAccessTokenExpired = this.tokenService.isAccessTokenExpired();
            // Case 2-A : If access token is not expired
            if (!isAccessTokenExpired) {
                const userId = this.getUserIdFromToken();
                if (userId) {
                    this.fetchRoleAndResolveState(userId); // Fetches role and updates AuthStateService
                    return;
                } else {
                    this.triggerLogoutAndRedirect(); // Invalid token
                    this.authStateService.setResolved(true); // Still resolve after logout
                    return;
                }
            // Case 2-B : If access token is expired
            } 
            else {
                // Removing expired token
                this.tokenService.removeAccessToken(); 
                if (!refreshTokenExists) {
                    // Case : Refresh token does not exists when the access token is expired
                    // No refresh is possible triggering the logout and redirecting to login again
                    this.triggerLogoutAndRedirect(); 
                    this.authStateService.setResolved(true);
                } else {
                    // Refresh token exists, So interceptor will handle the logic of getting the access token by refresh token
                    this.authStateService.setAuthState(null, true);
                }
                return;
            }
        }
        
        // Only refresh token exists
        // Refresh token exists, So interceptor will handle the logic of getting the access token by refresh token
        if (!accessTokenExists && refreshTokenExists) {
            this.authStateService.setAuthState(null, true);
            return;
        }

         // Safety: If code reaches here that means some unexpected error has occured
         this.triggerLogoutAndRedirect();
         this.authStateService.setResolved(true);
    }

    // Fetches role, updates AuthStateService
    private fetchRoleAndResolveState(userId: string): void {
        this.authApiService.fetchUserRole(userId).pipe(
            take(1),
            catchError((error) => {
                // If role fetch fails logging out
                this.triggerLogoutAndRedirect();
                this.authStateService.setResolved(true); 
                return of(null);
            })
        ).subscribe(response => {
            if (response && response.role) {
                this.authStateService.setAuthState(response.role as Role, true);
            } else {
                // Role fetch succeeded but no role returned? Logout.
                this.triggerLogoutAndRedirect();
                 this.authStateService.setResolved(true);
            }
        });
    }
}