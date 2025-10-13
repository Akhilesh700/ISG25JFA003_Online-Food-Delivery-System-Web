import { Component, inject, NgModule } from '@angular/core';
import { ZardSwitchComponent } from "../switch/switch.component";
import { DarkModeService } from '@shared/services/darkmode.service';
import { FormsModule, NgModel } from '@angular/forms';

const getCurrentUser = () => {
  return {
    userId: '123',
    name: 'John Doe',
    avatarUrl: 'https://i.pravatar.cc/300',
    location: 'Coimbatore, In'
  }
}
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ZardSwitchComponent, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  protected readonly darkmodeService = inject(DarkModeService);

  isDarkMode: boolean = this.darkmodeService.getCurrentTheme() === 'dark';

  currentUser = getCurrentUser();


  toggleTheme(): void {
    this.darkmodeService.toggleTheme();

    this.isDarkMode = this.darkmodeService.getCurrentTheme() === 'dark';
  }



}
