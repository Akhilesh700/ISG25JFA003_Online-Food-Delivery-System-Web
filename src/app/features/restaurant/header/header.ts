import { Component, Output, EventEmitter, ElementRef, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <-- Import RouterModule

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule], // <-- Add RouterModule here
  templateUrl: './header.html',
  styles: []
})
export class HeaderComponent {
  @Input() isDarkMode: boolean = false;
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() toggleThemeEvent = new EventEmitter<void>();
  
  isProfileDropdownOpen: boolean = false;

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
}