import { Component, Output, EventEmitter, ElementRef, HostListener, Input, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { RestaurantService } from '../../../core/services/restaurant/restaurant.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styles: []
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isDarkMode: boolean = false;
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() toggleThemeEvent = new EventEmitter<void>();
  
  isProfileDropdownOpen: boolean = false;
  restaurantName: string = 'Restaurant';
  restaurantInitials: string = 'R';
  
  private authService = inject(AuthService);
  private restaurantService = inject(RestaurantService);
  private destroy$ = new Subject<void>();

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    // Subscribe to profile updates
    this.restaurantService.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe(profile => {
        if (profile && profile.name) {
          this.restaurantName = profile.name;
          this.restaurantInitials = this.getInitials(profile.name);
        }
      });

    // Load profile from API if endpoint exists
    this.restaurantService.getProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (err) => {
          // Profile endpoint not available yet - will be updated when user updates profile
          console.log('Profile will be loaded after first update');
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getInitials(name: string): string {
    if (!name) return 'R';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  
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