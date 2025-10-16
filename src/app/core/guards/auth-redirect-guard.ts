import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators'; // <-- Import 'filter'
import { AuthService } from '../services/auth.service';
import { getPathForRole } from '@shared/utils/navigations.utils';

/**
 * A functional guard that prevents authenticated users from accessing public-only routes.
 * It now waits for the authentication state to be resolved before making a decision.
 */
export const authRedirectGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.userRole$.pipe(
    // **THE FIX**: Filter will wait until the userRole$ observable emits a value
    // that is not the initial `null`. This pauses the guard until loadInitialRole() completes.
    filter(role => role !== null),
    
    // Once a definitive value is received (either a role or a final null), take it and complete.
    take(1), 
    
    map(role => {
      if (role) {
        // User is logged in. Redirect them to their dashboard.
        const path = getPathForRole(role);
        return router.createUrlTree([path]);
      } else {
        // User is not logged in. Allow access to the login page.
        return true;
      }
    })
  );
};