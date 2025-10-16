import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home', 
    loadComponent : () => import('./home/home-page/home-page.component').then(m => m.HomePageComponent), 
  },
  // Optional: A wild card route for handling unknown paths within the customer module
  {
    path: '**', 
    redirectTo: 'home',
    pathMatch: 'full'
  }
];