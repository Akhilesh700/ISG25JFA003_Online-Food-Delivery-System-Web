import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home-page/home-page.component').then(m => m.HomePageComponent),
    title: "DineCognizant - Home"
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/user-profile/user-profile').then(m => m.UserProfileComponent)
  },
  {
    path: 'order-history',
    loadComponent: () => import('./pages/user-profile/order-history/order-history').then(m => m.OrderHistoryComponent)
  },
  {
    path: 'restaurant/:id',
    // Route for /user/resturant
    loadComponent: () => import('./pages/resturant/resturant').then(m => m.Resturant)
  },

  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout').then(m => m.Checkout)

  },
  {

    path: 'track-order',
    loadComponent: () => import('./pages/track-order/track-order').then(m => m.TrackOrder)
  },


  // Optional: A wild card route for handling unknown paths within the customer module
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];