import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        // When a URL starts with 'restaurant', load the restaurant feature routes
        path: 'restaurant',
        loadChildren: () => import('./features/restaurant/restaurant.routes').then(m => m.RESTAURANT_ROUTES)
    },
    // Redirect the user to the restaurant section by default
    {
        path: '',
        redirectTo: '/restaurant',
        pathMatch: 'full'
    }
];