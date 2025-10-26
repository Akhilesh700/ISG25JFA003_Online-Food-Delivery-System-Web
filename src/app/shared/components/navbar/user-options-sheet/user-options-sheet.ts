import { Component, inject } from '@angular/core';
import { ZardBreadcrumbModule } from "@shared/components/sheet/sheet.module";
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-user-options-sheet',
  imports: [ZardBreadcrumbModule],
  templateUrl: './user-options-sheet.html',
  styleUrl: './user-options-sheet.css'
})
export class UserOptionsSheet {
  private authService = inject(AuthService)

  currentUser = {
    userId: '123',
    name: 'Eren Yeager',
    avatarUrl: 'img/avatar/user.png',
    location: 'Coimbatore, In'
  }

  handleLogout(){
    this.authService.logout();

  }

}
