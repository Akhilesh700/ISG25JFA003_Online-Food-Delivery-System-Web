import { Routes } from '@angular/router';
import { LoginComponent } from './login/ui/login-page/login.component';
import { RestaurantFormComponent } from './signup/ui/signup-form/restaurant-form/restaurant-form.component';
import { CustomerFormComponent } from './signup/ui/signup-form/customer-form/customer-form.component';
import { DeliveryAgentFormComponent } from './signup/ui/signup-form/delivery-agent-form/delivery-agent-form.component';

export const routes: Routes = [
  {
    path: 'signup/restaurant',
    component: RestaurantFormComponent,
    title: "DineCognizant - Signup"
  },
  {
    path: 'signup/delivery-agent',
    component: DeliveryAgentFormComponent,
    title: "DineCognizant - Signup"
  },
  {
    path: 'signup/',
    component: CustomerFormComponent,
    title: "DineCognizant - Signup"
  },
  {
    path: 'login',
    component: LoginComponent,
    title: "DineCognizant - Login"
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

