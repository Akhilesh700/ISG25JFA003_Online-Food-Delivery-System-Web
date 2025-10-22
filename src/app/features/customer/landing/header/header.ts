import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule], // Import ButtonComponent
  templateUrl: './header.html',
})
export class HeaderComponent {
  navLinks = ['Home', 'Menu', 'About', 'Contact'];
}