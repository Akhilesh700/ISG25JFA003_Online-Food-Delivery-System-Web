// src/app/core/guards/role.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, filter } from 'rxjs/operators';
import { AuthStateService } from '../services/auth/auth-state.service'; // Use AuthStateService
import { TokenService } from '../services/auth/token.service'; // Use TokenService
import { Role } from '../services/auth/auth.models'; // Adjust path
import { AuthService } from '../services/auth/auth.service'; // Inject AuthService for logout trigger

export const roleGuard: CanActivateFn = (route): Observable<boolean | UrlTree> => {
  const authStateService = inject(AuthStateService);
  const tokenService = inject(TokenService);
  const authService = inject(AuthService); // Inject AuthService for logout
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as Role[];

  return authStateService.isAuthStateResolved$.pipe(
    filter(isResolved => isResolved === true),
    take(1),
    switchMap(() => {
      const userRole = authStateService.userRole(); // Get role from state
      const hasRefreshToken = tokenService.hasRefreshToken(); // Check refresh token

      // Check if access token is technically valid (exists and not expired)
      // Note: role might still be null here if initial fetch failed but refresh exists
      const hasValidAccessToken = tokenService.hasAccessToken() && !tokenService.isAccessTokenExpired();

      // Scenario 1: Valid Access Token AND Correct Role already loaded
      if (hasValidAccessToken && userRole && expectedRoles.includes(userRole)) {
        return of(true);
      }
      // Scenario 2: Refresh Token Exists (even if access token expired/missing or role unknown)
      else if (hasRefreshToken) {
          // Allow navigation. Interceptor will handle refresh on first API call.
          // If refresh fails, AuthService.attemptRefreshToken will trigger logout.
          return of(true);
      }
      // Scenario 3: No valid Access Token, No Refresh Token
      else {
        // No session possible. Trigger logout and redirect.
        authService.triggerLogoutAndRedirect(); // Use the AuthService method
        return of(false); // Prevent navigation (although redirect happens)
        // Alternatively return the UrlTree directly if triggerLogoutAndRedirect doesn't navigate
        // return of(router.createUrlTree(['/auth/login']));
      }
    })
  );
};