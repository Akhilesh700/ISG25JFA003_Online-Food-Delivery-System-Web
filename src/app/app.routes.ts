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
        title: 'DineCognizant - Welcome'
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
        path: 'unauthorised',
        loadComponent : () => import('./shared/components/unauthorised/unauthorised.component').then(m=>m.UnauthorisedComponent)
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