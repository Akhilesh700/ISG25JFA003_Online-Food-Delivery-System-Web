import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, filter } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { TokenService } from '../services/auth/token.service';
import { Role } from '../services/auth/auth.models';

export const roleGuard: CanActivateFn = (route): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as Role[];

  return authService.isAuthStateResolved$.pipe(
    // 1. Wait until the initial auth state check is complete.
    filter(isResolved => isResolved === true),
    take(1),
    // 2. Once resolved, evaluate the situation.
    switchMap(() => { // Use switchMap to chain async checks if needed in future
      const userRole = authService.userRoleSignal();
      const isLoggedInWithValidAccessToken = authService.isLoggedIn; // Checks access token validity

      // --- Scenario 1: User has a valid role and a non-expired access token ---
      if (isLoggedInWithValidAccessToken && userRole && expectedRoles.includes(userRole)) {
        console.log("Allowing access because user has access token")
        return of(true); // Allow access immediately
      }

      // --- Scenario 2: User doesn't have a valid access token or role, BUT might have a refresh token ---
      else if (tokenService.hasRefreshToken()) {
        // Allow navigation to proceed. The component on the route will likely
        // make an API call. The AuthInterceptor will catch the expected 401
        // and attempt to refresh the token. If refresh fails, AuthService.handleLogout
        // (called by the interceptor) will handle the redirect to login.
          console.log("Allowing access because user has refresh token")
          return of(true);
        }
        // --- Scenario 3: User is not logged in (no valid access token) AND has no refresh token ---
        else {
          // No valid session at all. Redirect to login.
          authService.handleLogout(); // Ensure clean state before redirect
          console.log("Denying access because user does not have any token")
        // Return the UrlTree for redirection (handleLogout already navigates, but guard needs to return it)
        return of(router.createUrlTree(['/auth/login'])); // Redirect to login
        // return of(router.createUrlTree(['/unauthorised'])); // Or keep unauthorised if preferred
      }
    })
  );
};