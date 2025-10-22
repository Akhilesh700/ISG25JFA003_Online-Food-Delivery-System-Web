import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Use the MenuItem interface defined in app.component
import { MenuItem } from '../../../app'; 

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