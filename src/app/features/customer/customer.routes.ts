import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home', 
    loadComponent : () => import('./home/home-page/home-page.component').then(m => m.HomePageComponent), 
  },

  {
    path: 'resturant/:id',
    // Route for /user/resturant
    loadComponent: () => import('./pages/resturant/resturant').then(m => m.Resturant)
  },

  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout').then(m=> m.Checkout)

  },


  // Optional: A wild card route for handling unknown paths within the customer module
  {
    path: '**', 
    redirectTo: 'home',
    pathMatch: 'full'
  }
];