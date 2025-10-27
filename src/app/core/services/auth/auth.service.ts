import { Injectable, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'; // Import HttpErrorResponse
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError, take, map, switchMap, filter, finalize } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

import { TokenService } from '../auth/token.service'; // Adjust path if needed
import { AuthApiService } from './auth-api.service';
import {
    AgentSignupResponse, AuthResponse, CustomerSignupResponse, JwtPayload,
    LoginCredentials, RestaurantSignupResponse, Role,
    RefreshResponse, RefreshRequest, 
} from './auth.models';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { emptyCart } from 'src/app/state/cart/cart.action';
import { navigateToDashboard } from '@shared/utils/navigations.utils';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // --- Injected Services ---
    private authApiService = inject(AuthApiService);
    private tokenService = inject(TokenService);
    private router = inject(Router);
    private http = inject(HttpClient);
    protected readonly storeService = inject<Store<AppState>>(Store);

    // --- State Signals ---
    private userRole = signal<Role>(null);
    public readonly userRoleSignal = this.userRole.asReadonly();
    public userRole$ = toObservable(this.userRole);
    private isAuthStateResolved = signal<boolean>(false);
    public readonly isAuthStateResolved$ = toObservable(this.isAuthStateResolved);

    // --- Refresh Token State ---
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<string | Error | null> = new BehaviorSubject<string | Error | null>(null);
    private refreshTokenUrl = `${environment.apiUrl}api/${environment.version}/auth/refresh`;

    constructor() {
        this.loadInitialRole();
    }

    // --- Login ---
    login(credentials: LoginCredentials): Observable<Role | null> {
        this.isAuthStateResolved.set(false);

        return this.authApiService.login(credentials).pipe(
            switchMap((response: AuthResponse) => {
                // console.log(response); // Keep for debugging if needed
                if (!response?.jwt ) {
                    throw new Error('Access token token missing in login response');
                }
                if(response?.refreshToken){
                    this.tokenService.saveRefreshToken(response.refreshToken);                    
                }
                this.tokenService.saveAccessToken(response.jwt);

                const userId = this.getUserIdFromToken();
                if (!userId) {
                    // If token is invalid immediately after login, treat as error
                    throw new Error('Invalid token received after login.');
                }
                return this.authApiService.fetchUserRole(userId).pipe(
                    map(roleResponse => roleResponse.role as Role)
                );
            }),
            tap(role => {
                this.userRole.set(role);
                this.isAuthStateResolved.set(true);
            }),
            catchError(error => {
                return throwError(() => error);
            })
        );
    }

    // --- Signup Methods (Implement actual calls or keep stubs) ---
    restaurantSignUp(credentials: iRestaurantSignup): Observable<RestaurantSignupResponse> {
        this.isAuthStateResolved.set(false);
        return this.authApiService.restaurantSignup(credentials).pipe(
            tap({
                next: (response) => { this.isAuthStateResolved.set(true); },
                error: (error) => { this.isAuthStateResolved.set(true); throw error; }
            })
        );
    }
    agentSignUp(credentials: iAgentSignup): Observable<AgentSignupResponse> {
        this.isAuthStateResolved.set(false);
        return this.authApiService.agentSignup(credentials).pipe(
            tap({
                next: (response) => { this.isAuthStateResolved.set(true); },
                error: (error) => { this.isAuthStateResolved.set(true); throw error; }
            })
        );
    }
    customerSignUp(credentials: iCustomerSignup): Observable<CustomerSignupResponse> {
        this.isAuthStateResolved.set(false);
        return this.authApiService.customerSignup(credentials).pipe(
            tap({
                next: (response) => { this.isAuthStateResolved.set(true); },
                error: (error) => { this.isAuthStateResolved.set(true); throw error; }
            })
        );
    }


    // --- Logout ---
    logout(): void {
        this.handleLogout();
    }

    // Centralized Logout Logic
    handleLogout(): void {
        this.tokenService.removeAllTokens();
        localStorage.clear(); // Keep if necessary for other non-auth browser data
        this.storeService.dispatch(emptyCart());
        this.userRole.set(null);
        this.isAuthStateResolved.set(true);
        this.isRefreshing = false;
        this.refreshTokenSubject.next(null);
        this.router.navigate(['auth/login']); // Use router injection
    }

    // --- Refresh Token Logic ---
    refreshToken(): Observable<RefreshResponse> {
        if (this.isRefreshing) {
            // Wait for the ongoing refresh result
            return this.refreshTokenSubject.pipe(
                filter(result => result !== null),
                take(1),
                switchMap(result => {
                    if (result instanceof Error) {
                        return throwError(() => result);
                    }
                    return of({ accessToken: result as string } as RefreshResponse);
                })
            );
        } else {
            const storedRefreshToken = this.tokenService.getRefreshToken();
            if (!storedRefreshToken) {
                this.handleLogout();
                return throwError(() => new Error('Refresh token not available'));
            }

            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            const payload: RefreshRequest = { refreshToken: storedRefreshToken };
            const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

            return this.http.post<RefreshResponse>(this.refreshTokenUrl, payload, { headers }).pipe(
                tap(response => {
                    // --- This part correctly handles the provided response structure ---
                    const newAccessToken = response.accessToken; // Accesses the 'accessToken' field
                    if (!newAccessToken) {
                        throw new Error("New access token not found in refresh response");
                    }
                    this.tokenService.saveAccessToken(newAccessToken);

                    if (response.refreshToken) {
                        this.tokenService.saveRefreshToken(response.refreshToken);
                    }
                    this.refreshTokenSubject.next(newAccessToken); 
                }),
                catchError(error => {
                    this.handleLogout();
                    this.refreshTokenSubject.next(error);
                    return throwError(() => error);
                }),
                finalize(() => this.isRefreshing = false)
            );
        }
    }


    // --- Utility Methods ---

    public get isLoggedIn(): boolean {
        // Check existence and expiry of the access token
        return this.tokenService.hasAccessToken() && !this.tokenService.isAccessTokenExpired();
    }

    // Decodes the ACCESS token to get User ID
    private getUserIdFromToken(): string | null {
        const token = this.tokenService.getAccessToken();
        if (!token) return null;
        try {
            const decodedToken: JwtPayload = jwtDecode(token);
            // Re-verify expiry, though interceptor is primary check
            if (decodedToken.exp * 1000 < Date.now()) {
                return null; // Expired
            }
            return decodedToken.userId;
        } catch (error) {
            return null; // Invalid token
        }
    }

    // Loads role based on ACCESS token on initial application load
    private loadInitialRole(): void {
        const tokenExists = this.tokenService.hasAccessToken();
        const tokenExpired = this.tokenService.isAccessTokenExpired();

        if (!tokenExists || tokenExpired) {
            this.userRole.set(null);
            this.tokenService.removeAllTokens(); // Clean up invalid/expired tokens
            this.isAuthStateResolved.set(true);
            return;
        }

        const userId = this.getUserIdFromToken();
        if (!userId) {
            // If decoding failed or re-check showed expiry
            this.handleLogout();
            this.isAuthStateResolved.set(true);
            return;
        }

        // Token seems valid, proceed to fetch role
        this.authApiService.fetchUserRole(userId).pipe(
            take(1), // Only need the first response
            catchError((error) => {
                // Handle API errors during role fetch
                this.handleLogout();
                return of(null); // Return null observable on error
            })
        ).subscribe(response => {
            if (response && response.role) {
                this.userRole.set(response.role as Role);
            } else {
                // API returned OK but no role - treat as error/logout
                this.handleLogout();
            }
            this.isAuthStateResolved.set(true); // State is resolved
        });
    }
}