import { Routes } from '@angular/router';
import { LandingPageComponent } from './features/customer/landing/landing-page/landing-page';
import { roleGuard } from './core/guards/role-guard';
import { authRedirectGuard } from './core/guards/auth-redirect-guard';

export const routes: Routes = [
    // Default Route:
    // When a user navigates to the root of your website (e.g., http://localhost:4200),
    // this configuration will load the LandingPageComponent.
    {
        path: '',
        component: LandingPageComponent,
        title: 'DineCognizant - Welcome',
        canActivate: [authRedirectGuard]
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.router').then(m =>m.routes),     
        canActivate: [authRedirectGuard]
    },
    {
        path: 'user',
        loadChildren: () => import('./features/customer/customer.routes').then(m =>m.routes),      
        canActivate: [roleGuard],
        data: {roles : ['ROLE_ADMIN', 'ROLE_CUSTOMER']}  
    },
    {
        path: 'restaurant',
        loadChildren: () => import('./features/restaurant/restaurant.routes').then(m =>m.RESTAURANT_ROUTES),
        canActivate: [roleGuard], 
        data: {roles : ['ROLE_ADMIN', 'ROLE_RESTAURANT']
    },
    {
        path: 'delivery',
        loadChildren: () => import('./features/delivery-agent/delivery.routes').then(m =>m.routes),      
        canActivate: [roleGuard],
        data: {roles : ['ROLE_ADMIN', 'ROLE_DELIVERY_AGENT']} 
    },
    {
        path: 'unauthorised',
        loadComponent : () => import('./shared/components/unauthorised/unauthorised.component').then(m=>m.UnauthorisedComponent)
    },
    {
        path: 'session-expired',
        loadComponent : () => import('./shared/components/session-expired/session-expired.component').then(m=>m.SessionExpiredComponent)
    },
    // Wildcard Route (Fallback):
    // If the user navigates to any URL that doesn't match the routes defined above,
    // this will redirect them back to the home page.
    // The 'pathMatch: 'full'' ensures it only triggers for unmatched full paths.
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];