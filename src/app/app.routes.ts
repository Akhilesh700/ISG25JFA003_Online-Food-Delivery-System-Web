import { Routes } from '@angular/router';
import { LandingPageComponent } from './features/customer/landing/landing-page/landing-page';

export const routes: Routes = [
    // Default Route:
    // When a user navigates to the root of your website (e.g., http://localhost:4200),
    // this configuration will load the LandingPageComponent.
    {
        path: '',
        component: LandingPageComponent,
        title: 'DineCognizant - Welcome' // Optional: Sets the browser tab title
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