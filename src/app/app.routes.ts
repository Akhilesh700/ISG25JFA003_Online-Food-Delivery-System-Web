import { Routes } from '@angular/router';

type Role = 'Admin' | 'Customer' | 'Restaurant' | 'Delivery';

const role: Role = (localStorage.getItem('role') as Role) || 'Customer';

export const routes: Routes = [
    {
        path: '', 
        loadChildren : 
            () => import('./features/customer/customer.routes').then(m => m.routes)
             
    }
];
