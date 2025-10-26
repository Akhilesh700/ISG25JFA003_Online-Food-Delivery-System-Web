import { Component, ElementRef, HostListener, inject, NgModule, OnInit, signal, OnDestroy } from '@angular/core'; // Added OnDestroy
import { ZardSwitchComponent } from '../switch/switch.component';
import { DarkModeService } from '@shared/services/darkmode.service';
import { FormsModule } from '@angular/forms';
import { ZardSheetService } from '../sheet/sheet.service';
import { CartSheet } from './cart-sheet/cart-sheet';
import { UserOptionsSheet } from './user-options-sheet/user-options-sheet';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { selectCartItems, selectCartState } from 'src/app/state/cart/cart.selector';
import { AsyncPipe, CommonModule } from '@angular/common'; // Keep CommonModule
import { IDish } from 'src/app/models/resturantInterface';
import { Router, RouterLink } from '@angular/router'; // Import RouterLink
import { SearchService } from 'src/app/core/services/customer/search/search.service'; // Corrected path
import { Subscription } from 'rxjs';
import { SearchResultItem } from 'src/app/models/iSearch'; // Use the correct path for SearchResultItem

const getCurrentUser = () => {
    return {
        userId: '123',
        name: 'John Doe',
        avatarUrl: 'https://i.pravatar.cc/300',
        location: 'Coimbatore, In',
    };
};
@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        ZardSwitchComponent,
        FormsModule,
        AsyncPipe, // Keep if used for cartItems$ directly in template
        CommonModule, // Keep for async pipe and directives
        RouterLink // *** ADDED RouterLink HERE ***
    ],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy { // Implement OnDestroy
    // --- Injected Services ---
    protected readonly darkmodeService = inject(DarkModeService);
    protected readonly sheetService = inject(ZardSheetService);
    protected readonly storeSerice = inject<Store<AppState>>(Store);
    protected readonly router = inject(Router);
    protected readonly searchService = inject(SearchService); // Inject SearchService
    private elementRef = inject(ElementRef); // Inject ElementRef for click outside

    // --- Component State ---
    isDarkMode: boolean = this.darkmodeService.getCurrentTheme() === 'dark';
    currentUser = getCurrentUser();
    isCartEmpty = true;
    cartItems$ = this.storeSerice.select(selectCartItems);

    // --- Search State ---
    searchQuery = signal('');
    showResults = signal(false);
    isLoading = this.searchService.isLoading; // Use signal from service
    searchResults$ = this.searchService.searchResults$; // Use observable from service

    private cartSubscription: Subscription | undefined; // Subscription for cart items

    // --- Click Outside Logic ---
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.hideSearchResults();
        }
    }
    // --- End Click Outside Logic ---

    ngOnInit(): void {
        // Subscribe to cart items to update isCartEmpty flag
        this.cartSubscription = this.cartItems$.subscribe((items: IDish[] | undefined) => { // Handle potential undefined
            this.isCartEmpty = !(items && items.length > 0);
        });
    }

    ngOnDestroy(): void {
        // Clean up cart subscription
        this.cartSubscription?.unsubscribe();
        // SearchService manages its own internal subscriptions/subjects
    }

    // --- Search Methods ---
    onSearchInput(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const term = inputElement.value;
        this.searchQuery.set(term);
        this.searchService.updateSearchTerm(term);
        this.showResults.set(term.trim().length > 0);
    }

    onSearchFocus(): void {
      if (this.searchQuery().trim().length > 0) {
        this.showResults.set(true);
      }
    }

    hideSearchResults(): void {
        this.showResults.set(false);
    }

    navigateSearch(result: SearchResultItem): void {
        if (result.type === 'restaurant') {
           this.router.navigate([`/user/restaurant/${result.id}`])
        } else if (result.type === 'menuItem') {
            this.router.navigate([`/user/restaurant/${result.restaurantId}`])
        }
    }

    // --- Existing Methods ---
    toggleTheme(): void {
        this.darkmodeService.toggleTheme();
        this.isDarkMode = this.darkmodeService.getCurrentTheme() === 'dark';
    }

    openCartSheet() {
        this.sheetService.create({
            zTitle: 'Cart',
            zContent: CartSheet,
            zOkText: !this.isCartEmpty ? 'Checkout' : null,
            zSize: 'lg',
            zOnOk: () => {
                if (!this.isCartEmpty) {
                    this.router.navigate(['user/checkout']);
                }
            },
        });
    }

    openOptionsSheet() {
        this.sheetService.create({
            zContent: UserOptionsSheet,
            zSize: 'sm',
            zSide: 'left',
            zOkText: 'logout',
            zOnOk: (instance: any) => { // Consider using a specific type for instance
                if (instance && typeof instance.handleLogout === 'function') {
                    instance.handleLogout();
                } else {
                    console.warn('UserOptionsSheet instance or handleLogout method not found.');
                }
            },
        });
    }
}