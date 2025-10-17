import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { getPathForRole } from '@shared/utils/navigations.utils';

export const authRedirectGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthStateResolved$.pipe(
    // 1. Wait until the auth state is resolved.
    filter(isResolved => isResolved),
    take(1),
    // 2. Once resolved, get the current role and make the decision.
    map(() => {
      const role = authService.userRoleSignal();
      if (role) {
        // User is logged in, redirect them.
        const path = getPathForRole(role);
        return router.createUrlTree([path]);
      } else {
        // User is not logged in, allow access.
        return true;
      }
    })
  );
};