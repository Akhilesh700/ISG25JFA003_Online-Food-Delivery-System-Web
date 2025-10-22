import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Manage Menu</h2>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div class="text-center">
          <div class="text-6xl mb-4">🍽️</div>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Menu Management</h3>
          <p class="text-gray-600 dark:text-gray-400">This feature is coming soon! You'll be able to manage your restaurant menu here.</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ManageMenuComponent {
}
