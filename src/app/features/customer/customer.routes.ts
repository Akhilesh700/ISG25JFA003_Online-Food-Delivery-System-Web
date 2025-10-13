import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
// Import any guards you might need
// import { AuthGuard } from 'path/to/auth.guard'; 

export const routes: Routes = [
  {
    path: '', 
    // This is the default route when the customer module loads (e.g., /customer)
    component: Home, 
    // You'd typically use a guard here to ensure the user is logged in
    // canActivate: [AuthGuard] 
  },

  {
    path: 'resturant/:id',
    // Route for /customer/resturant
    loadComponent: () => import('./pages/resturant/resturant').then(m => m.Resturant)
  },
  // Optional: A wild card route for handling unknown paths within the customer module
  {
    path: '**', 
    redirectTo: '', // Redirects back to the dashboard
    pathMatch: 'full'
  }
];