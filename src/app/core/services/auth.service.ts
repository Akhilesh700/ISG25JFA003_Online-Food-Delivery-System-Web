import { Injectable, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError, take, map, switchMap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

import { TokenService } from './token.service';
import { AuthApiService } from './auth-api.service';
import { AuthResponse, JwtPayload, LoginCredentials, Role } from './auth.models';

/**
 * Manages the application's authentication state.
 * This service coordinates token management and API calls to provide a reactive
 * source of truth for the user's authentication status and role.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // --- DEPENDENCY INJECTION ---
    private authApiService = inject(AuthApiService);
    private tokenService = inject(TokenService);
    private router = inject(Router);

    // --- STATE MANAGEMENT WITH SIGNALS ---
    private userRole = signal<Role>(null);
    public readonly userRoleSignal = this.userRole.asReadonly();
    public userRole$ = toObservable(this.userRole);

    constructor() {
        this.loadInitialRole();
    }

    /**
     * Orchestrates the entire login flow.
     * 1. Calls the login API.
     * 2. Saves the token.
     * 3. Fetches the user's role.
     * 4. Updates the internal state signal.
     * @returns An Observable that emits the user's final Role upon successful completion.
     */
    login(credentials: LoginCredentials): Observable<Role | null> {
        return this.authApiService.login(credentials).pipe(
            // Use switchMap to chain the login API call with the role fetching call.
            switchMap(response => {
                this.tokenService.saveToken(response.jwt);
                
                const userId = this.getUserIdFromToken();
                if (!userId) {
                    // If token is invalid right after login, something is wrong.
                    return of(null);
                }
                
                // Return the inner observable for fetching the role.
                return this.authApiService.fetchUserRole(userId).pipe(
                    map(roleResponse => roleResponse.role)
                );
            }),
            // `tap` the final result (the role) to update the state signal.
            tap(role => {
                this.userRole.set(role);
            }),
            catchError(error => {
                console.error('Login or role fetch failed:', error.message);
                this.logout();
                throw error;
            })
        );
    }

    /**
     * Clears user session data and resets the authentication state.
     */
    logout(): void {
        this.tokenService.removeToken();
        this.userRole.set(null);
        this.router.navigate(['/login']);
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
        });
    }
}