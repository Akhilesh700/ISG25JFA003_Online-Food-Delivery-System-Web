import { Component, OnInit, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItemCardComponent } from './menu-item-card/menu-item-card'; 
import { MenuItemDialogComponent } from './menu-item-dialog/menu-item-dialog'; 
import { MenuItem } from '../../../shared/models/menuitem';
import { MenuService } from '../../../core/services/restaurant/manage-menu.service';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, MenuItemCardComponent, MenuItemDialogComponent],
  templateUrl: './manage-menu.html', 
})
export class MenuManagementComponent implements OnInit {
  menuItems$: Observable<MenuItem[]>;
  isDialogOpen = false;
  editingItem: MenuItem | null = null;
  error$ = new BehaviorSubject<string | null>(null);

  private menuService = inject(MenuService);
  // AuthService is removed

  constructor() {
    this.menuItems$ = this.menuService.menuItems$;
  }

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadMenuItems(): void {
    this.error$.next(null); 
    this.menuService.loadMenuItems().subscribe({ 
        error: (err) => {
          console.error('Failed to load menu items:', err);
          // Check for 401/403 errors specifically if needed
          this.error$.next('Failed to load your menu items. Please ensure you are logged in.');
        }
    });
  }

  openDialog(item: MenuItem | null = null): void {
    this.editingItem = item;
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.editingItem = null;
  }
  handleSave(itemFromDialog: Omit<MenuItem, 'itemId' | 'restId'> & { itemId?: number }): void {
    const { itemId, ...itemData } = itemFromDialog; // itemData does not have restId

    // Determine add or update
    const operation = (itemId !== undefined && itemId !== null)
      ? this.menuService.updateMenuItem(itemId, { ...itemData, itemId } as MenuItem) 
      : this.menuService.addMenuItem(itemData as Omit<MenuItem, 'itemId'>); 

    operation.subscribe({
      error: (err) => {
        console.error('Failed to save item:', err);
        this.error$.next('Failed to save item. Please check details and try again.');
      },
      next: () => {
        this.closeDialog();
        window.location.reload(); 
      }
    });
  }

  handleDelete(itemId: number): void { 
    if (confirm('Are you sure you want to delete this item?')) {
      this.menuService.deleteMenuItem(itemId).subscribe({
        error: (err) => {
           console.error('Failed to delete item:', err);
           this.error$.next('Failed to delete item. Please try again.');
        },
        next: () => {
            window.location.reload();
        }
      });
    }
  }
}