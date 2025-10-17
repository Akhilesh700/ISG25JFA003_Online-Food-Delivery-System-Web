import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Role } from '../services/auth.models';

export const roleGuard: CanActivateFn = (route): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as Role[];

  return authService.isAuthStateResolved$.pipe(
    // 1. Wait until the auth state is resolved.
    filter(isResolved => isResolved),
    take(1),
    // 2. Once resolved, get the current role and make the decision.
    map(() => {
      const userRole = authService.userRoleSignal();
      if (userRole && expectedRoles.includes(userRole)) {
        return true; // Access granted
      } else {
        return router.createUrlTree(['/unauthorised']); // Use your actual unauthorized route
      }
    })
  );
};