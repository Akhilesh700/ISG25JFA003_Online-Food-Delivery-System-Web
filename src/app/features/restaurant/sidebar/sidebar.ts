import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Import MenuItem from restaurant component
import { MenuItem } from '../restaurant';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styles: []
})
export class SidebarComponent {
  @Input() menuItems: MenuItem[] = [];
  @Input() isOpen: boolean = true;
}