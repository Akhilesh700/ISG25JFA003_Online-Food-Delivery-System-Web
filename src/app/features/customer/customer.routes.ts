import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  {
    path: '', 
    component: Home, 
  },
  // Optional: A wild card route for handling unknown paths within the customer module
  {
    path: '**', 
    redirectTo: '',
    pathMatch: 'full'
  }
];