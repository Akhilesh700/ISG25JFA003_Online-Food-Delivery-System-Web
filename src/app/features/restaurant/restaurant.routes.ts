import { Routes } from '@angular/router';

// Import the layout and page components
import { RestaurantComponent } from './restaurant';
import { UpdateProfileComponent } from './update-profile/update-profile';
import { OrderHistoryComponent } from './order-history/order-history';
import { DashboardContentComponent } from './dashboard-content/dashboard-content';

export const RESTAURANT_ROUTES: Routes = [
    {
        // The base path ('/restaurant') will load the RestaurantComponent layout.
        path: '',
        component: RestaurantComponent,
        // The components listed below will be rendered inside the RestaurantComponent's <router-outlet>
        children: [
            {
                // The default child route (e.g., '/restaurant') redirects to dashboard
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                // This route (/restaurant/dashboard) loads the dashboard.
                path: 'dashboard',
                component: DashboardContentComponent
            },
            {
                // This route (/restaurant/order-history) loads the order history.
                path: 'order-history',
                component: OrderHistoryComponent
            },
            {
                // This route (/restaurant/update-profile) loads the profile page.
                path: 'update-profile',
                component: UpdateProfileComponent
            }
        ]
    }
];