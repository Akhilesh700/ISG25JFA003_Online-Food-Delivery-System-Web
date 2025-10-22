import { Component, Output, EventEmitter, ElementRef, HostListener, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styles: []
})
export class HeaderComponent {
  @Input() isDarkMode: boolean = false;
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() toggleThemeEvent = new EventEmitter<void>();
  
  isProfileDropdownOpen: boolean = false;
  
  private authService = inject(AuthService);

  constructor(private elementRef: ElementRef) {}
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isProfileDropdownOpen = false;
    }
  }

  onToggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }

  onToggleTheme(): void {
    this.toggleThemeEvent.emit();
  }
  
  toggleProfileDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }
  
  onLogout(): void {
    this.isProfileDropdownOpen = false;
    this.authService.logout();
  }
}