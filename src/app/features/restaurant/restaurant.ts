import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar';
import { HeaderComponent } from './header/header';

export interface MenuItem {
  name: string;
  icon: string;
  route: string;
  fragment?: string;
  badge?: string | number;
}

@Component({
  selector: 'app-restaurant',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './restaurant.html',
})
export class RestaurantComponent {
  sidebarOpen: boolean = true;
  isDarkMode: boolean = false;

  menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: '📊', route: '/restaurant/dashboard' },
    { name: 'Manage Menu', icon: '📋', route: '/restaurant/manage-menu' },
    { name: 'Order History', icon: '📦', route: '/restaurant/order-history' }
  ];

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}