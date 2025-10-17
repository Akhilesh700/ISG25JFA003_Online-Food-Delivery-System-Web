import { Injectable, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError, take, map, switchMap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

import { TokenService } from './token.service';
import { AuthApiService } from './auth-api.service';
import { AuthResponse, JwtPayload, LoginCredentials, Role } from './auth.models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authApiService = inject(AuthApiService);
    private tokenService = inject(TokenService);
    private router = inject(Router);

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

    login(credentials: LoginCredentials): Observable<AuthResponse> {
        // We set resolved state to false during login to ensure guards wait
        this.isAuthStateResolved.set(false); 
        return this.authApiService.login(credentials).pipe(
            tap(response => {
                this.tokenService.saveToken(response.jwt);
                this.loadInitialRole();
            }),
            catchError(error => {
                console.error('Login failed:', error.message);
                this.logout();
                throw error;
            })
        );
    }

    logout(): void {
        this.tokenService.removeToken();
        this.userRole.set(null);
        this.isAuthStateResolved.set(true); // After logout, the state is resolved (as "logged out").
        this.router.navigate(['/authlogin']);
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