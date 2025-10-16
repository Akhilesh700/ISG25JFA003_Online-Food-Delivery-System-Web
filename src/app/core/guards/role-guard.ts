import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Role } from '../services/auth.models';

/**
 * Functional route guard to control access based on user roles.
 */
export const roleGuard: CanActivateFn = (route): Observable<boolean | UrlTree> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Read the expected roles from the route's `data` property.
    const expectedRoles = route.data['roles'] as Role[];

    if (!expectedRoles || expectedRoles.length === 0) {
        console.error('Route is missing `data.roles` configuration.');
        return of(router.createUrlTree(['/unauthorized']));
    }

    // Consume the userRole$ observable from the LoginService.
    return authService.userRole$.pipe(
        filter((role) => role !== null),
        take(1), // Automatically unsubscribe after the first value is received.
        map((userRole) => {
            // Check if the current user's role is one of the expected roles.
            if (userRole && expectedRoles.includes(userRole)) {
                return true; // Access granted.
            } else {
                // If not authorized, redirect to an "unauthorized" page.
                return router.createUrlTree(['/unauthorized']);
            }
        })
    );
};
