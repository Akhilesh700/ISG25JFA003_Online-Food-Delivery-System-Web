import { Injectable, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError, take, map, switchMap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

import { TokenService } from '../auth/token.service';
import { AuthApiService } from './auth-api.service';
import { AgentSignupResponse, AuthResponse, CustomerSignupResponse, JwtPayload, LoginCredentials, RestaurantSignupResponse, Role } from './auth.models';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { emptyCart } from 'src/app/state/cart/cart.action';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authApiService = inject(AuthApiService);
    private tokenService = inject(TokenService);
    private router = inject(Router);
    protected readonly storeSerice = inject<Store<AppState>>(Store);
    private userRole = signal<Role>(null);
    public readonly userRoleSignal = this.userRole.asReadonly();
    public userRole$ = toObservable(this.userRole);

    /**
     * A new signal to track if the initial authentication check is complete.
     * This is crucial for guards to prevent race conditions on app load.
     */
    private isAuthStateResolved = signal<boolean>(false);
    public readonly isAuthStateResolved$ = toObservable(this.isAuthStateResolved);

    constructor() {
        this.loadInitialRole();
    }

    /**
     * Orchestrates the entire login flow as a single atomic operation.
     * 1. Calls the login API.
     * 2. Saves the token.
     * 3. Fetches the user's role.
     * 4. Updates the internal state signals.
     * @returns An Observable that emits the user's final Role upon successful completion.
     */
    login(credentials: LoginCredentials): Observable<Role | null> {
        // Reset the resolved state at the start of a login attempt.
        this.isAuthStateResolved.set(false);
        
        return this.authApiService.login(credentials).pipe(
            // Use switchMap to chain the login API call with the role fetching call.
            switchMap(response => {
                this.tokenService.saveToken(response.jwt);
                
                const userId = this.getUserIdFromToken();
                if (!userId) {
                    // If the token is invalid right after login, something is wrong.
                    this.logout(); // Ensure a clean state
                    return of(null);
                }
                
                // Return the inner observable for fetching the role.
                return this.authApiService.fetchUserRole(userId).pipe(
                    map(roleResponse => roleResponse.role)
                );
            }),
            // `tap` the final result (the role) to update the state signals.
            tap(role => {
                this.userRole.set(role);
                // IMPORTANT: Signal that the entire auth process is now resolved.
                this.isAuthStateResolved.set(true); 
            }),
            catchError(error => {
                console.error('Login or role fetch failed:', error.message);
                this.logout();
                throw error; // Propagate error to the component
            })
        );
    }
    restaurantSignUp(credentials: iRestaurantSignup): Observable<RestaurantSignupResponse>{
        this.isAuthStateResolved.set(false);

        return this.authApiService.restaurantSignup(credentials).pipe(
            tap({
                next: (response) =>{
                    this.isAuthStateResolved.set(true);
                },
                error: (error) => {
                    this.isAuthStateResolved.set(true);
                    throw error;
                }
            })
        );     
    }
    agentSignUp(credentials: iAgentSignup): Observable<AgentSignupResponse>{
        this.isAuthStateResolved.set(false);

        return this.authApiService.agentSignup(credentials).pipe(
            tap({
                next: (response) =>{
                    this.isAuthStateResolved.set(true);
                },
                error: (error) => {
                    this.isAuthStateResolved.set(true);
                    throw error;
                }
            })
        );     
    }
    customerSignUp(credentials: iCustomerSignup): Observable<CustomerSignupResponse>{
        this.isAuthStateResolved.set(false);

        return this.authApiService.customerSignup(credentials).pipe(
            tap({
                next: (response) =>{
                    this.isAuthStateResolved.set(true);
                },
                error: (error) => {
                    this.isAuthStateResolved.set(true);
                    throw error;
                }
            })
        );     
    }

    logout(): void {
        this.tokenService.removeToken();
        localStorage.clear()
        this.storeSerice.dispatch(emptyCart())
        this.userRole.set(null);
        this.isAuthStateResolved.set(true); // After logout, the state is resolved (as "logged out").
        this.router.navigate(['auth/login']);
    }

    public get isLoggedIn(): boolean {
        return !!this.userRole();
    }
    
    private getUserIdFromToken(): string | null {
        const token = this.tokenService.getToken();
        if (!token) return null;
        try {
            const decodedToken: JwtPayload = jwtDecode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                this.logout();
                return null;
            }
            return decodedToken.userId;
        } catch (error) {
            console.error('Failed to decode JWT:', error);
            this.logout();
            return null;
        }
    }

    private loadInitialRole(): void {
        const userId = this.getUserIdFromToken();
        if (!userId) {
            this.userRole.set(null);
            this.isAuthStateResolved.set(true); // State is resolved as "logged out".
            return;
        }

        this.authApiService.fetchUserRole(userId).pipe(
            take(1),
            catchError(() => {
                this.logout();
                return of(null);
            })
        ).subscribe(response => {
            this.userRole.set(response ? response.role : null);
            this.isAuthStateResolved.set(true); // State is now resolved (either with a role or null).
        });
    }
}