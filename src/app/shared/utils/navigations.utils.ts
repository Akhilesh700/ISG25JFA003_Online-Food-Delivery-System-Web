import { Router } from '@angular/router';
import { Role } from 'src/app/core/services/auth.models';

/**
 * Determines the appropriate application path for a given user role.
 * This function centralizes the mapping of roles to their respective dashboards or home pages.
 * @param role The role of the user.
 * @returns The route path as a string.
 */
export function getPathForRole(role: Role): string {
    switch (role) {
        case 'ROLE_ADMIN':
        case 'ROLE_CUSTOMER':
            return '/user/home';
        case 'ROLE_RESTAURANT':
            return '/restaurant/dashboard';
        case 'ROLE_DELIVERY_AGENT':
            return '/delivery/dashboard';
        default:
            // Fallback to the login page if the role is unknown or null.
            return '/login';
    }
}

/**
 * Navigates the user to their designated dashboard based on their role.
 * @param role The role of the authenticated user.
 * @param router An instance of the Angular Router.
 */
export function navigateToDashboard(role: Role, router: Router): void {
    const path = getPathForRole(role);
    router.navigate([path]);
}